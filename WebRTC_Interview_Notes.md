# WebRTC Complete Interview & System Design Handbook

## Table of Contents

1. Why WebRTC Matters
2. Before WebRTC (Flash & Plugins)
3. HTTP vs WebRTC
4. TCP vs UDP
5. Why Real-Time Apps Use UDP
6. WebRTC Protocol Stack
7. NAT Traversal Problem
8. STUN Server
9. TURN Server
10. ICE Framework
11. How WebRTC Connections Work
12. SDP Explained
13. 20-Line WebRTC Example
14. RTC Data Channels
15. Screen Sharing
16. Why Peer-to-Peer Fails at Scale
17. Mesh Architecture
18. SFU Architecture
19. MCU Architecture
20. MCU vs SFU
21. Production Zoom-Like System Design
22. Complete WebRTC Project
23. 50 Interview Questions
24. One-Page Cheat Sheet

---

# SECTION 1: WHY WEBRTC MATTERS

## Interview Definition

WebRTC (Web Real-Time Communication) is an open-source browser technology that enables real-time audio, video, and data communication directly between peers without requiring external plugins.

### Why It Was Created

Before WebRTC:

* Flash plugins were required
* Browser compatibility was poor
* Security risks were high
* Installation was required

WebRTC solved these issues by making real-time communication a native browser capability.

### Real World Examples

* Google Meet
* Zoom
* WhatsApp Calling
* Discord
* Microsoft Teams

### Architecture

```text
+-------------+                     +-------------+
| Browser A   |<----Media/Data----->| Browser B   |
| Camera      |                     | Camera      |
| Microphone  |                     | Microphone  |
+-------------+                     +-------------+
```

### Browser Components

```text
Browser
 ├── Camera
 ├── Microphone
 ├── RTCPeerConnection
 ├── ICE Agent
 ├── DTLS
 ├── SRTP
 └── Network Stack
```

### Advantages

* Low latency
* Peer-to-peer
* Secure
* Built into browsers

### Disadvantages

* NAT traversal complexity
* TURN cost
* Scaling challenges

### Interview Questions

Q: Why was WebRTC introduced?

Answer:
To provide native browser-based real-time communication without plugins.

---

# SECTION 2: BEFORE WEBRTC

## Flash Architecture

```text
Browser
   |
 Flash Plugin
   |
 Flash Media Server
   |
 Remote User
```

### Problems

* Plugin installation
* Security vulnerabilities
* Browser crashes
* High CPU usage

### Java Applets

```text
Browser
   |
 JVM
   |
 Applet
```

Issues:

* Large download size
* Security restrictions
* Poor UX

---

# SECTION 3: HTTP VS WEBRTC

| Feature | HTTP    | WebSocket | WebRTC   |
| ------- | ------- | --------- | -------- |
| Latency | High    | Medium    | Very Low |
| Duplex  | No      | Yes       | Yes      |
| Video   | No      | No        | Yes      |
| Audio   | No      | No        | Yes      |
| Data    | Limited | Yes       | Yes      |

### HTTP Request Flow

```text
Client
  |
 Request
  |
 Server
  |
 Response
```

### WebRTC Flow

```text
Peer A <-----------------> Peer B
```

Real-time media exchange.

---

# SECTION 4: TCP VS UDP

## TCP Definition

Reliable transport protocol.

### Handshake

```text
Client ---- SYN ---->
Server <--- SYN ACK ---
Client ---- ACK ---->
```

### Features

* Ordered
* Reliable
* Retransmission

### UDP Definition

Connectionless protocol.

```text
Client ---> Packet
Client ---> Packet
Client ---> Packet
```

No guarantee of delivery.

### Why Video Calls Use UDP

Receiving the latest frame is more important than receiving every frame.

---

# SECTION 5: WHY REAL-TIME APPS USE UDP

Example:

Missing packet:

```text
Frame1
Frame2
Frame3 (lost)
Frame4
Frame5
```

Option A:

Wait for Frame3

Result:
Video freezes.

Option B:

Skip Frame3

Result:
Video continues smoothly.

Therefore WebRTC prefers UDP.

---

# SECTION 6: WEBRTC PROTOCOL STACK

```text
Application
    |
WebRTC APIs
    |
SRTP
    |
DTLS
    |
ICE
    |
STUN/TURN
    |
UDP
    |
IP
    |
Network
```

Layer purposes:

SRTP:
Encrypt media

DTLS:
Key exchange

ICE:
Find best route

STUN:
Discover public IP

TURN:
Relay traffic

---

# SECTION 7: NAT TRAVERSAL

Home Network

```text
Laptop
   |
192.168.1.10
   |
Router
   |
Public IP
   |
Internet
```

Problem:

Remote peer cannot reach private IP.

### NAT Types

1. Full Cone NAT
2. Restricted NAT
3. Port Restricted NAT
4. Symmetric NAT

Symmetric NAT is the hardest case.

---

# SECTION 8: STUN SERVER

Purpose:

Discover public IP.

```text
Browser
   |
Router
   |
STUN Server
```

Response:

