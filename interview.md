# RoomLY Meeting Room - Interview Explanation Guide

## Project Overview

RoomLY is a real-time meeting application where users can:

* Create meetings
* Join meetings using a Meeting ID
* View live participants
* Leave meetings
* End meetings (Host only)
* See participant updates instantly without refreshing

To achieve real-time communication, I used:

* React.js (Frontend)
* Node.js + Express.js (Backend)
* Socket.IO (Real-Time Communication)
* MongoDB (Database)

---

# Problem Statement

Suppose User A joins a meeting.

How will User B know that User A joined?

Without Socket.IO:

* User B would need to refresh the page.
* Bad user experience.
* Not real-time.

Therefore I used Socket.IO.

Socket.IO allows the server to instantly notify all connected users whenever something changes.

---

# Complete Flow

## Step 1: User Opens Meeting Page

Example URL:

```txt
/meeting/abc123
```

React Router extracts:

```js
const { meetingId } = useParams();
```

Now:

```txt
meetingId = abc123
```

Why?

Because every meeting must know which room the user wants to join.

---

# Step 2: User Clicks Join Meeting

Function:

```js
joinMeeting()
```

Frontend sends:

```js
POST /meetings/:meetingId/join
```

Example:

```txt
POST /meetings/abc123/join
```

---

# Why Call Backend First?

Interview Answer:

Before allowing a user into the room we must validate:

* Is the meeting valid?
* Does the meeting exist?
* Has the meeting already ended?
* Is the user authenticated?

The backend is the source of truth.

Never trust frontend data.

---

# Backend Response

Backend returns:

```js
{
   meeting,
   participant
}
```

Example:

```js
{
   meeting:{
      meetingId:"abc123",
      meetingName:"Frontend Interview"
   },

   participant:{
      _id:"u1",
      name:"Govind"
   }
}
```

Frontend stores:

```js
setMeeting(meetingData);
```

---

# Step 3: Connect Socket

```js
if(!socket.connected){
   socket.connect();
}
```

Why?

Socket connection is expensive.

We should only create it when needed.

Avoid duplicate connections.

---

# Step 4: Join Socket Room

Frontend emits:

```js
socket.emit("joinMeeting",{
   meetingId,
   participant
});
```

Meaning:

```txt
Server,
I joined meeting abc123.
My details are Govind.
```

---

# Step 5: Server Receives Event

Backend:

```js
socket.on("joinMeeting", ...)
```

Receives:

```js
{
   meetingId,
   participant
}
```

---

# Why socket.join()?

```js
socket.join(meetingId);
```

Example:

Meeting A:

```txt
abc123
```

Meeting B:

```txt
xyz999
```

If 100 users are connected:

Without rooms:

```txt
Every user receives every event.
```

Very bad.

With rooms:

```txt
abc123 users only receive abc123 events.
```

Much more scalable.

---

# Step 6: Store Participants

Current structure:

```js
meetingParticipants = {
   abc123:[
      {
         _id:"u1",
         name:"Govind",
         socketId:"socket123"
      }
   ]
}
```

Why?

Socket.IO only knows sockets.

But UI needs:

* Name
* Email
* User Id

Therefore we store participant information separately.

---

# Why Check Existing User?

```js
findIndex(...)
```

Suppose:

* User refreshes page
* New socket connection created

Without checking:

```txt
Govind
Govind
Govind
```

would appear multiple times.

Therefore:

```js
existingIndex !== -1
```

updates existing participant.

---

# Step 7: Broadcast Participants

```js
io.to(meetingId).emit(
   "participantsUpdated",
   meetingParticipants[meetingId]
);
```

Meaning:

```txt
Everyone inside this room,
here is the latest participant list.
```

---

# Step 8: Frontend Receives Update

```js
socket.on(
   "participantsUpdated",
   handleParticipants
);
```

Receives:

```js
[
   Govind,
   Rahul,
   Sai
]
```

Updates state:

```js
setParticipants(users);
```

React re-renders automatically.

No refresh required.

---

# Step 9: Leave Meeting

User clicks:

```js
Leave
```

Current flow:

```js
socket.disconnect();
```

