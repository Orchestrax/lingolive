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
    origin: "http://localhost:5173",
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

  // Call signaling events
  socket.on("call-user", (data) => {
    console.log("📞 Call request:", data);
    const { receiverId, offer, callType, callerInfo } = data;
    
    // Get caller info from socket query or session
    const callerId = socket.handshake.query.userId;
    
    socket.to(receiverId).emit("incoming-call", {
      caller: callerInfo || { _id: callerId, username: 'Unknown User' },
      offer: offer,
      callType: callType
    });
  });

  socket.on("call-answer", (data) => {
    console.log("📞 Call answered:", data);
    const { callerId, answer } = data;
    socket.to(callerId).emit("call-answered", { answer });
  });

  socket.on("call-reject", (data) => {
    console.log("📞 Call rejected:", data);
    const { callerId } = data;
    socket.to(callerId).emit("call-rejected");
  });

  socket.on("call-end", (data) => {
    console.log("📞 Call ended:", data);
    const { receiverId } = data;
    socket.to(receiverId).emit("call-ended");
  });

  socket.on("ice-candidate", (data) => {
    console.log("🧊 ICE candidate:", data);
    const { receiverId, candidate } = data;
    socket.to(receiverId).emit("ice-candidate", { candidate });
  });

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
