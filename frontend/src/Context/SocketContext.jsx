// src/Context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AppContext from "./UseContext"; // import your main context

// Utility function to get Socket URL
const getSocketUrl = () => {
  return import.meta.env.VITE_SOCKET_URL || 
    (process.env.NODE_ENV === 'development' 
      ? "http://localhost:5000" 
      : "https://lingolive.onrender.com");
};

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, posts, setPosts, requests, setRequests } =
    useContext(AppContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    // Use local backend for development, production for deployment
    const socketUrl = getSocketUrl();
    
    console.log("🔌 Connecting to socket:", socketUrl);
    
    const newSocket = io(socketUrl, {
      query: { userId: user._id },
      withCredentials: true,
      transports: ["websocket", "polling"], // Add polling as fallback
      timeout: 10000,
      forceNew: true,
    });

    setSocket(newSocket);

    // Add connection debugging
    newSocket.on("connect", () => {
      console.log("🔌 Socket connected:", newSocket.id);
      // Re-emit user data after connection
      newSocket.emit("addUser", user._id);
      newSocket.emit("joinRoom", user._id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      if (reason === 'io server disconnect') {
        // Server disconnected the client, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("🔌 Socket reconnected after", attemptNumber, "attempts");
      newSocket.emit("addUser", user._id);
      newSocket.emit("joinRoom", user._id);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("🔌 Socket reconnection error:", error);
    });

    // Post events
    newSocket.on("newPost", (newPost) => {
      console.log("🆕 New post received via socket:", newPost);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    newSocket.on("updatePost", (updatedPost) => {
      console.log("📝 Post updated via socket:", updatedPost);
      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    });

    newSocket.on("deletePost", ({ postId }) => {
      console.log("🗑️ Post deleted via socket:", postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    });

    // Friend request events
    newSocket.on("friendRequest", ({ newRequest }) => {
      console.log("🆕 New friend request received via socket:", newRequest);
      setRequests((prevRequests) => [newRequest, ...prevRequests]);
    });

    // Notification events
    newSocket.on("newNotification", (notification) => {
      console.log("🔔 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    // Online users events
    newSocket.on("onlineUsers", (onlineUsersList) => {
      console.log("👥 Online Users List Updated:", onlineUsersList);
      setOnlineUsers(onlineUsersList);
    });

    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, [user?._id]); // Only depend on user._id to prevent unnecessary reconnections

  // For real time messages
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("deleteMessage", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        posts,
        requests,
        setNotifications,
        messages,
        onlineUsers,
        setMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