```text
Your Public IP:
49.x.x.x
Port:
50021
```

---

# SECTION 9: TURN SERVER

Used when direct connection fails.

```text
Peer A
   |
 TURN
   |
Peer B
```

Traffic:

```text
A -> TURN -> B
```

Bandwidth cost doubles.

---

# SECTION 10: ICE

Candidate Types:

1. Host
2. Server Reflexive
3. Relay

ICE Process:

```text
Gather
Exchange
Check
Select
Connect
```

---

# SECTION 11: HOW WEBRTC CONNECTIONS WORK

## Interview Definition

A WebRTC connection is established through a signaling process where two peers exchange metadata (Offer, Answer, ICE Candidates) and then communicate directly using secure peer-to-peer connections.

---

# Complete End-to-End Flow

```text
User A                        Signaling Server                     User B
   |                                  |                              |
   |-----------Join Room------------->|                              |
   |                                  |                              |
   |<---------User Joined-------------|                              |
   |                                  |                              |
   |------Create Offer--------------->|----------------------------->|
   |                                  |                              |
   |                                  |------Create Answer---------->|
   |                                  |<-----------------------------|
   |<-----------Answer----------------|                              |
   |                                  |                              |
   |------ICE Candidates------------->|----------------------------->|
   |<-----ICE Candidates--------------|<-----------------------------|
   |                                  |                              |
   |========= P2P Connection Established =========|
```

---

# Step 1: User Opens Page

Browser loads:

```html
<script src="/socket.io/socket.io.js"></script>
```

Connect to signaling server.

```javascript
const socket = io();
```

Purpose:

* Discover other users
* Exchange signaling messages

---

# Step 2: Access Camera and Microphone

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
});
```

Browser asks permission.

```text
Allow Camera?
Allow Microphone?
```

If accepted:

```text
Camera Track
Microphone Track
```

are created.

---

# Step 3: Create RTCPeerConnection

```javascript
const peer = new RTCPeerConnection({
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
});
```

Purpose:

* Manage connection
* Handle encryption
* Handle media
* Handle ICE

---

# Step 4: Add Local Tracks

```javascript
stream.getTracks().forEach(track => {
    peer.addTrack(track, stream);
});
```

Browser now knows:

```text
Send:
  Video
  Audio
```

to remote peer.

---

# Step 5: Create Offer

Caller:

```javascript
const offer = await peer.createOffer();
await peer.setLocalDescription(offer);
```

Generated SDP:

```text
v=0
o=-
s=-
m=video
m=audio
```

Send offer via signaling server.

---

# Step 6: Remote Creates Answer

Receiver:

```javascript
await peer.setRemoteDescription(offer);

const answer = await peer.createAnswer();

await peer.setLocalDescription(answer);
```

Send answer back.

---

# Step 7: ICE Candidate Exchange

Browser discovers routes.

Example:

```text
192.168.1.5
49.205.xx.xx
TURN Relay
```

Send:

```javascript
peer.onicecandidate = (event) => {
    socket.emit("candidate", event.candidate);
};
```

Receive:

```javascript
peer.addIceCandidate(candidate);
```

---

# Step 8: Direct Connection Established

ICE selects best path.

Preferred:

```text
Host Candidate
↓
STUN Candidate
↓
TURN Candidate
```

Media starts flowing.

---

# Browser Internal Flow

```text
Camera
   |
Media Stream
   |
RTCPeerConnection
   |
ICE
   |
DTLS
   |
SRTP
   |
UDP
   |
Network
```

---

# Interview Questions

### Q1

Why is signaling required?

Answer:

WebRTC does not define signaling.
Peers need a mechanism to exchange Offer, Answer and ICE candidates.

### Q2

Does media flow through signaling server?

Answer:

No.

Only metadata flows through signaling.

Media flows directly between peers.

---

# SECTION 12: SDP EXPLAINED

## Interview Definition

SDP (Session Description Protocol) is a text-based format used to describe media capabilities between peers.

It tells:

```text
Audio codecs
Video codecs
Encryption
IP information
Ports
```

---

# Why SDP Exists

Imagine:

User A supports:

```text
VP8
H264
```

User B supports:

```text
VP8
```

Need negotiation.

SDP solves this.

---

# Real SDP Example

```text
v=0
o=- 46117326 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE 0 1
m=audio 9 UDP/TLS/RTP/SAVPF 111
m=video 9 UDP/TLS/RTP/SAVPF 96
```

---

# Line by Line

## v=0

Version

```text
v=0
```

Means SDP version.

---

## o=-

Origin field.

```text
o=- 46117326 2 IN IP4 127.0.0.1
```

Contains session creator info.

---

## s=-

Session name.

```text
s=-
```

---

## t=0 0

Session time.

```text
t=0 0
```

Unlimited session.

---

## m=audio

Media section.

```text
m=audio 9 UDP/TLS/RTP/SAVPF 111
```

Contains:

```text
Audio
Port
Protocol
Codec
```

---

## m=video

Video section.

```text
m=video 9 UDP/TLS/RTP/SAVPF 96
```

---

# Offer Example

```javascript
const offer = await peer.createOffer();
```

Creates:

```text
I support:
VP8
H264
Opus
```

---

# Answer Example

```javascript
const answer = await peer.createAnswer();
```

Returns:

```text
I choose:
VP8
Opus
```

---

# Negotiation Example

```text
Offer:
 VP8
 H264

