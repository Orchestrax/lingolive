import { useEffect } from "react";
import { useWebRTC } from "../../Context/WebRTCContext";
import { Phone, PhoneOff, Video, Mic } from "lucide-react";

const IncomingCallNotification = () => {
  const {
    caller,
    callType,
    callStatus,
    answerCall,
    rejectCall
  } = useWebRTC();

  // Auto-hide notification after 30 seconds
  useEffect(() => {
    if (callStatus === 'ringing') {
      const timer = setTimeout(() => {
        rejectCall();
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [callStatus, rejectCall]);

  if (callStatus !== 'ringing') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Caller Info */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {caller?.profilePic ? (
              <img
                src={caller.profilePic}
                alt={caller.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {caller?.username?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            {caller?.username || 'Unknown User'}
          </h2>
          <p className="text-gray-400">
            {callType === 'video' ? 'Video Call' : 'Voice Call'}
          </p>
        </div>

        {/* Call Type Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
            {callType === 'video' ? (
              <Video size={20} className="text-blue-400" />
            ) : (
              <Mic size={20} className="text-green-400" />
            )}
            <span className="text-white text-sm">
              {callType === 'video' ? 'Video Call' : 'Voice Call'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {/* Reject Button */}
          <button
            onClick={rejectCall}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="Reject call"
          >
            <PhoneOff size={24} />
          </button>

          {/* Answer Button */}
          <button
            onClick={answerCall}
            className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
            title="Answer call"
          >
            <Phone size={24} />
          </button>
        </div>

        {/* Call Status */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">Incoming call...</p>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
