import { useState, useEffect } from "react";
import { Phone, Video, PhoneOff, Clock } from "lucide-react";

const CallHistory = () => {
  const [callHistory, setCallHistory] = useState([]);

  // Load call history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('callHistory');
    if (savedHistory) {
      setCallHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save call to history
  const saveCallToHistory = (callData) => {
    const newCall = {
      id: Date.now(),
      ...callData,
      timestamp: new Date().toISOString()
    };
    
    setCallHistory(prev => {
      const updated = [newCall, ...prev].slice(0, 50); // Keep only last 50 calls
      localStorage.setItem('callHistory', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear call history
  const clearHistory = () => {
    setCallHistory([]);
    localStorage.removeItem('callHistory');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCallIcon = (type, status) => {
    if (status === 'missed') {
      return <PhoneOff size={16} className="text-red-400" />;
    }
    return type === 'video' ? 
      <Video size={16} className="text-blue-400" /> : 
      <Phone size={16} className="text-green-400" />;
  };

  const getCallStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'missed':
        return 'text-red-400';
      case 'rejected':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Clock size={20} />
          Call History
        </h3>
        {callHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {callHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Phone size={32} className="mx-auto mb-2 opacity-50" />
          <p>No call history yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {callHistory.map((call) => (
            <div
              key={call.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {getCallIcon(call.type, call.status)}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {call.contactName || 'Unknown User'}
                </p>
                <p className="text-gray-400 text-xs">
                  {call.type === 'video' ? 'Video Call' : 'Voice Call'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${getCallStatus(call.status)}`}>
                  {call.status === 'completed' ? 'Completed' : 
                   call.status === 'missed' ? 'Missed' : 
                   call.status === 'rejected' ? 'Rejected' : call.status}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatTime(call.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallHistory;
