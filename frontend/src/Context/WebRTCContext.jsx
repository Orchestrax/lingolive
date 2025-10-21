import { createContext, useContext, useRef, useState } from "react";
import { useSocket } from "./SocketContext";
import AppContext from "./UseContext";

const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useContext(AppContext);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState(null); // 'video' or 'audio'
  const [caller, setCaller] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'ringing', 'connected', 'ended'

  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Initialize peer connection
  const initializePeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(rtcConfig);

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      console.log('Remote stream received');
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          receiverId: receiver?._id
        });
      }
    };

    // Handle connection state changes
    peerConnection.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.current.connectionState);
      if (peerConnection.current.connectionState === 'connected') {
        setCallStatus('connected');
        setIsCallActive(true);
      } else if (peerConnection.current.connectionState === 'disconnected' || 
                 peerConnection.current.connectionState === 'failed') {
        endCall();
      }
    };
  };

  // Get user media (camera and microphone)
  const getUserMedia = async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 640, height: 480 } : false,
        audio: audio
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Add tracks to peer connection
      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  // Start a call
  const startCall = async (receiverUser, type = 'video') => {
    try {
      setCallType(type);
      setReceiver(receiverUser);
      setCallStatus('calling');
      
      // Initialize peer connection
      initializePeerConnection();
      
      // Get user media
      await getUserMedia(type === 'video', true);
      
      // Create offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      // Send call request with caller info
      socket.emit('call-user', {
        receiverId: receiverUser._id,
        offer: offer,
        callType: type,
        callerInfo: {
          _id: user._id,
          username: user.username,
          profilePic: user.profilePic
        }
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('idle');
    }
  };

  // Answer a call
  const answerCall = async () => {
    try {
      setCallStatus('connected');
      
      // Initialize peer connection
      initializePeerConnection();
      
      // Get user media
      await getUserMedia(callType === 'video', true);
      
      // Set remote description from the stored offer
      if (window.pendingOffer) {
        await peerConnection.current.setRemoteDescription(window.pendingOffer);
        window.pendingOffer = null; // Clear the stored offer
      }
      
      // Create answer
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      
      // Send answer
      socket.emit('call-answer', {
        callerId: caller._id,
        answer: answer
      });
      
    } catch (error) {
      console.error('Error answering call:', error);
      setCallStatus('idle');
    }
  };

  // Reject a call
  const rejectCall = () => {
    socket.emit('call-reject', { callerId: caller._id });
    setCallStatus('idle');
    setCaller(null);
  };

  // End call
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    
    // Save call to history
    if (callStatus === 'connected') {
      const callData = {
        contactName: caller?.username || receiver?.username || 'Unknown',
        type: callType,
        status: 'completed',
        duration: 'Unknown' // You can implement duration tracking
      };
      
      // Save to localStorage
      const existingHistory = JSON.parse(localStorage.getItem('callHistory') || '[]');
      const newCall = {
        id: Date.now(),
        ...callData,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newCall, ...existingHistory].slice(0, 50);
      localStorage.setItem('callHistory', JSON.stringify(updatedHistory));
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setCallStatus('idle');
    setCaller(null);
    setReceiver(null);
    setCallType(null);
    
    socket.emit('call-end', { 
      receiverId: receiver?._id || caller?._id 
    });
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Socket event listeners
  const setupSocketListeners = () => {
    if (!socket) return;

    // Incoming call
    socket.on('incoming-call', async (data) => {
      console.log('Incoming call:', data);
      setCaller(data.caller);
      setCallType(data.callType);
      setCallStatus('ringing');
      
      // Store the offer for when user answers
      if (data.offer) {
        // Store offer in a ref or state for later use
        window.pendingOffer = data.offer;
      }
    });

    // Call answered
    socket.on('call-answered', async (data) => {
      console.log('Call answered:', data);
      setCallStatus('connected');
      setIsCallActive(true);
      
      // Set remote description from answer
      if (data.answer && peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(data.answer);
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      }
    });

    // Call rejected
    socket.on('call-rejected', () => {
      console.log('Call rejected');
      setCallStatus('idle');
      setCaller(null);
      alert('Call was rejected');
    });

    // Call ended
    socket.on('call-ended', () => {
      console.log('Call ended');
      endCall();
    });

    // ICE candidate received
    socket.on('ice-candidate', async (data) => {
      console.log('ICE candidate received:', data);
      if (peerConnection.current && data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(data.candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });
  };

  // Cleanup
  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  return (
    <WebRTCContext.Provider
      value={{
        // State
        localStream,
        remoteStream,
        isVideoEnabled,
        isAudioEnabled,
        isCallActive,
        callType,
        caller,
        receiver,
        callStatus,
        
        // Refs
        localVideoRef,
        remoteVideoRef,
        
        // Functions
        startCall,
        answerCall,
        rejectCall,
        endCall,
        toggleVideo,
        toggleAudio,
        setupSocketListeners,
        cleanup,
        
        // Setters
        setCaller,
        setReceiver,
        setCallStatus,
        setCallType
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => useContext(WebRTCContext);
