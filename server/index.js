import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors"; // Thêm cors
import multer from "multer";
//check địa chỉ ảnh cũ và thay thế địa chỉ cũ 
import fs from "fs";
import path from "path";

import { initSocket } from "./socket.js"; 


import { User, Post, Category, Conversation, Message, Report, Admin } from "./database/database.js";

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
// Upload avatar người dùng
app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file" });
  }

  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url });
});


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
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID người dùng không hợp lệ" });
    }

    // Tìm người dùng theo id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Lỗi server khi lấy người dùng:", err);
    res.status(500).json({ error: "Lỗi server" });
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
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const {
      diaChi,
      moTa,
      tinhTrangVatDung,
      giaTien,
      loaiGiaoDich,
      danhMuc
    } = req.query;

    const filter = {};

    if (danhMuc) filter.danhMuc = danhMuc;
    if (diaChi) filter.diaChi = { $regex: diaChi, $options: "i" };
    if (moTa) filter.moTa = { $regex: moTa, $options: "i" };
    if (tinhTrangVatDung) filter.tinhTrangVatDung = tinhTrangVatDung;
    if (loaiGiaoDich) filter.loaiGiaoDich = loaiGiaoDich;
    if (giaTien) filter.giaTien = { $lte: parseInt(giaTien) };

    const posts = await Post.find(filter)
      .populate("nguoiDang")
      .populate("danhMuc")
      .sort({ thoiGianCapNhat: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bài đăng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy bài đăng" });
  }
});

// Search toàn cục: tìm cả bài đăng và người dùng
app.get("/api/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });

    const regex = new RegExp(query, "i");

    // Tìm bài đăng theo nhiều trường
    const posts = await Post.find({
      $or: [
        { moTa: regex },
        { diaChi: regex },
        { tinhTrangVatDung: regex },
        { loaiGiaoDich: regex },
        { trangThaiBaiDang: regex }
      ]
    })
      .populate("nguoiDang")
      .populate("danhMuc")
      .limit(20)
      .sort({ thoiGianCapNhat: -1 });

    // Tìm người dùng theo tên
    const users = await User.find({ ten: regex }).limit(10);

    res.status(200).json({ posts, users });
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm" });
  }
});

// //////////////////CHAT///////////////////////
// Lấy danh sách cuộc trò chuyện của người dùng
app.get('/api/partners/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    // Tìm tất cả conversation có userId
    const conversations = await Conversation.find({
      $or: [{ nguoi1: userId }, { nguoi2: userId }]
    });

    if (conversations.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện nào.' });
    }

    // Lấy danh sách người còn lại (không trùng lặp)
    const otherUserIds = conversations.map(conv => {
      return conv.nguoi1.equals(userId) ? conv.nguoi2 : conv.nguoi1;
    });

    // Loại bỏ trùng lặp ID
    const uniqueUserIds = [...new Set(otherUserIds.map(id => id.toString()))];

    // Truy vấn thông tin các người dùng còn lại
    const otherUsers = await User.find({
      _id: { $in: uniqueUserIds }
    });

    return res.json(otherUsers);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
});

// ✅ Thêm API find-or-create conversation
app.post('/api/conversations/find-or-create', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ error: "Thiếu userId" });
    }

    // Đồng bộ ObjectId
    const u1 = new mongoose.Types.ObjectId(user1Id);
    const u2 = new mongoose.Types.ObjectId(user2Id);

    // Tìm conversation đã tồn tại giữa 2 người
    let conversation = await Conversation.findOne({
      $or: [
        { nguoi1: u1, nguoi2: u2 },
        { nguoi1: u2, nguoi2: u1 }
      ]
    });

    // Nếu chưa có thì tạo mới
    if (!conversation) {
      conversation = new Conversation({ nguoi1: u1, nguoi2: u2 });
      await conversation.save();
    }

    return res.status(200).json({ conversationId: conversation._id });
  } catch (error) {
    console.error("Lỗi khi tìm hoặc tạo conversation:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
});
// Lấy tin nhắn của một cuộc trò chuyện
app.get("/api/messages/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "ID cuộc trò chuyện không hợp lệ" });
    }

    const messages = await Message.find({ cuocTroChuyen: conversationId })
      .populate("nguoiGui nguoiNhan")
      .sort({ thoiGianGui: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Gửi tin nhắn mới
app.post("/api/messages", async (req, res) => {
  try {
    // console.log("📩 Body nhận từ client:", req.body);   // 👈 log để kiểm tra
    const { cuocTroChuyen, nguoiGui, nguoiNhan, noiDung, loai, postData } = req.body;

    // Nếu là text thì phải có noiDung, còn post thì chỉ cần postData
    if (!cuocTroChuyen || !nguoiGui || !nguoiNhan || (loai === "text" && !noiDung)) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const newMessage = new Message({
      cuocTroChuyen,
      nguoiGui,
      nguoiNhan,
      noiDung: noiDung || "",     // text thì lấy, post thì để rỗng
      loai: loai || "text",
      postData: postData || null
    });

    await newMessage.save();
    await newMessage.populate("nguoiGui nguoiNhan");

    res.status(201).json({ message: newMessage });
  } catch (error) {
    // console.error("🔥 Chi tiết lỗi khi gửi tin nhắn:", error); // 👈 log lỗi chi tiết
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Xoá tin nhắn theo ID
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy tin nhắn" });

    res.json({ message: "Đã xoá thành công" });
  } catch (err) {
    console.error("Lỗi xoá tin nhắn:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ✅ Đánh dấu là đã đọc
app.put("/api/messages/read-message", async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    if (!conversationId || !userId) {
      return res.status(400).json({ error: "Thiếu conversationId hoặc userId" });
    }

    const result = await Message.updateMany(
      {
        cuocTroChuyen: conversationId,
        nguoiNhan: userId,
        trangThai: "Chưa đọc"
      },
      { $set: { trangThai: "Đã đọc" } }
    );

    res.json({ message: "Đã cập nhật trạng thái", updated: result.modifiedCount });
  } catch (err) {
    console.error("Lỗi đánh dấu đã đọc:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Lấy số tin chưa đọc của từng partner
app.get("/api/messages/unread/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const unread = await Message.aggregate([
      { $match: { nguoiNhan: new mongoose.Types.ObjectId(userId), trangThai: "Chưa đọc" } },
      {
        $group: {
          _id: "$nguoiGui",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(unread); // [{ _id: "idNguoiGui", count: 3 }, ...]
  } catch (err) {
    console.error("Lỗi lấy số tin chưa đọc:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});


// 🔥 Khởi tạo HTTP server từ Express app
const server = http.createServer(app);
// 🔌 Khởi động Socket
initSocket(server);
// 🚀 Lắng nghe tại cổng 5000
server.listen(5000, () => {
  console.log("Server + Socket đang chạy tại http://localhost:5000");
});
