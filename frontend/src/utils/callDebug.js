// Debug utility for video calling
export const debugCall = {
  logSocketConnection: (socket) => {
    console.log('🔌 Socket Connection Debug:');
    console.log('- Connected:', socket.connected);
    console.log('- ID:', socket.id);
    console.log('- URL:', socket.io.uri);
  },

  logCallData: (callData) => {
    console.log('📞 Call Data Debug:');
    console.log('- Receiver ID:', callData.receiverId);
    console.log('- Call Type:', callData.callType);
    console.log('- Caller Info:', callData.callerInfo);
    console.log('- Has Offer:', !!callData.offer);
  },

  logIncomingCall: (data) => {
    console.log('📞 Incoming Call Debug:');
    console.log('- Caller:', data.caller);
    console.log('- Call Type:', data.callType);
    console.log('- Has Offer:', !!data.offer);
  },

  logWebRTCState: (context) => {
    console.log('🎥 WebRTC State Debug:');
    console.log('- Call Status:', context.callStatus);
    console.log('- Caller:', context.caller);
    console.log('- Receiver:', context.receiver);
    console.log('- Call Type:', context.callType);
    console.log('- Socket Available:', !!context.socket);
  }
};

// Add to window for easy debugging
if (typeof window !== 'undefined') {
  window.debugCall = debugCall;
}