Answer:
 VP8
```

Result:

```text
VP8 Selected
```

---

# Interview Questions

### What is SDP?

Text document describing media capabilities.

### Does SDP establish connection?

No.

ICE establishes connection.

SDP only negotiates media.

---

# SECTION 13: 20-LINE WEBRTC EXAMPLE

## Minimal Working Example

```html
<script>
const peer = new RTCPeerConnection();

navigator.mediaDevices
.getUserMedia({video:true,audio:true})
.then(stream => {

stream.getTracks().forEach(track => {
peer.addTrack(track,stream);
});

peer.ontrack = e => {
document.querySelector("video")
.srcObject = e.streams[0];
};

peer.createOffer()
.then(offer => peer.setLocalDescription(offer))
.then(() => {
console.log(peer.localDescription);
});

});
</script>
```

---

# Line by Line Explanation

## Line 1

```javascript
const peer = new RTCPeerConnection();
```

Creates WebRTC engine.

---

## Line 2

```javascript
getUserMedia()
```

Requests camera.

---

## Line 3

```javascript
stream.getTracks()
```

Gets:

```text
Video Track
Audio Track
```

---

## Line 4

```javascript
peer.addTrack()
```

Adds track for transmission.

---

## Line 5

```javascript
peer.ontrack
```

Handles incoming media.

---

## Line 6

```javascript
createOffer()
```

Generates SDP.

---

## Line 7

```javascript
setLocalDescription()
```

Stores SDP locally.

---

# Browser Internal Workflow

```text
Camera
 ↓
MediaStream
 ↓
Track
 ↓
RTCPeerConnection
 ↓
Offer
 ↓
ICE
 ↓
UDP
 ↓
Network
```

---

# Common Mistakes

### Forgetting setLocalDescription

Wrong:

```javascript
createOffer();
```

Correct:

```javascript
await peer.setLocalDescription(offer);
```

---

### Forgetting ICE Candidates

Without ICE:

```text
No route discovered
Connection fails
```

---

### Not Adding Tracks

Without:

```javascript
addTrack()
```

No media transmitted.

---

# Senior Interview Question

Explain createOffer internally.

Answer:

Browser generates SDP by inspecting:

* Supported codecs
* Encryption capabilities
* RTP settings
* Transport settings

Then serializes these capabilities into SDP format for negotiation.

# SECTION 14: RTC DATA CHANNELS

## Interview Definition

RTC Data Channels allow two WebRTC peers to exchange arbitrary data directly without using a server after the connection is established.

Think of it as:

```text
WebSocket
     +
Peer-to-Peer
     +
Encryption
```

---

# Why Data Channels Exist

Most people think WebRTC is only for:

* Audio Calls
* Video Calls

But WebRTC can also send:

* Chat Messages
* Game State
* File Transfers
* Whiteboard Data
* Cursor Positions
* JSON Objects

without passing through the backend.

---

# Real World Examples

## Discord

```text
Voice -> WebRTC
Chat -> Data Channel
```

---

## Multiplayer Games

```text
Player Position
Player Health
Weapon Fire
```

sent through Data Channels.

---

## Collaborative Whiteboards

```text
Mouse Position
Drawing Coordinates
```

sent instantly.

---

# Architecture

```text
Peer A
   |
RTCDataChannel
   |
-----------------
 Direct P2P
-----------------
   |
RTCDataChannel
   |
Peer B
```

---

# Internal Protocol Stack

```text
Application
     |
RTCDataChannel
     |
SCTP
     |
DTLS
     |
UDP
     |
Internet
```

---

# Why SCTP?

Data Channels use:

```text
SCTP
(Stream Control Transmission Protocol)
```

instead of TCP.

Reason:

SCTP supports:

* Multiple Streams
* Reliability Options
* Ordered Delivery
* Unordered Delivery

---

# Reliable Mode

```javascript
const channel = peer.createDataChannel(
    "chat",
    {
        ordered: true
    }
);
```

Guarantees:

```text
Message 1
Message 2
Message 3
```

always arrive in order.

---

# Unreliable Mode

```javascript
const channel = peer.createDataChannel(
    "game",
    {
        ordered:false,
        maxRetransmits:0
    }
);
```

Used for:

```text
Gaming
Cursor Updates
Live Position Updates
```

Missing packets are ignored.

---

# Why Unreliable Mode Is Useful

Imagine:

```text
Position:
X=10
```

packet lost.

Next packet:

```text
Position:
X=11
```

arrives.

No reason to resend old data.

---

# Working Chat Example

## Sender

```javascript
const channel =
peer.createDataChannel("chat");

channel.onopen = () => {
    channel.send("Hello");
};
```

---

## Receiver

```javascript
peer.ondatachannel = event => {

    const channel = event.channel;

    channel.onmessage = e => {
        console.log(e.data);
    };
};
```

---

# File Transfer Example

```javascript
const file = input.files[0];

