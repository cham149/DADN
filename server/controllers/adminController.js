import mongoose from "mongoose";
import { Admin } from "../database/database.js";

// --- Tạo admin mới ---
export const createAdmin = async (req, res) => {
  try {
    const { ten, email, matkhau } = req.body;

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

    const newAdmin = new Admin({
      ten,
      email,
      matkhau,
      ngayTao: new Date(),
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json({ message: "Tạo admin thành công", admin: savedAdmin });
  } catch (error) {
    console.error("Lỗi tạo admin:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Cập nhật admin ---
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, email, matkhau } = req.body; 

    const admin = await Admin.findByIdAndUpdate(
      id,
      { ten, email, matkhau,  }, 
      { new: true }
    );

    if (!admin) return res.status(404).json({ message: "Không tìm thấy admin" });

    res.json({ message: "Cập nhật admin thành công", admin });
  } catch (error) {
    console.error("Lỗi cập nhật admin:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Xóa admin ---
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) return res.status(404).json({ message: "Admin không tồn tại" });

    res.json({ message: "Xóa admin thành công", admin: deletedAdmin });
  } catch (error) {
    console.error("Lỗi xóa admin:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Lấy danh sách admin ---
export const getAdminList = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách admin:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