Server receives:

```js
disconnect
```

---

# What Happens During Disconnect?

Server executes:

```js
socket.on("disconnect")
```

Then:

```js
filter(...)
```

removes that user.

Example:

Before:

```txt
Govind
Rahul
Sai
```

After Govind leaves:

```txt
Rahul
Sai
```

---

# Why Emit Again?

```js
io.to(meetingId).emit(...)
```

Remaining users must instantly see:

```txt
2 Participants
```

instead of

```txt
3 Participants
```

---

# Step 10: End Meeting

Only host sees:

```txt
End Meeting Button
```

Why?

```js
setIsHost(...)
```

checks:

```js
meeting.hostId === participant._id
```

Only meeting creator becomes host.

---

# Host Clicks End Meeting

Frontend:

```js
PATCH /meetings/:id/end
```

Backend:

```txt
Meeting status = ended
```

---

# Why Update Database?

Because sockets are temporary.

Database is permanent.

If server restarts:

Database still remembers:

```txt
Meeting ended.
```

---

# Emit Meeting End Event

```js
socket.emit(
   "endMeeting",
   { meetingId }
);
```

Server:

```js
io.to(meetingId).emit(
   "meetingEnded"
);
```

Every participant receives:

```txt
meetingEnded
```

event.

---

# Frontend Receives Event

```js
socket.on(
   "meetingEnded",
   handleMeetingEnded
);
```

Then:

```js
navigate("/home/meetings");
```

Everyone leaves automatically.

---

# Why Delete Participants?

```js
delete meetingParticipants[meetingId];
```

Why?

Meeting is finished.

No need to keep data in memory.

Saves RAM.

---

# Architecture Summary

Frontend

```txt
Join Meeting
↓
Connect Socket
↓
Emit joinMeeting
↓
Receive participantsUpdated
↓
Update UI
```

Backend

```txt
Receive joinMeeting
↓
Store User
↓
Join Socket Room
↓
Broadcast Participants
↓
Handle Disconnect
↓
Broadcast Updated List
```

---

# Interview Questions & Answers

## Q1 Why use Socket.IO?

Answer:

Socket.IO provides real-time bidirectional communication between client and server. It allows participant updates, chat messages, meeting status changes, and future WebRTC signaling without page refreshes.

---

## Q2 Why not use REST APIs only?

Answer:

REST APIs require polling or refreshing. Socket.IO pushes updates instantly, reducing latency and improving user experience.

---

## Q3 Why use Rooms?

Answer:

Rooms isolate events. Users only receive events related to their meeting instead of receiving updates from every meeting in the system.

---

## Q4 Why store socketId?

Answer:

socketId uniquely identifies a connection. It helps remove users when they disconnect and enables sending events to specific users in future features.

---

## Q5 What happens when user refreshes page?

Answer:

Old socket disconnects. New socket connects. The existing participant entry is updated instead of creating duplicates.

---

## Q6 What are limitations of current implementation?

Answer:

Current participant storage is in-memory.

```js
const meetingParticipants = {}
```

If server restarts, participant data is lost.

For production systems:

* Redis
* MongoDB
* Distributed Session Storage

would be used.

---

## Q7 Why WebRTC Later?

Answer:

Socket.IO handles signaling only.

Actual:

* Video
* Audio
* Screen Sharing

should use WebRTC because media streaming through Socket.IO would overload the server.

Socket.IO exchanges metadata.

WebRTC exchanges media directly peer-to-peer.

---

## Q8 Difference Between Socket.IO and WebRTC?

Socket.IO:

```txt
Chat
Notifications
Participant Updates
Signaling
```

WebRTC:

```txt
Video
Audio
Screen Sharing
```

---

## Q9 What Would You Build Next?

Answer:

Phase 3:

* WebRTC
* Camera Toggle
* Mic Toggle
* Screen Sharing
* Peer Connections
* ICE Candidate Exchange
* STUN/TURN Integration

Then:

* Chat
* Waiting Room
* Recording
* Reactions
* Breakout Rooms

---

# One-Line Interview Summary

