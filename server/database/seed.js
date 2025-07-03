import mongoose from 'mongoose';
import { Province, Admin, User, Post, Report, Conversation, Message } from './database.js';

mongoose.connect("mongodb://localhost:27017/DADN");

async function seedDatabase() {
  try {
    // Xóa dữ liệu cũ
    await Promise.all([
      Province.deleteMany(),
      Admin.deleteMany(),
      User.deleteMany(),
      Post.deleteMany(),
      Report.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany()
    ]);

    // Thêm tỉnh
    const provinces = await Province.insertMany([
      { tenTinh: 'Hà Nội' },
      { tenTinh: 'TP Hồ Chí Minh' },
      { tenTinh: 'Đà Nẵng' },
      { tenTinh: 'Hải Phòng' },
      { tenTinh: 'Cần Thơ' },
      { tenTinh: 'Quảng Ninh' }
    ]);

    // Tạo admin
    const admin1 = await Admin.create({ ten: 'Quản trị viên 1', email: 'admin1@example.com', matkhau: 'admin123' });
    const admin2 = await Admin.create({ ten: 'Quản trị viên 2', email: 'admin2@example.com', matkhau: 'admin456' });
    const admin3 = await Admin.create({ ten: 'Quản trị viên 3', email: 'admin3@example.com', matkhau: 'admin789' });

    // Tạo user
    const user1 = await User.create({
      ten: 'Nguyễn Văn A',
      email: 'a@example.com',
      matkhau: 'password123',
      vaiTro: 'caNhan',
      avatar: 'default.jpg',
      moTa: 'Thích mua sắm và giao dịch online',
      soDienThoai: '0901234567',
      diaChi: '123 Đường A, Hà Nội'
    });
    const user2 = await User.create({
      ten: 'Trần Thị B',
      email: 'b@example.com',
      matkhau: 'password456',
      vaiTro: 'trang',
      avatar: 'default.jpg',
      moTa: 'Bán hàng thời trang và đồ gia dụng',
      soDienThoai: '0912345678',
      diaChi: '456 Đường B, TP Hồ Chí Minh'
    });
    const user3 = await User.create({
      ten: 'Lê Văn C',
      email: 'c@example.com',
      matkhau: 'password789',
      vaiTro: 'caNhan',
      avatar: 'default.jpg',
      moTa: 'Tìm mua đồ điện tử giá rẻ',
      soDienThoai: '0923456789',
      diaChi: '789 Đường C, Đà Nẵng'
    });

    // Lấy id tỉnh tương ứng
    const province1 = provinces.find(p => p.tenTinh === 'Hà Nội');
    const province2 = provinces.find(p => p.tenTinh === 'TP Hồ Chí Minh');
    const province3 = provinces.find(p => p.tenTinh === 'Đà Nẵng');

    // Tạo bài đăng
    const post1 = await Post.create({
      nguoiDang: user1._id,
      danhMuc: 'Đồ điện tử',
      tinhTrangVatDung: 'cu',
      diaChi: province1._id,
      loaiGiaoDich: 'ban',
      giaTien: 500000,
      soLuong: 1,
      moTa: 'Laptop cũ còn tốt, pin 80%',
      hinhAnh: ['laptop1.jpg', 'laptop2.jpg']
    });
    const post2 = await Post.create({
      nguoiDang: user2._id,
      danhMuc: 'Quần áo',
      tinhTrangVatDung: 'moi',
      diaChi: province2._id,
      loaiGiaoDich: 'cho',
      giaTien: 0,
      soLuong: 3,
      moTa: 'Áo khoác mới, size M, L',
      hinhAnh: ['aokhoac1.jpg', 'aokhoac2.jpg']
    });
    const post3 = await Post.create({
      nguoiDang: user3._id,
      danhMuc: 'Đồ gia dụng',
      tinhTrangVatDung: 'cu',
      diaChi: province3._id,
      loaiGiaoDich: 'ban',
      giaTien: 200000,
      soLuong: 2,
      moTa: 'Ghế văn phòng cũ, còn sử dụng tốt',
      hinhAnh: ['ghe1.jpg']
    });

    console.log("✅ Seed dữ liệu thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi seed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
