// Simple test script to verify socket server is working
import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Test socket connected:", socket.id);
  
  socket.on("test", (data) => {
    console.log("✅ Test event received:", data);
    socket.emit("test-response", { message: "Socket is working!", timestamp: new Date() });
  });
  
  socket.on("disconnect", () => {
    console.log("❌ Test socket disconnected:", socket.id);
  });
});

server.listen(5001, () => {
  console.log("🧪 Test socket server running on port 5001");
  console.log("You can test with: node test-socket.js");
});
