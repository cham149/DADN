import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import { initSocket } from "./socket.js";
import configureRoutes from "./routers/index.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDB
mongoose.connect("mongodb://localhost:27017/DADN")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi MongoDB:", err));

// Routes
configureRoutes(app);

// Socket
initSocket(server);

// Start server
server.listen(5000, () => {
  console.log("🚀 Server + Socket chạy tại http://localhost:5000");
});
