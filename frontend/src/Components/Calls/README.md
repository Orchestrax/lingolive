# Video & Voice Calling Features

This directory contains all the components and context for implementing real-time video and voice calling using WebRTC.

## Features Implemented

### 🎥 Video Calls
- Real-time video calling with WebRTC
- Camera on/off toggle
- Picture-in-picture local video
- Full-screen remote video

### 🎤 Voice Calls
- Audio-only calling option
- Microphone mute/unmute
- High-quality audio transmission

### 📞 Call Management
- Incoming call notifications
- Call accept/reject functionality
- Call history tracking
- Real-time call status updates

### 🎛️ Controls
- **Audio Mute/Unmute**: Toggle microphone on/off
- **Camera On/Off**: Toggle video stream (video calls only)
- **End Call**: Terminate active calls
- **Minimize**: Minimize call interface

## Components

### WebRTCContext.jsx
Main context provider that manages:
- WebRTC peer connections
- Media stream handling
- Socket.IO signaling
- Call state management
- Audio/video controls

### VideoCall.jsx
Main call interface component that renders:
- Full-screen call UI
- Local and remote video streams
- Call controls (mute, camera, end call)
- Call status indicators

### IncomingCallNotification.jsx
Modal component for incoming calls with:
- Caller information display
- Accept/reject buttons
- Auto-timeout after 30 seconds

### CallButton.jsx
Chat interface button for initiating calls:
- Video call option
- Voice call option
- Online status checking

### CallHistory.jsx
Call history management:
- Recent calls display
- Call type indicators (video/voice)
- Call status (completed/missed/rejected)
- Local storage persistence

## Usage

### Starting a Call
```jsx
import { useWebRTC } from '../Context/WebRTCContext';

const { startCall } = useWebRTC();

// Start video call
startCall(selectedUser, 'video');

// Start voice call
startCall(selectedUser, 'audio');
```

### Call Controls
```jsx
const { toggleVideo, toggleAudio, endCall } = useWebRTC();

// Toggle video (video calls only)
toggleVideo();

// Toggle audio
toggleAudio();

// End call
endCall();
```

## Technical Details

### WebRTC Configuration
- STUN servers for NAT traversal
- ICE candidate exchange via Socket.IO
- Peer-to-peer connection establishment
- Media stream handling

### Socket.IO Events
- `call-user`: Initiate call
- `incoming-call`: Receive call request
- `call-answer`: Answer call
- `call-reject`: Reject call
- `call-end`: End call
- `ice-candidate`: Exchange ICE candidates

### Browser Requirements
- Modern browser with WebRTC support
- HTTPS required for media access
- Camera and microphone permissions

## Security Considerations

- All media streams are peer-to-peer
- No server-side recording or storage
- User consent required for media access
- Secure WebRTC connections

## Future Enhancements

- Group video calls
- Screen sharing
- Call recording
- Advanced audio controls
- Call quality indicators
- Push notifications for missed calls