"I used React and Socket.IO to build a real-time meeting room where users join a room, are tracked using socket rooms, receive live participant updates through event broadcasting, and can leave or end meetings with all connected users synchronized instantly without page refreshes."


# RoomLY Phase 3 - Camera & Microphone Setup (Interview Explanation)

## Feature Overview

This feature allows a user to:

* Access camera
* Access microphone
* Preview their own video before connecting
* Turn camera on/off
* Turn microphone on/off
* Leave meeting safely

This is the first step before implementing WebRTC video calling.

---

# Why Did I Build This?

Before users can send video/audio to others:

1. We must access their camera.
2. We must access their microphone.
3. We must show a local preview.
4. We must allow them to control media devices.

Without this step, WebRTC cannot send media streams.

Think of this as:

```txt
Camera + Mic Access
        ↓
Local Video Preview
        ↓
WebRTC Connection
        ↓
Remote Users Receive Stream
```

So this feature acts as the foundation for video calling.

---

# Complete Flow

## Step 1: User Opens Meeting Room

Example:

```txt
/meeting/abc123
```

React Router extracts:

```js
const { meetingId } = useParams();
```

Now we know which meeting user joined.

---

# Step 2: Component Loads

React executes:

```js
useEffect(() => {
   initializeMedia();
}, []);
```

Why?

Because we want camera and microphone to start immediately when user enters the meeting.

The empty dependency array means:

```txt
Run only once
when component mounts.
```

---

# Step 3: Request Camera & Microphone Permission

Function:

```js
initializeMedia()
```

Inside:

```js
navigator.mediaDevices.getUserMedia()
```

---

# What is getUserMedia()?

Interview Answer:

getUserMedia() is a browser Web API that requests access to media devices such as:

* Camera
* Microphone

It returns a MediaStream object containing audio and video tracks.

---

# Why Use It?

Without permission:

```txt
No camera
No microphone
No video call
```

The browser must explicitly ask the user.

Example popup:

```txt
Allow camera?
Allow microphone?
```

---

# What Happens Internally?

Browser:

```txt
User grants permission
        ↓
Camera starts
        ↓
Microphone starts
        ↓
MediaStream created
        ↓
Returned to React
```

---

# Step 4: Store Stream

After getting stream:

```js
localStreamRef.current = stream;
```

---

# Why useRef Instead of useState?

Interview Question

Why not:

```js
setStream(stream);
```

Answer:

A MediaStream object is large and changes frequently.

Using state causes unnecessary re-renders.

useRef:

```txt
Stores value
without re-rendering
```

Better performance.

---

# Step 5: Display Local Video

We have:

```js
const localVideoRef = useRef(null);
```

This points to:

```html
<video />
```

Then:

```js
localVideoRef.current.srcObject = stream;
```

---

# What Does srcObject Mean?

Normally videos use:

```html
video.src = "movie.mp4"
```

For live camera feed:

```js
video.srcObject = stream
```

Browser directly renders live frames from camera.

---

# Result

User sees:

```txt
Their own camera preview
```

inside the meeting room.

---

# Why muted?

Video tag:

```jsx
muted
```

Interview Question:

Why mute local video?

Answer:

Without mute:

```txt
Microphone
↓
Speaker
↓
Microphone
↓
Speaker
```

Creates audio feedback loop.

Users hear their own voice repeatedly.

So local preview is always muted.

---

# Step 6: Toggle Camera

Button:

```js
toggleCamera()
```

Gets:

```js
getVideoTracks()[0]
```

---

# What is a Track?

A MediaStream contains:

```txt
Video Track
Audio Track
```

Example:

```txt
MediaStream
 ├─ Video Track
 └─ Audio Track
```

---

# Camera Toggle Logic

```js
videoTrack.enabled =
   !videoTrack.enabled;
```

---

# Why Use enabled?

Interview Answer:

Disabling a track is better than stopping it.

Because:

```txt
Stop Track
↓
Need new permission request
↓
Need new stream
```

Whereas:

```txt
enabled = false
↓
Camera temporarily pauses
↓
Can instantly resume
```

Much better user experience.

---

# Camera Off Flow

```txt
User clicks camera button
        ↓
enabled = false
        ↓
Video stops sending frames
        ↓
Camera icon changes
```

