// src/Context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AppContext from "./UseContext"; // import your main context

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, posts, setPosts, requests, setRequests } =
    useContext(AppContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io("http://localhost:5000", {
        query: { userId: user._id },
        withCredentials: true,
      });

      setSocket(newSocket);

      // Join user room
      newSocket.emit("joinRoom", user._id);

      if (user._id) {
        newSocket.emit("addUser", user._id);
      }

      newSocket.on("newPost", (newPost) => {
        console.log("🆕 New post received via socket:", newPost);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      });

      newSocket.on("friendRequest", ({ newRequest }) => {
        console.log("🆕 New friend request received via socket:", newRequest);
        setRequests((prevRequests) => [newRequest, ...prevRequests]);
      });

      // Listen for new notifications
      newSocket.on("newNotification", (notification) => {
        console.log("🔔 New notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      newSocket.on("onlineUsers", (onlineUsers) => {
        console.log("Online Users List Updated:", onlineUsers);
        setOnlineUsers(onlineUsers);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);


  // For real time messages
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("newMessage");
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