const reader = new FileReader();

reader.onload = () => {
    channel.send(reader.result);
};

reader.readAsArrayBuffer(file);
```

---

# Interview Questions

### What protocol powers Data Channels?

Answer:

```text
SCTP
```

---

### Why not TCP?

Answer:

Because SCTP provides:

* Multiple streams
* Better flexibility
* Reduced head-of-line blocking

---

### Are Data Channels encrypted?

Answer:

Yes.

Using:

```text
DTLS
```

---

# Senior Interview Question

When would you choose unreliable mode?

Answer:

For rapidly changing data where the latest state matters more than perfect delivery.

Examples:

* Gaming
* Mouse Movement
* Whiteboards
* Cursor Sync

---

# SECTION 15: SCREEN SHARING

## Interview Definition

Screen Sharing allows a browser to capture a display, window, or browser tab and stream it through WebRTC.

---

# Real World Examples

* Google Meet
* Zoom
* Teams
* Discord

---

# Browser API

```javascript
navigator.mediaDevices.getDisplayMedia()
```

---

# Difference

## Camera

```javascript
getUserMedia()
```

captures:

```text
Camera
Microphone
```

---

## Screen Sharing

```javascript
getDisplayMedia()
```

captures:

```text
Entire Monitor
Window
Browser Tab
```

---

# Browser Flow

```text
User Clicks Share Screen
          |
          v
Browser Opens Picker
          |
          v
Select Screen
          |
          v
Media Stream Created
          |
          v
Sent Through WebRTC
```

---

# Example

```javascript
const stream =
await navigator.mediaDevices
.getDisplayMedia({
    video:true
});
```

---

# Show on Local Screen

```javascript
video.srcObject = stream;
```

---

# Send to Peer

```javascript
stream.getTracks().forEach(track => {
    peer.addTrack(track, stream);
});
```

---

# Architecture

```text
Monitor
   |
Display Stream
   |
RTCPeerConnection
   |
Internet
   |
Remote User
```

---

# Browser Permission Window

```text
Choose what to share

( ) Entire Screen
( ) Window
( ) Chrome Tab

Share
Cancel
```

---

# Sharing Browser Tab

```javascript
await navigator.mediaDevices
.getDisplayMedia({
 video:true
});
```

Browser handles tab selection.

---

# Stop Screen Sharing

```javascript
stream.getTracks()
.forEach(track => track.stop());
```

---

# Replace Camera With Screen

```javascript
const sender =
peer.getSenders()
.find(s =>
s.track.kind === "video");

sender.replaceTrack(
screenTrack
);
```

---

# Why replaceTrack?

Without renegotiation.

No need:

```text
Offer
Answer
ICE
```

again.

---

# Internal Flow

```text
Monitor
   |
Frames
   |
Video Track
   |
RTCPeerConnection
   |
SRTP
   |
UDP
   |
Remote User
```

---

# Common Interview Questions

### Difference between getUserMedia and getDisplayMedia?

Answer:

```text
getUserMedia
 -> Camera

getDisplayMedia
 -> Screen
```

---

### Can we switch camera to screen without reconnecting?

Answer:

Yes.

Using:

```javascript
replaceTrack()
```

---

# SECTION 16: WHY PEER TO PEER FAILS AT SCALE

## Interview Definition

Peer-to-peer works well for small calls but becomes inefficient as participant count increases because each user must send media separately to every other user.

---

# Two Users

```text
A <------> B
```

Connections:

```text
1
```

Very efficient.

---

# Three Users

```text
      A
     / \
    /   \
   B-----C
```

Connections:

```text
3
```

---

# Four Users

```text
A ------ B
|\      /|
| \    / |
|  \  /  |
|   \/   |
|   /\   |
|  /  \  |
| /    \ |
|/      \|
C ------ D
```

Connections:

```text
6
```

---

# Formula

```text
n(n-1)/2
```

---

# Example

10 users:

```text
10 * 9 / 2

45 connections
```

---

# Example

50 users:

```text
50 * 49 / 2

1225 connections
```

Impossible to maintain efficiently.

---

# Bandwidth Problem

Suppose:

```text
One Video Stream
=
2 Mbps
```

10 users:

```text
Need to send

2 Mbps × 9

18 Mbps Upload
```

per participant.

---

# CPU Problem

Browser must:

```text
Encode Stream
Again
Again
Again
Again
```

for every connection.

CPU explodes.

---

# Architecture

```text
A -> B
A -> C
A -> D
A -> E

