import { useSocket } from "../../Context/SocketContext";
import { useState, useEffect } from "react";

const SocketStatus = () => {
  const { socket, onlineUsers } = useSocket();
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setConnectionStatus("connected");
    const handleDisconnect = () => setConnectionStatus("disconnected");
    const handleConnecting = () => setConnectionStatus("connecting");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connecting", handleConnecting);

    // Set initial status
    if (socket.connected) {
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("connecting");
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connecting", handleConnecting);
    };
  }, [socket]);

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-500"
              : connectionStatus === "connecting"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
        <span className="text-sm">
          Socket: {connectionStatus} | Online: {onlineUsers?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default SocketStatus;
