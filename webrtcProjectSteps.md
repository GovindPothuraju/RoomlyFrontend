# WebRTC Learning Journey - Day 1

## Project

RoomLY (Zoom / Google Meet Clone)

Goal:

Build a production-ready video conferencing application while understanding WebRTC from first principles instead of blindly copying tutorials.

---

# What We Completed Today

## Step 1 - Local Camera Preview

### Goal

Access camera and microphone.

Display local video before joining a meeting.

### Architecture

```text
Camera
 ↓
Browser
 ↓
MediaStream
 ↓
Video Element
```

### Code Concept

```js
navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
});
```

### What getUserMedia Returns

```text
MediaStream
 ├── Audio Track
 └── Video Track
```

### Verification

```js
console.log(stream);
console.log(stream.getTracks());
console.log(stream.getVideoTracks());
console.log(stream.getAudioTracks());
```

Expected:

```text
MediaStream
Audio Track
Video Track
```

### Important Learning

getUserMedia does NOT create a WebRTC connection.

It only captures media from local devices.

### Interview Question

What does getUserMedia return?

Answer:

A MediaStream object containing MediaStreamTracks such as audio and video tracks.

---

# Step 1 Mistakes

## Mistake 1

Used:

```js
getDisplayMedia()
```

instead of:

```js
getUserMedia()
```

### Why Wrong

getDisplayMedia is for:

```text
Screen Sharing
Window Sharing
Tab Sharing
```

Not camera preview.

### Fix

```js
navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
});
```

---

## Mistake 2

Assuming camera should fully stop when:

```js
videoTrack.enabled = false;
```

### Reality

This only disables frame transmission.

Camera hardware may still appear active.

### Learning

```js
videoTrack.enabled = false;
```

means:

```text
Stop Sending Video
```

NOT

```text
Stop Camera Device
```

To completely stop:

```js
videoTrack.stop();
```

---

# Step 2 - RTCPeerConnection

### Goal

Create WebRTC Peer Connection.

No Offer.

No Answer.

No Network Communication.

### Architecture

```text
MediaStream


RTCPeerConnection
```

Separate objects.

Not connected.

### Code

```js
const pc = new RTCPeerConnection({
  iceServers:[
    {
      urls:"stun:stun.l.google.com:19302"
    }
  ]
});
```

### Why Create Peer Connection

RTCPeerConnection is the core WebRTC object responsible for:

```text
ICE
Network Management
Media Transport
Encryption
Connection Lifecycle
```

### Internal Components

```text
RTCPeerConnection
 ├── ICE Agent
 ├── Candidate Manager
 ├── Media Transport
 ├── Encryption Layer
 └── State Manager
```

### State Observed

```text
connectionState = new

iceConnectionState = new

iceGatheringState = new

signalingState = stable
```

### Meaning

```text
Peer Exists

No Connection

No Offer

No Answer

No ICE
```

### Verification

```js
console.log(pc);
```

Output:

```text
RTCPeerConnection
```

---

# Step 2 Mistakes

## Mistake 1

Trying to understand ICE before creating a Peer Connection.

### Learning

Order matters:

```text
Camera
 ↓
Peer Connection
 ↓
Tracks
 ↓
ICE
 ↓
Offer
 ↓
Answer
```

---

## Mistake 2

Not understanding why STUN was configured.

### Learning

This does NOT contact Google.

```js
iceServers:[
  {
    urls:"stun:stun.l.google.com:19302"
  }
]
```

Only tells browser:

```text
When ICE starts,
use this STUN server.
```

---

# Step 3 - Add Tracks To Peer Connection

### Goal

Attach camera and microphone to WebRTC.

### Before

```text
Camera
 ↓
MediaStream


RTCPeerConnection
```

Independent.

### After

```text
Camera
 ↓
MediaStream
 ↓
RTCPeerConnection
 ├── Audio Sender
 └── Video Sender
```

### Code

```js
localStream.getTracks().forEach(track=>{
  pc.addTrack(track,localStream);
});
```

### What addTrack Does

Interview Answer:

addTrack attaches a MediaStreamTrack to an RTCPeerConnection so it can later be transmitted to remote peers.

---

# Production Improvement

Initial Version

```js
localStream.getTracks().forEach(track=>{
  pc.addTrack(track,localStream);
});
```

Problem:

If React rerenders:

```text
Audio Added Again
Video Added Again
```

Browser throws:

```text
A sender already exists for the track
```

---

# Improved Version

```js
const sendersByKind = new Map(
  pc.getSenders().map(
    sender=>[
      sender.track?.kind,
      sender
    ]
  )
);

localStream.getTracks().forEach(track=>{

  if(sendersByKind.has(track.kind))
    return;

  pc.addTrack(track,localStream);

});
```

### Why Better

Prevents duplicate audio/video senders.

Production-safe.

---

# Understanding Senders

After:

```js
pc.addTrack(...)
```

Browser creates:

```text
RTCRtpSender(Audio)

RTCRtpSender(Video)
```

Verification:

```js
console.log(
  pc.getSenders()
);
```

Expected:

```text
[
 Audio Sender,
 Video Sender
]
```

Verification:

```js
console.log(
  pc.getSenders().length
);
```

Expected:

```text
2
```

---

# React Mistake Found

Error:

```text
Rendered more hooks than during previous render
```

### Cause

Hook declared after:

```js
if(!joined){
  return ...
}
```

Example:

```js
if(!joined){
  return ...
}

useEffect(...)
```

### Why Wrong

Hooks must execute in same order every render.

### Fix

```js
useEffect(...)

if(!joined){
  return ...
}
```

---

# Architecture At End Of Day

```text
Camera
 ↓
MediaStream
 ↓
RTCPeerConnection
 ├── Audio Sender
 └── Video Sender
```

Still Missing:

```text
Offer
Answer
ICE Candidates
Remote Stream
Socket Signaling
```

---

# What We Have NOT Done Yet

❌ createOffer()

❌ createAnswer()

❌ ICE Candidate Exchange

❌ STUN Communication

❌ TURN

❌ SDP

❌ Remote Video

❌ Multiple Participants

---

# Day 2 Plan

## Step 4

ICE Candidate Generation

Learn:

```text
What ICE Candidate Is

Host Candidate

Server Reflexive Candidate

Relay Candidate

STUN In Practice
```

Expected Logs:

```text
candidate:
192.168.x.x

candidate:
49.x.x.x
```

---

## Step 5

Offer Creation

Learn:

```text
SDP

createOffer()

setLocalDescription()
```

---

## Step 6

Answer Creation

Learn:

```text
createAnswer()

setRemoteDescription()
```

---

## Step 7

Socket Signaling

Learn:

```text
Offer Transfer

Answer Transfer

ICE Transfer
```

---

# Key Learnings

WebRTC is NOT:

```text
getUserMedia()
```

WebRTC starts with:

```text
RTCPeerConnection
```

Camera Preview and WebRTC are separate systems.

A MediaStream does not automatically belong to a Peer Connection.

Tracks must be explicitly attached.

React rerenders can create duplicate senders if not handled correctly.

Always verify each step with console logs before moving forward.