Multiple Encoders
```

---

# Why It Fails

## Upload Bottleneck

Most users:

```text
100 Mbps Download
10 Mbps Upload
```

Upload becomes bottleneck.

---

## Battery Drain

Phone:

```text
Encode
Encrypt
Transmit
```

many times.

Battery dies quickly.

---

## Browser Limits

Hundreds of:

```text
ICE
DTLS
SRTP
```

sessions.

Not practical.

---

# Interview Question

Why doesn't Zoom use Peer-to-Peer for large meetings?

Answer:

Because bandwidth and CPU grow exponentially as users increase.

---

# SECTION 17: MESH ARCHITECTURE

## Definition

Mesh architecture means every participant connects directly to every other participant.

---

# Example

4 Users

```text
A ----- B
|\     /|
| \   / |
|  \ /  |
|  / \  |
| /   \ |
|/     \|
C ----- D
```

---

# Formula

```text
Connections

n(n-1)/2
```

---

# Five Users

```text
5 × 4 / 2

10 Connections
```

---

# Ten Users

```text
10 × 9 / 2

45 Connections
```

---

# Advantages

## Lowest Latency

```text
No Server In Between
```

---

## Cheapest

```text
No Media Server
```

---

## Simple

Good for:

```text
1:1 Calls
```

---

# Disadvantages

## Bandwidth Explosion

```text
Every User
sends to every user
```

---

## CPU Explosion

Multiple encodings.

---

## Not Scalable

Fails beyond:

```text
5-8 users
```

in most cases.

---

# Architecture Diagram

```text
         A
      / / \ \
     / /   \ \
    B-------C
     \ \   / /
      \ \ / /
         D
```

Every user connected to every user.

---

# Production Use Cases

Good:

```text
WhatsApp 1:1
Signal 1:1
Peer Calls
```

Bad:

```text
Zoom Meetings
Google Meet
Large Conferences
```

---

# Interview Question

What is the biggest drawback of mesh architecture?

Answer:

Bandwidth and CPU increase dramatically as participants increase.
# SECTION 18: SFU ARCHITECTURE

## Interview Definition

SFU (Selective Forwarding Unit) is a media server that receives media streams from participants and selectively forwards them to other participants without decoding or re-encoding the media.

Think of SFU as:

```text
Smart Traffic Controller
```

It does not modify video.

It only forwards video.

---

# Why SFU Exists

Mesh Architecture Problem:

```text
A -> B
A -> C
A -> D
A -> E
```

A uploads video multiple times.

With SFU:

```text
A
|
|
SFU
|
|----> B
|----> C
|----> D
|----> E
```

A uploads only once.

---

# Real World Examples

Used by:

* Zoom
* Google Meet
* Discord
* Slack Huddles
* Microsoft Teams

---

# Basic Architecture

```text
            +------+
            | SFU  |
            +------+
            / |  \
           /  |   \
          /   |    \
         A    B     C
```

Every user:

```text
Upload Once
Download Many
```

---

# Internal Working

Step 1

A sends stream.

```text
Camera
  |
WebRTC
  |
 SFU
```

Step 2

SFU receives packet.

```text
Packet
Packet
Packet
```

Step 3

SFU checks routing table.

```text
Room 101

A -> B
A -> C
A -> D
```

Step 4

Forward packets.

No decoding.

No encoding.

---

# Packet Flow

```text
A
 |
RTP Packet
 |
 v
SFU
 |
 +--> B
 |
 +--> C
 |
 +--> D
```

---

# Why SFU Is Fast

Because:

```text
No Decode
No Encode
```

Only:

```text
Receive
Forward
```

---

# CPU Comparison

## Mesh

```text
Encode × N
```

Client CPU heavy.

---

## SFU

```text
Encode × 1
```

Huge improvement.

---

# Bandwidth Example

Video:

```text
2 Mbps
```

Meeting:

```text
10 Users
```

Mesh:

```text
18 Mbps Upload
```

SFU:

```text
2 Mbps Upload
```

Much better.

---

# Simulcast

## Problem

Different users have different network speeds.

Example:

```text
User A -> 4K Internet
User B -> Slow Mobile
```

Need different quality.

---

# Simulcast Solution

Send:

```text
Low Quality
Medium Quality
High Quality
```

simultaneously.

```text
720p
480p
180p
```

---

# Simulcast Architecture

```text
           SFU

      720p Stream
     /
A ---
     \
      180p Stream

SFU chooses
best stream
for each user
```

---

# SVC (Scalable Video Coding)

Instead of:

```text
3 Separate Streams
```

Create:

```text
Base Layer
Enhancement Layer
Enhancement Layer
```

---

# SVC Diagram

```text
Layer 3
---------
Layer 2
---------
Layer 1
```

Poor network:

```text
Only Layer 1
```

Good network:

```text
All Layers
```

---

# Popular SFU Servers

## Mediasoup

Popular Node.js SFU.

---

## Janus

High performance SFU.

---

## Jitsi Videobridge

Used by Jitsi Meet.

---

## LiveKit

Modern cloud-native SFU.

---

# Interview Questions

### What is SFU?

A media router that forwards streams without transcoding.

---

### Why is SFU scalable?

Because clients upload only once.

---

### Does SFU decode media?

No.

Only forwards packets.

---

# Senior Interview Question

Why does Google Meet prefer SFU over MCU?

Because SFU minimizes latency and CPU usage while supporting large meetings.

---

# SECTION 19: MCU ARCHITECTURE

## Interview Definition

MCU (Multipoint Control Unit) is a media server that receives media streams, decodes them, mixes them together, re-encodes them, and sends a combined stream back to participants.

Think of MCU as:

```text
Video Editor
```

running in real-time.

---

# Architecture

```text
      A
      |
      |
      v

   +------+
   | MCU  |
   +------+

      ^
      |
      |
      B