---

# Step 7: Toggle Microphone

Function:

```js
toggleMic()
```

Gets:

```js
getAudioTracks()[0]
```

Then:

```js
audioTrack.enabled =
   !audioTrack.enabled;
```

---

# Why Same Approach?

Because:

```txt
enabled = false
```

temporarily stops audio transmission.

No need to recreate microphone stream.

Efficient.

---

# Microphone Off Flow

```txt
User clicks Mic button
        ↓
enabled = false
        ↓
Audio stops
        ↓
MicOff icon shown
```

---

# Step 8: Error Handling

Suppose user clicks:

```txt
Block Camera
```

or

```txt
Block Microphone
```

Browser throws error.

Catch block:

```js
catch(err)
```

Displays:

```txt
Camera or microphone permission denied.
```

---

# Why Handle Errors?

Without it:

```txt
Blank Screen
```

User won't know what happened.

Good UX always explains failures.

---

# Step 9: Cleanup

Inside:

```js
return () => {
}
```

React cleanup runs when:

```txt
Component unmounts
```

or

```txt
User leaves page
```

---

# Why Stop Tracks?

Code:

```js
stream
 .getTracks()
 .forEach(track => track.stop());
```

---

# What Happens If We Don't?

Camera remains active.

Browser still uses:

* Camera
* Microphone
* Memory

This causes resource leaks.

---

# Cleanup Flow

```txt
User leaves page
        ↓
Cleanup executes
        ↓
Tracks stop
        ↓
Camera LED turns off
        ↓
Resources released
```

---

# Step 10: Leave Meeting

When user clicks:

```txt
Leave
```

We:

```js
track.stop()
```

Then:

```js
navigate("/home/meetings")
```

---

# Why Stop Before Navigation?

Interview Answer:

Navigation removes UI.

But camera may still be running.

Always release media resources before leaving.

---

# Architecture Diagram

```txt
User Opens Meeting
        ↓
initializeMedia()
        ↓
getUserMedia()
        ↓
Permission Granted
        ↓
MediaStream Created
        ↓
Store In Ref
        ↓
Attach To Video Element
        ↓
Show Local Preview
        ↓
Toggle Camera/Mic
        ↓
Leave Meeting
        ↓
Stop Tracks
```

---

# Interview Questions & Answers

## Q1 What is getUserMedia()?

Answer:

A browser Web API used to access camera and microphone devices. It returns a MediaStream object.

---

## Q2 Why use useRef for MediaStream?

Answer:

MediaStream is mutable and doesn't need UI re-renders. useRef stores it efficiently without causing component updates.

---

## Q3 What is a MediaStream?

Answer:

A MediaStream is a collection of media tracks, typically audio and video, captured from user devices.

---

## Q4 What is the difference between MediaStream and MediaTrack?

Answer:

```txt
MediaStream
 ├─ Audio Track
 └─ Video Track
```

Stream contains tracks.

Tracks represent individual audio/video sources.

---

## Q5 Why use track.enabled instead of track.stop()?

Answer:

enabled = false temporarily pauses transmission and can be resumed instantly.

stop() permanently ends the track and requires creating a new stream.

---

## Q6 Why mute local video?

Answer:

To prevent audio feedback loops where users hear their own voice repeatedly.

---

## Q7 Why stop tracks on cleanup?

Answer:

To release camera and microphone resources and prevent memory leaks.

---

## Q8 Is this WebRTC?

Answer:

Not yet.

This feature only captures local media.

WebRTC starts when this MediaStream is attached to an RTCPeerConnection and shared with remote users.

---

## Q9 What Comes Next?

Answer:

Phase 3 continues with:

* RTCPeerConnection
* Offer Creation
* Answer Creation
* ICE Candidate Exchange
* STUN Server Integration
* Remote Video Streams
* Multi-User Video Grid

---

# One-Line Interview Summary

"I used the browser's getUserMedia API to capture camera and microphone streams, displayed the local preview using a video element, allowed users to toggle media tracks efficiently using track.enabled, and cleaned up resources properly when leaving the meeting, creating the foundation for future WebRTC video communication."
