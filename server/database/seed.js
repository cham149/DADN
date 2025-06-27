import mongoose from 'mongoose';
import { Admin, User, Post, Report, Conversation, Message } from './database.js';

const mongoURI = "mongodb://127.0.0.1:27017/DADN";

async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Kết nối MongoDB thành công");

    // Xóa dữ liệu cũ (tùy chọn)
    await Promise.all([
      Admin.deleteMany(),
      User.deleteMany(),
      Post.deleteMany(),
      Report.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany()
    ]);

    // Tạo admin
    const admin = await Admin.create({
      ten: 'Admin Demo',
      email: 'admin@example.com',
      matkhau: 'admin123',
    });

    // Tạo 2 người dùng
    const user1 = await User.create({
      ten: 'Nguyễn Văn A',
      email: 'user1@example.com',
      matkhau: '123456',
      vaiTro: 'caNhan',
      soDienThoai: '0901234567',
      diaChi: 'Hà Nội',
      trangThai: 'mo'
    });

    const user2 = await User.create({
      ten: 'Trần Thị B',
      email: 'user2@example.com',
      matkhau: '123456',
      vaiTro: 'trang',
      soDienThoai: '0907654321',
      diaChi: 'TP. Hồ Chí Minh',
      trangThai: 'mo'
    });

    // Tạo bài đăng
    const post1 = await Post.create({
      nguoiDang: user1._id,
      danhMuc: 'Đồ điện tử',
      tinhTrangVatDung: 'cu',
      diaChi: 'Hà Nội',
      loaiGiaoDich: 'ban',
      giaTien: 500000,
      soLuong: 1,
      moTa: 'Laptop cũ, còn tốt',
      hinhAnh: ['laptop.jpg']
    });

    const post2 = await Post.create({
      nguoiDang: user2._id,
      danhMuc: 'Quần áo',
      tinhTrangVatDung: 'moi',
      diaChi: 'TP. Hồ Chí Minh',
      loaiGiaoDich: 'cho',
      giaTien: 0,
      soLuong: 3,
      moTa: 'Áo khoác mới chưa dùng',
      hinhAnh: ['aokhoac.jpg']
    });

    // Tạo cuộc trò chuyện
    const conversation = await Conversation.create({
      nguoi1: user1._id,
      nguoi2: user2._id
    });

    // Tạo tin nhắn
    await Message.create({
      cuocTroChuyen: conversation._id,
      nguoiGui: user1._id,
      nguoiNhan: user2._id,
      noiDung: 'Chào bạn, áo còn không?',
      trangThai: 'chuaDoc'
    });

    // Tạo báo cáo
    await Report.create({
      nguoiBaoCao: user1._id,
      nguoiBiBaoCao: user2._id,
      baiBiBaoCao: post2._id,
      lyDo: 'Hàng không đúng mô tả',
      trangThai: 'dangXuLy',
      adminXuLy: admin._id
    });

    console.log('✅ Seed dữ liệu thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed dữ liệu:', err);
    process.exit(1);
  }
}

seedDatabase();
