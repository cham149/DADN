import { User } from "../database/database.js";
import { Admin } from "../database/database.js";

// Đăng ký
export const signup = async (req, res) => {
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
      soDienThoai: soDienThoai || null,
      vaiTro,
    });
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: { ten, email } });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { ten, matkhau } = req.body;

    if (!ten || !matkhau) {
      return res.status(400).json({ message: "Vui lòng điền tên và mật khẩu" });
    }

    const user = await User.findOne({ ten });
    if (!user) {
      return res.status(400).json({ message: "Tên đăng nhập không tồn tại" });
    }

    if (user.trangThai === 'Khóa') {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa và không thể đăng nhập." });
    }

    if (matkhau !== user.matkhau) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    res.json({
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        ten: user.ten,
        email: user.email,
        avatar: user.avatar,
        soDienThoai: user.soDienThoai,
        diaChi: user.diaChi,
        vaiTro: user.vaiTro,
        trangThai: user.trangThai,
        moTa: user.moTa
      }
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng nhập Admin
export const adminLogin = async (req, res) => {
  try {
    const { ten, matkhau } = req.body;

    if (!ten || !matkhau) {
      return res.status(400).json({ message: "Vui lòng nhập tên và mật khẩu" });
    }

    const admin = await Admin.findOne({ ten });
    if (!admin) {
      return res.status(400).json({ message: "Admin không tồn tại" });
    }

    if (matkhau !== admin.matkhau) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    res.json({
      message: "Đăng nhập admin thành công",
      admin: {
        _id: admin._id,
        ten: admin.ten,
        email: admin.email,
        avatar: admin.avatar,
        vaiTro: "Admin",
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập admin:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