```

---

# Internal Process

MCU:

```text
Receive
Decode
Mix
Encode
Send
```

---

# Packet Journey

```text
A Video
   |
Decode
   |
Raw Frames
   |
Mix
   |
Encode
   |
Send
```

---

# Example

Participants:

```text
A
B
C
D
```

MCU creates:

```text
+----+----+
| A  | B  |
+----+----+
| C  | D  |
+----+----+
```

single video.

---

# Why MCU Was Popular

Old devices:

```text
Low CPU
Low Memory
```

Could not decode many streams.

MCU solved this.

---

# Advantages

## Very Low Client CPU

Client receives:

```text
One Video Stream
```

---

## Simple Rendering

Only one stream.

---

## Great for Legacy Devices

Smart TVs

Set-top boxes

Embedded devices

---

# Disadvantages

## Huge Server CPU

Server must:

```text
Decode
Mix
Encode
```

every stream.

---

## High Latency

Extra processing.

---

## Expensive

Requires powerful servers.

---

# CPU Example

10 Users:

```text
10 Decoders
1 Mixer
10 Encoders
```

Heavy workload.

---

# Interview Questions

### What is MCU?

A media mixer that generates a composite video stream.

---

### Why is MCU expensive?

Because it performs transcoding.

---

### Does MCU modify video?

Yes.

It decodes and re-encodes media.

---

# SECTION 20: MCU VS SFU

## Comparison Table

| Feature       | SFU       | MCU         |
| ------------- | --------- | ----------- |
| Decode Video  | No        | Yes         |
| Encode Video  | No        | Yes         |
| Latency       | Low       | Higher      |
| CPU Usage     | Low       | High        |
| Cost          | Lower     | Expensive   |
| Scalability   | Excellent | Limited     |
| Video Quality | Original  | May degrade |
| Client CPU    | Higher    | Lower       |

---

# Architecture Comparison

## SFU

```text
A
 \
  \
   SFU
  /
 /
B
```

Forward only.

---

## MCU

```text
A
 \
  \
   MCU
  /
 /
B
```

Decode + Mix + Encode.

---

# Interview Answer

When should MCU be used?

Answer:

When client devices are extremely weak and cannot decode multiple streams.

Examples:

* Smart TVs
* Legacy hardware
* Video surveillance systems

---

# Why Modern Apps Use SFU

Zoom:

```text
SFU
```

Google Meet:

```text
SFU
```

Discord:

```text
SFU
```

Reason:

```text
Lower Latency
Lower Cost
Higher Scale
```

---

# SECTION 21: ZOOM-LIKE PRODUCTION SYSTEM DESIGN

## High-Level Architecture

```text
                    Users
                      |
                      |
                 Load Balancer
                      |
      --------------------------------
      |                              |
      |                              |
 Signaling Servers            API Servers
      |                              |
      --------------------------------
                      |
                 Redis Cluster
                      |
      --------------------------------
      |                              |
      |                              |
      SFU Cluster              TURN Cluster
      |
      |
 Media Processing
      |
      |
 Recording Service
      |
      |
 Object Storage
      |
      |
 CDN
```

---

# Components

## Frontend

Usually:

```text
React
Next.js
```

Responsibilities:

```text
Camera
Microphone
Screen Sharing
Chat
```

---

## Signaling Server

Uses:

```text
WebSocket
Socket.IO
```

Responsibilities:

```text
Offer
Answer
ICE Exchange
```

---

## Redis

Stores:

```text
Room State
Presence
Session Data
```

---

## TURN Cluster

Handles:

```text
NAT Traversal
Firewall Traversal
```

---

## SFU Cluster

Handles:

```text
Media Routing
Simulcast
Bandwidth Adaptation
```

---

# Media Flow

```text
User A
   |
WebRTC
   |
 SFU
   |
User B
```

---

# Signaling Flow

```text
User A
   |
WebSocket
   |
Signaling Server
   |
User B
```

---

# Recording Architecture

```text
SFU
 |
Recording Worker
 |
MP4 File
 |
S3 Storage
```

---

# Storage Layer

Examples:

```text
Amazon S3
Google Cloud Storage
Azure Blob Storage
```

---

# CDN Layer

Examples:

```text
CloudFront
Cloudflare
Fastly
```

Used for:

```text
Recording Playback
```

---

# Authentication

Methods:

```text
JWT
OAuth
SSO
```

---

# Monitoring

Tools:

```text
Prometheus
Grafana
ELK
Datadog
```

Metrics:

```text
Packet Loss
Bitrate
Latency
Jitter
CPU
Memory
```

---

# Interview Question

Design Zoom for 1 Million Concurrent Users.

Answer:

Use:

```text
Global Load Balancer
Multiple Regions
SFU Clusters
TURN Clusters
Redis
CDN
Object Storage
```

and keep media servers geographically close to users.

---

# Senior Staff Engineer Question

How would you reduce bandwidth costs?

Answer:

Use:

```text
Simulcast
SVC
Adaptive Bitrate
Regional SFUs
TURN Minimization
```

to reduce unnecessary media transfer.


# SECTION 22: COMPLETE WORKING WEBRTC PROJECT

## Project Overview

Build a simple video calling application with:

* Video Calling
* Audio Calling
* Screen Sharing
* Chat Messaging
* Data Channels
* Room Support

Tech Stack:

```text
Frontend:
HTML
CSS
JavaScript

