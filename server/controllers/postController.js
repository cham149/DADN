import mongoose from "mongoose";
import { Post, Report, User } from "../database/database.js";
import fs from "fs"; // Để xóa ảnh cũ nếu cần

// Bài đăng trong profile
export const getMyPosts = async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(400).json({ error: 'Thiếu userID' });
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ error: 'userID không hợp lệ' });
    }

    const posts = await Post.find({
      nguoiDang: new mongoose.Types.ObjectId(userID),
    })
      .populate('nguoiDang')
      .populate('danhMuc')
      .sort({ thoiGianDang: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy bài đăng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Tạo bài đăng mới
export const createPost = async (req, res) => {
  try {
    const { moTa, soLuong, giaTien, tinhTrangVatDung, diaChi, danhMuc, loaiGiaoDich, trangThaiBaiDang, nguoiDang } = req.body;
    const hinhAnh = req.file ? req.file.filename : null; // Kiểm tra req.file

    if (!nguoiDang || !danhMuc || !hinhAnh) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc: người đăng, danh mục hoặc hình ảnh" });
    }

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
      thoiGianDang: new Date(), // Thêm thời gian đăng lần đầu
      thoiGianCapNhat: new Date(),
    });

    await newPost.save();
    res.json({ message: "Đăng bài thành công", post: newPost });
  } catch (error) {
    console.error("Lỗi khi đăng bài:", error);
    res.status(500).json({ message: "Lỗi server khi đăng bài" });
  }
};

// Xóa bài đăng
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Yêu cầu thiếu thông tin người dùng." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }

    if (post.nguoiDang.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này." });
    }

    // Xóa hình ảnh khỏi server nếu có
    if (post.hinhAnh) {
      const imagePath = `uploads/${post.hinhAnh}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(postId);
    await Report.deleteMany({ baiBiBaoCao: postId });

    res.json({ message: "Xóa bài đăng thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa bài đăng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật bài đăng
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { nguoiDang, moTa, soLuong, giaTien, tinhTrangVatDung, diaChi, danhMuc, loaiGiaoDich, trangThaiBaiDang } = req.body;

    if (!nguoiDang) {
      return res.status(400).json({ message: "Yêu cầu thiếu thông tin người dùng." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }

    if (post.nguoiDang.toString() !== nguoiDang) {
      return res.status(403).json({ message: "Bạn không có quyền sửa bài viết này." });
    }

    const updatedData = {
      moTa, soLuong, giaTien, tinhTrangVatDung, diaChi, danhMuc,
      loaiGiaoDich, trangThaiBaiDang,
      thoiGianCapNhat: new Date()
    };

    if (req.file) {
      // Xóa ảnh cũ nếu có và ảnh mới được upload
      if (post.hinhAnh) {
        const oldImagePath = `uploads/${post.hinhAnh}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedData.hinhAnh = req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

    res.json({ message: "Cập nhật bài đăng thành công.", post: updatedPost });
  } catch (error) {
    console.error("Lỗi khi cập nhật bài đăng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách bài đăng cho trang Home (có filter)
export const getPosts = async (req, res) => {
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

    const filter = {
      trangThaiBaoCao: { $in: ['Bình thường', 'Đang xử lý'] }
    };


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
};

// Search toàn cục: tìm cả bài đăng và người dùng (có thể tách ra search riêng cho từng loại)
export const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });

    const regex = new RegExp(query, "i");

    const posts = await Post.find({
      $or: [
        { moTa: regex },
        { diaChi: regex },
        { tinhTrangVatDung: regex },
        { loaiGiaoDich: regex },
        { trangThaiBaiDang: regex }
      ],
      trangThaiBaoCao: 'Bình thường' // Chỉ tìm các bài đăng không bị khóa
    })
      .populate("nguoiDang")
      .populate("danhMuc")
      .limit(20)
      .sort({ thoiGianCapNhat: -1 });

    const users = await User.find({
      ten: regex,
      trangThai: { $ne: 'Khóa' } // Chỉ tìm người dùng không bị khóa
    }).limit(10);

    res.status(200).json({ posts, users });
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm" });
  }
};