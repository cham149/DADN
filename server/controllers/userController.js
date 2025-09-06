import mongoose from "mongoose";
import { User } from "../database/database.js";

// --- Upload avatar ---
export const uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file" });
  }
  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url });
};

// --- Tạo người dùng mới ---
export const createUser = async (req, res) => {
  try {
    const { ten,email, matkhau, moTa, avatar, vaiTro = "Cá nhân", trangThai = "Mở", soBaiVietBiKhoa = 0 } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email này đã tồn tại" });
    }

    // Kiểm tra tên đã tồn tại chưa
    const existingTen = await Admin.findOne({ ten });
    if (existingTen) {
      return res.status(400).json({ message: "Tên admin này đã tồn tại" });
    }
  
    const newUser = new User({
      ten,
      email,
      moTa,
      matkhau,
      avatar,
      vaiTro,
      trangThai,
      soBaiVietBiKhoa,
      ngayTao: new Date(),
      ngayCapNhat: new Date()
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Tạo người dùng thành công", user: savedUser });
  } catch (error) {
    console.error("Lỗi tạo người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Cập nhật thông tin người dùng ---
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten,email, moTa, avatar, matkhau, vaiTro, trangThai, soBaiVietBiKhoa } = req.body; 

    const user = await User.findByIdAndUpdate(
      id,
      { 
        ten, 
        email,
        moTa, 
        avatar, 
        matkhau,
        vaiTro, 
        trangThai, 
        soBaiVietBiKhoa,
        ngayCapNhat: new Date() // tự cập nhật thời gian
      }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thành công", user });
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Xóa người dùng ---
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Xóa người dùng thành công", user: deletedUser });
  } catch (error) {
    console.error("Lỗi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Lấy thông tin người dùng theo ID ---
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID người dùng không hợp lệ" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Lỗi server khi lấy người dùng:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// --- Lấy danh sách người dùng ---
export const getUserList = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
