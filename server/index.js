import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Thêm cors
import { User } from "./database/database.js";

const app = express();
app.use(express.json());
app.use(cors()); 
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://localhost:27017/DADN");

// Đăng ký
app.post("/api/signup", async (req, res) => {
  try {
    const { ten, email, matkhau, soDienThoai, diaChi, vaiTro } = req.body;

    if (!ten || !email || !matkhau || !vaiTro) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const newUser = new User({
      ten,
      email,
      matkhau,
      avatar: "http://localhost:5000/uploads/avata-default.jpg",
      soDienThoai: soDienThoai || null, // Đặt null nếu không có giá trị
      diaChi: diaChi || null,           // Đặt null nếu không có giá trị
      vaiTro,
    });
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: { ten, email } });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Đăng nhập
app.post("/api/login", async (req, res) => {  
  try {
    const { ten, matkhau } = req.body;

    if (!ten || !matkhau) {
      return res.status(400).json({ message: "Vui lòng điền tên và mật khẩu" });
    }

    const user = await User.findOne({ ten });
    if (!user) {
      return res.status(400).json({ message: "Tên đăng nhập không tồn tại" });
    }

    if (matkhau !== user.matkhau) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    res.json({ message: "Đăng nhập thành công", 
      user: {   _id: user._id,
                ten: user.ten,
                email: user.email,
                avatar: user.avatar,
                soDienThoai: user.soDienThoai,
                diaChi: user.diaChi,
                vaiTro: user.vaiTro,
                trangThai: user.trangThai,
                moTa: user.moTa
            } });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));