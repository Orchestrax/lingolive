import { useState } from "react";
import { useWebRTC } from "../../Context/WebRTCContext";
import { Phone, Video, PhoneCall } from "lucide-react";

const CallButton = ({ selectedUser, isOnline }) => {
  const { startCall } = useWebRTC();
  const [showCallOptions, setShowCallOptions] = useState(false);

  const handleVideoCall = () => {
    startCall(selectedUser, 'video');
    setShowCallOptions(false);
  };

  const handleVoiceCall = () => {
    startCall(selectedUser, 'audio');
    setShowCallOptions(false);
  };

  if (!selectedUser || !isOnline) return null;

  return (
    <div className="relative">
      {/* Call Button */}
      <button
        onClick={() => setShowCallOptions(!showCallOptions)}
        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
        title="Start a call"
      >
        <PhoneCall size={20} />
      </button>

      {/* Call Options Dropdown */}
      {showCallOptions && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <button
            onClick={handleVideoCall}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-t-lg transition-colors"
          >
            <Video size={18} />
            <span>Video Call</span>
          </button>
          <button
            onClick={handleVoiceCall}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-b-lg transition-colors"
          >
            <Phone size={18} />
            <span>Voice Call</span>
          </button>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showCallOptions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCallOptions(false)}
        />
      )}
    </div>
  );
};

export default CallButton;