Backend:
Node.js
Express
Socket.IO
```

---

# Folder Structure

```text
webrtc-app/
│
├── server.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── package.json
│
└── README.md
```

---

# package.json

```json
{
  "name": "webrtc-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.8.0"
  }
}
```

---

# Backend: server.js

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

io.on("connection", socket => {

    socket.on("join-room", roomId => {

        socket.join(roomId);

        socket.to(roomId)
              .emit("user-joined");

        socket.on("offer", data => {
            socket.to(roomId)
                  .emit("offer", data);
        });

        socket.on("answer", data => {
            socket.to(roomId)
                  .emit("answer", data);
        });

        socket.on("candidate", data => {
            socket.to(roomId)
                  .emit("candidate", data);
        });

    });

});

server.listen(3000);
```

---

# Frontend HTML

```html
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="style.css">
</head>

<body>

<video id="localVideo" autoplay muted></video>

<video id="remoteVideo" autoplay></video>

<button id="shareScreen">
Share Screen
</button>

<script src="/socket.io/socket.io.js"></script>
<script src="app.js"></script>

</body>
</html>
```

---

# CSS

```css
video {
    width: 400px;
    margin: 10px;
}
```

---

# Frontend WebRTC Logic

```javascript
const socket = io();

const peer =
new RTCPeerConnection({
 iceServers:[
 {
  urls:
  "stun:stun.l.google.com:19302"
 }
 ]
});

const localVideo =
document.getElementById("localVideo");

const remoteVideo =
document.getElementById("remoteVideo");

async function init(){

 const stream =
 await navigator.mediaDevices
 .getUserMedia({
   video:true,
   audio:true
 });

 localVideo.srcObject = stream;

 stream.getTracks()
 .forEach(track => {
   peer.addTrack(track,stream);
 });

}

peer.ontrack = event => {
 remoteVideo.srcObject =
 event.streams[0];
};

peer.onicecandidate = event => {
 if(event.candidate){
   socket.emit(
    "candidate",
    event.candidate
   );
 }
};

init();
```

---

# Screen Sharing

```javascript
const displayStream =
await navigator.mediaDevices
.getDisplayMedia({
 video:true
});

const screenTrack =
displayStream.getVideoTracks()[0];

const sender =
peer.getSenders()
.find(s =>
 s.track.kind === "video");

sender.replaceTrack(screenTrack);
```

---

# Data Channel Chat

```javascript
const channel =
peer.createDataChannel("chat");

channel.onopen = () => {
 channel.send("Hello");
};

channel.onmessage = e => {
 console.log(e.data);
};
```

---

# How to Run

Install:

```bash
npm install
```

Run:

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

Open second browser tab.

Test call.

---

# Production Improvements

Add:

* TURN Server
* Authentication
* Database
* Redis
* SFU
* Monitoring

before deploying.

---

# SECTION 23: WEBRTC INTERVIEW QUESTIONS

## Beginner Level

### 1. What is WebRTC?

Answer:

Browser technology for real-time audio, video and data communication.

---

### 2. What does WebRTC stand for?

Answer:

Web Real-Time Communication.

---

### 3. What is RTCPeerConnection?

Answer:

API that manages peer-to-peer communication.

---

### 4. What is SDP?

Answer:

Session Description Protocol.

Describes media capabilities.

---

### 5. What is ICE?

Answer:

Interactive Connectivity Establishment.

Used to find the best network path.

---

### 6. What is STUN?

Answer:

Discovers public IP address.

---

### 7. What is TURN?

Answer:

Relays traffic when direct connection fails.

---

### 8. Why is WebRTC secure?

Answer:

Uses DTLS and SRTP encryption.

---

### 9. What is getUserMedia?

Answer:

Captures microphone and camera.

---

### 10. What is getDisplayMedia?

Answer:

Captures screen sharing stream.

---

# Intermediate Level

### 11. Explain Offer and Answer.

Offer:

Capabilities from caller.

Answer:

Selected capabilities from receiver.

---

### 12. What are ICE Candidates?

Possible routes between peers.

---

### 13. Difference between STUN and TURN?

STUN:

Discover route.

TURN:

Relay route.

---

### 14. What protocol carries media?

RTP over UDP.

---

### 15. Why UDP over TCP?

Lower latency.

No retransmission delays.

---

### 16. What is SRTP?

Secure RTP.

Encrypts media.

---

### 17. What is DTLS?

Encryption key exchange protocol.

