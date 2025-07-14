import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Thêm cors
import multer from "multer";
//check địa chỉ ảnh cũ và thay thế địa chỉ cũ 
import fs from "fs";
import path from "path";

import { User } from "./database/database.js";
import { Post } from "./database/database.js";
import { Category } from "./database/database.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://localhost:27017/DADN");

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    const filePath = path.join("uploads", filename);

    // Nếu trùng tên, xóa file cũ (cực hiếm nếu dùng timestamp, nhưng đề phòng)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    cb(null, filename);
  },
});
const upload = multer({ storage });

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
      diaChi: diaChi || null,
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

// Cập nhật thông tin người dùng
app.put("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, moTa, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { ten, moTa, avatar },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thành công", user });
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// LẤY THÔNG TIN NGƯỜI DÙNG THEO ID
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Danh mục
app.get("/api/categories", async (req, res) => {
  try {
    const danhMucList = await Category.find({});
    res.json({ categories: danhMucList });
  } catch (err) {
    console.error("❌ Lỗi lấy danh mục:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
  }
});

// Bài đăng trong profile
app.get('/api/mypost', async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(400).json({ error: 'Thiếu userID' });
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ error: 'userID không hợp lệ' });
    }

    const posts = await Post.find({ nguoiDang: new mongoose.Types.ObjectId(userID) })
      .populate('nguoiDang')
      .populate('danhMuc')
      .sort({ thoiGianDang: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy bài đăng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Tạo bài đăng mới
app.post("/api/post", upload.single("hinhAnh"), async (req, res) => {
  try {
    const { moTa, soLuong, giaTien, tinhTrangVatDung, diaChi, danhMuc, loaiGiaoDich, trangThaiBaiDang, nguoiDang } = req.body;
    const hinhAnh = req.file.filename;

    const newPost = new Post({
      moTa,
      soLuong,
      giaTien,
      tinhTrangVatDung,
      diaChi,
      danhMuc,
      loaiGiaoDich,
      trangThaiBaiDang,
      nguoiDang,
      hinhAnh,
      thoiGianCapNhat: new Date(),
    });

    await newPost.save();
    res.json({ message: "Đăng bài thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng bài:", error);
    res.status(500).json({ message: "Lỗi server khi đăng bài" });
  }
});

// Lấy danh sách bài đăng của nhiều người cho trang Home
app.get("/api/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = 10; // Số bài mỗi trang
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .populate("nguoiDang")
      .populate("danhMuc")
      .sort({ thoiGianCapNhat: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bài đăng (home):", error);
    res.status(500).json({ message: "Lỗi server khi lấy bài đăng" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
