import express from 'express';
import mongoose from 'mongoose';
import http from 'http';

import { Admin, User, Post, Report, Conversation, Message } from './database/database.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/DADN", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", () => {
  console.log("Kết nối MongoDB thành công");
});
mongoose.connection.on("error", (err) => {
  console.error("Lỗi MongoDB:", err);
});

// Route test
app.get('/', (req, res) => {
  res.send('🎉 Server chạy qua http.createServer!');
});

// Tạo server HTTP từ Express app
const server = http.createServer(app);

// Khởi động server
server.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});
