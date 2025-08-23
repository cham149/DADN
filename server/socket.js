import { Server } from "socket.io";

let onlineUsers = {};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",  // cho phép React client
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("addUser", (userId) => {
      onlineUsers[userId] = socket.id;
      // console.log("✅ Online users:", onlineUsers);
    });

    socket.on("markAsRead", ({ conversationId, userId, partnerId }) => {
      // console.log(`📩 User ${userId} đã đọc trong ${conversationId}`);
      if (onlineUsers[partnerId]) {
        io.to(onlineUsers[partnerId]).emit("updateUnread", {
          conversationId,
          userId
        });
      }
    });

    socket.on("disconnect", () => {
      for (const uid in onlineUsers) {
        if (onlineUsers[uid] === socket.id) delete onlineUsers[uid];
      }
      console.log("❌ User disconnected", socket.id);
    });
  });
};
