import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./database/index.db.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Create server and Socket.io instance first
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
        ? ["https://lingolive.onrender.com"] 
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

export let onlineUsers = new Map();

// Handle user connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online Users:", onlineUsers);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

<<<<<<< HEAD
  // Call signaling events
  socket.on("call-user", (data) => {
    console.log("📞 Call request received:", data);
    const { receiverId, offer, callType, callerInfo } = data;
    
    // Get caller info from socket query or session
    const callerId = socket.handshake.query.userId;
    
    console.log("📞 Sending to receiver:", receiverId);
    console.log("📞 Caller info:", callerInfo);
    
    // Find the receiver's socket ID from onlineUsers
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        caller: callerInfo || { _id: callerId, username: 'Unknown User' },
        offer: offer,
        callType: callType
      });
      console.log("📞 Incoming call event sent to:", receiverSocketId);
    } else {
      console.log("📞 Receiver not found in online users:", receiverId);
    }
  });

  socket.on("call-answer", (data) => {
    console.log("📞 Call answered:", data);
    const { callerId, answer } = data;
    
    // Find the caller's socket ID from onlineUsers
    const callerSocketId = onlineUsers.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-answered", { answer });
    } else {
      console.log("📞 Caller not found in online users:", callerId);
    }
  });

  socket.on("call-reject", (data) => {
    console.log("📞 Call rejected:", data);
    const { callerId } = data;
    
    // Find the caller's socket ID from onlineUsers
    const callerSocketId = onlineUsers.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-rejected");
    } else {
      console.log("📞 Caller not found in online users:", callerId);
    }
  });

  socket.on("call-end", (data) => {
    console.log("📞 Call ended:", data);
    const { receiverId } = data;
    
    // Find the receiver's socket ID from onlineUsers
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended");
    } else {
      console.log("📞 Receiver not found in online users:", receiverId);
    }
  });

  socket.on("ice-candidate", (data) => {
    console.log("🧊 ICE candidate:", data);
    const { receiverId, candidate } = data;
    
    // Find the receiver's socket ID from onlineUsers
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", { candidate });
    } else {
      console.log("🧊 Receiver not found in online users:", receiverId);
    }
  });

  // Handle post-related events
  socket.on("newPost", (postData) => {
    console.log("📝 New post created:", postData);
    socket.broadcast.emit("newPost", postData);
  });

  socket.on("updatePost", (postData) => {
    console.log("📝 Post updated:", postData);
    socket.broadcast.emit("updatePost", postData);
  });

  socket.on("deletePost", ({ postId }) => {
    console.log("📝 Post deleted:", postId);
    socket.broadcast.emit("deletePost", { postId });
  });

  // Handle friend request events
  socket.on("friendRequest", ({ newRequest }) => {
    console.log("👥 Friend request sent:", newRequest);
    socket.broadcast.emit("friendRequest", { newRequest });
  });

  // Handle notification events
  socket.on("newNotification", (notification) => {
    console.log("🔔 New notification:", notification);
    socket.broadcast.emit("newNotification", notification);
  });

=======
>>>>>>> 6405882 (last phase)
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});


// Connect DB and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to DB", err);
  });