---

### 18. What is RTP?

Real-time Transport Protocol.

Used for media packets.

---

### 19. What is Jitter?

Variation in packet arrival time.

---

### 20. What is Packet Loss?

Missing packets during transmission.

---

# Advanced Level

### 21. Explain NAT Traversal.

Private devices cannot directly communicate.

ICE + STUN + TURN solve this.

---

### 22. What is Symmetric NAT?

Creates different mappings per destination.

Hardest NAT to traverse.

---

### 23. What is Simulcast?

Multiple video qualities sent simultaneously.

---

### 24. What is SVC?

Scalable Video Coding.

Layered video transmission.

---

### 25. What is Congestion Control?

Adjusting bitrate according to network conditions.

---

### 26. Explain Bandwidth Estimation.

Estimate available network capacity.

---

### 27. What is Head-of-Line Blocking?

One packet delays following packets.

---

### 28. Why does SCTP help Data Channels?

Supports multiple streams.

---

### 29. Explain RTP Header.

Contains:

```text
Sequence Number
Timestamp
Payload Type
```

---

### 30. Difference between RTP and RTCP?

RTP:

Media transport.

RTCP:

Media statistics.

---

# Senior/System Design Level

### 31. Why does Mesh fail?

Bandwidth explosion.

---

### 32. Why SFU over MCU?

Lower latency.

Better scalability.

---

### 33. Why Zoom uses SFU?

Upload once.

Download many.

---

### 34. How would you support 100k meetings?

Regional SFU clusters.

---

### 35. How would you reduce TURN costs?

Prefer STUN.

Use regional TURN servers.

---

### 36. How would you record meetings?

Recording worker connected to SFU.

---

### 37. How would you build breakout rooms?

Separate SFU routing groups.

---

### 38. How would you support screen sharing?

Replace video track.

---

### 39. How would you detect network degradation?

Monitor:

* RTT
* Jitter
* Packet Loss

---

### 40. How would you support live streaming?

SFU → Transcoder → CDN.

---

### 41. Explain Adaptive Bitrate.

Adjust quality dynamically.

---

### 42. Explain Multi-region Deployment.

Deploy SFUs near users.

---

### 43. How would you scale signaling?

WebSocket cluster + Redis.

---

### 44. How would you handle failover?

Hot standby SFUs.

---

### 45. How would you monitor WebRTC?

RTCP statistics.

---

### 46. What metrics matter most?

* Latency
* Packet Loss
* Jitter
* Bitrate

---

### 47. Explain ICE Restart.

Rebuild connection after network changes.

---

### 48. Explain TURN Overload.

TURN bandwidth becomes bottleneck.

---

### 49. Explain Media Server Cascading.

SFUs forward streams across regions.

---

### 50. Design Zoom.

Expected Answer:

```text
Frontend
WebSocket Signaling
Redis
TURN
SFU Cluster
Recording Service
Storage
CDN
Monitoring
```

---

# SECTION 24: WEBRTC CHEAT SHEET

## HTTP vs WebRTC

| HTTP             | WebRTC      |
| ---------------- | ----------- |
| Request Response | Real-Time   |
| High Latency     | Low Latency |
| No Audio         | Audio       |
| No Video         | Video       |

---

## TCP vs UDP

| TCP            | UDP           |
| -------------- | ------------- |
| Reliable       | Fast          |
| Ordered        | Unordered     |
| Retransmits    | No Retransmit |
| Higher Latency | Lower Latency |

---

## STUN

Purpose:

```text
Find Public IP
```

---

## TURN

Purpose:

```text
Relay Traffic
```

---

## ICE

Purpose:

```text
Find Best Path
```

Order:

```text
Host
↓
STUN
↓
TURN
```

---

## SDP

Purpose:

```text
Media Negotiation
```

Contains:

```text
Codecs
Ports
Encryption
Media Types
```

---

## Offer

```text
Capabilities
```

---

## Answer

```text
Accepted Capabilities
```

---

## Data Channel

Protocol:

```text
SCTP
```

Uses:

```text
Chat
Gaming
File Transfer
```

---

## Screen Sharing

API:

```javascript
getDisplayMedia()
```

---

## Mesh

```text
Every User
Connects
To Every User
```

Formula:

```text
n(n-1)/2
```

---

## SFU

```text
Forward Streams
```

Used by:

* Zoom
* Meet
* Discord

---

## MCU

```text
Mix Streams
```

Higher CPU.

---

## NAT Traversal

Solved by:

```text
ICE
STUN
TURN
```

---

# FINAL INTERVIEW SUMMARY

If interviewer asks:

"Explain WebRTC end-to-end"

Answer:

```text
1. Capture media using getUserMedia
2. Create RTCPeerConnection
3. Exchange SDP Offer/Answer
4. Exchange ICE Candidates
5. Discover route using STUN/TURN
6. Establish DTLS connection
7. Encrypt media with SRTP
8. Send audio/video over UDP
9. Use SFU for scaling
10. Monitor using RTCP statistics
```

This 10-step answer alone can clear most WebRTC interview rounds.
