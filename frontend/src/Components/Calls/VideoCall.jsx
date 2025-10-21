import { useEffect, useState } from "react";
import { useWebRTC } from "../../Context/WebRTCContext";
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  X 
} from "lucide-react";
import IncomingCallNotification from "./IncomingCallNotification";

const VideoCall = () => {
  const {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    isCallActive,
    callType,
    caller,
    receiver,
    callStatus,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleVideo,
    toggleAudio,
    setupSocketListeners
  } = useWebRTC();

  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setupSocketListeners();
  }, []);

  // Show incoming call notification
  if (callStatus === 'ringing') {
    return <IncomingCallNotification />;
  }

  // Don't render if no call is active
  if (callStatus === 'idle') return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black ${isMinimized ? 'pointer-events-none' : ''}`}>
      {/* Call Interface */}
      <div className={`relative w-full h-full ${isMinimized ? 'transform scale-50 origin-top-right' : ''}`}>
        
        {/* Remote Video (Main View) */}
        <div className="absolute inset-0 bg-gray-900">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
                  {caller?.profilePic ? (
                    <img
                      src={caller.profilePic}
                      alt={caller.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">
                      {caller?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  {caller?.username || 'Unknown User'}
                </h2>
                <p className="text-gray-400">
                  {callStatus === 'ringing' ? 'Incoming call...' : 'Connecting...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        {localStream && callType === 'video' && (
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Call Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-4">
            
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-colors ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Video Toggle (only for video calls) */}
            {callType === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            )}

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>

        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-4 left-4 p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Call Status */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {callStatus === 'calling' && 'Calling...'}
            {callStatus === 'ringing' && 'Incoming call'}
            {callStatus === 'connected' && 'Connected'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
