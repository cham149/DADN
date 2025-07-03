import mongoose from 'mongoose';
import { Province, Admin, User, Post, Report, Conversation, Message } from './database.js';

mongoose.connect("mongodb://localhost:27017/DADN");

async function seedDatabase() {
  try {
    await Promise.all([
      Province.deleteMany(),
      Admin.deleteMany(),
      User.deleteMany(),
      Post.deleteMany(),
      Report.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany()
    ]);

    const provinces = [
      { tenTinh: 'Ha Noi' },
      { tenTinh: 'TP Ho Chi Minh' },
      { tenTinh: 'Da Nang' },
      { tenTinh: 'Hai Phong' },
      { tenTinh: 'Can Tho' },
      { tenTinh: 'Quang Ninh' }
    ];
    await Province.insertMany(provinces);

    const admin1 = await Admin.create({ ten: 'Admin 1', email: 'admin1@example.com', matkhau: 'admin123' });
    const admin2 = await Admin.create({ ten: 'Admin 2', email: 'admin2@example.com', matkhau: 'admin456' });
    const admin3 = await Admin.create({ ten: 'Admin 3', email: 'admin3@example.com', matkhau: 'admin789' });

    const user1 = await User.create({
      ten: 'Nguyen Van A',
      email: 'a@example.com',
      matkhau: 'password123',
      vaiTro: 'caNhan',
      avatar: 'ea226e2bdc0bdbe4d398a2aaa46e73e3.jpg',
      moTa: 'Thích mua sắm và giao dịch online',
      soDienThoai: '0901234567',
      diaChi: '123 Đường A, Hà Nội'
    });
    const user2 = await User.create({
      ten: 'Tran Thi B',
      email: 'b@example.com',
      matkhau: 'password456',
      vaiTro: 'trang',
      avatar: 'ea226e2bdc0bdbe4d398a2aaa46e73e3.jpg',
      moTa: 'Bán hàng thời trang và đồ gia dụng',
      soDienThoai: '0912345678',
      diaChi: '456 Đường B, TP.HCM'
    });
    const user3 = await User.create({
      ten: 'Le Van C',
      email: 'c@example.com',
      matkhau: 'password789',
      vaiTro: 'caNhan',
      avatar: 'ea226e2bdc0bdbe4d398a2aaa46e73e3.jpg',
      moTa: 'Tìm mua đồ điện tử giá rẻ',
      soDienThoai: '0923456789',
      diaChi: '789 Đường C, Đà Nẵng'
    });

    const province1 = await Province.findOne({ tenTinh: 'Ha Noi' });
    const province2 = await Province.findOne({ tenTinh: 'TP Ho Chi Minh' });
    const province3 = await Province.findOne({ tenTinh: 'Da Nang' });
    const post1 = await Post.create({
      nguoiDang: user1._id,
      danhMuc: 'doDienTu',
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
      danhMuc: 'quanAo',
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
      danhMuc: 'doGiaDung',
      tinhTrangVatDung: 'cu',
      diaChi: province3._id,
      loaiGiaoDich: 'ban',
      giaTien: 200000,
      soLuong: 2,
      moTa: 'Ghế văn phòng cũ, còn sử dụng tốt',
      hinhAnh: ['ghe1.jpg']
    });

    const report1 = await Report.create({
      nguoiBaoCao: user1._id,
      nguoiBiBaoCao: user2._id,
      baiBiBaoCao: post2._id,
      lyDo: 'Hàng không đúng mô tả',
      thoiGianBaoCao: new Date('2025-06-15')
    });
    const report2 = await Report.create({
      nguoiBaoCao: user3._id,
      nguoiBiBaoCao: user1._id,
      baiBiBaoCao: post1._id,
      lyDo: 'Giá không hợp lý',
      thoiGianBaoCao: new Date('2025-06-20'),
      trangThai: 'daXuLy',
      adminXuLy: admin1._id
    });
    const report3 = await Report.create({
      nguoiBaoCao: user2._id,
      nguoiBiBaoCao: user3._id,
      baiBiBaoCao: post3._id,
      lyDo: 'Hàng giao chậm',
      thoiGianBaoCao: new Date('2025-06-25'),
      trangThai: 'biTuChoi',
      adminXuLy: admin2._id
    });

    const conversation1 = await Conversation.create({
      nguoi1: user1._id,
      nguoi2: user2._id
    });
    const conversation2 = await Conversation.create({
      nguoi1: user2._id,
      nguoi2: user3._id
    });
    const conversation3 = await Conversation.create({
      nguoi1: user3._id,
      nguoi2: user1._id
    });

    const message1 = await Message.create({
      cuocTroChuyen: conversation1._id,
      nguoiGui: user1._id,
      nguoiNhan: user2._id,
      noiDung: 'Chào bạn, áo còn không?',
      thoiGianGui: new Date('2025-07-01 10:00')
    });
    const message2 = await Message.create({
      cuocTroChuyen: conversation1._id,
      nguoiGui: user2._id,
      nguoiNhan: user1._id,
      noiDung: 'Còn, bạn muốn lấy không?',
      thoiGianGui: new Date('2025-07-01 10:05'),
      trangThai: 'daDoc'
    });
    const message3 = await Message.create({
      cuocTroChuyen: conversation2._id,
      nguoiGui: user2._id,
      nguoiNhan: user3._id,
      noiDung: 'Ghế còn không?',
      thoiGianGui: new Date('2025-07-01 11:00')
    });

    console.log('✅ Dữ liệu đã được thêm thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi thêm dữ liệu:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();