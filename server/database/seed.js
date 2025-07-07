import mongoose from 'mongoose';
import {
  Province,
  Admin,
  User,
  Post,
  Report,
  Conversation,
  Message
} from './database.js'; // Đổi nếu file schema không phải là database.js

mongoose.connect("mongodb://localhost:27017/DADN", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedDatabase() {
  try {
    console.log("🧹 Đang xoá dữ liệu cũ...");
    await Promise.all([
      Province.deleteMany(),
      Admin.deleteMany(),
      User.deleteMany(),
      Post.deleteMany(),
      Report.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany()
    ]);
    console.log("✅ Đã xoá dữ liệu cũ.");

    // ─── Tạo tỉnh/thành ───
    const provinces = await Province.insertMany([
      { maTinh: 'HN', tenTinh: 'Hà Nội' },
      { maTinh: 'HCM', tenTinh: 'TP Hồ Chí Minh' },
      { maTinh: 'DN', tenTinh: 'Đà Nẵng' },
      { maTinh: 'HP', tenTinh: 'Hải Phòng' },
      { maTinh: 'CT', tenTinh: 'Cần Thơ' },
      { maTinh: 'QN', tenTinh: 'Quảng Ninh' }
    ]);
    console.log("✅ Đã thêm tỉnh.");

    // Lấy ID tỉnh bằng maTinh
    const tinhHN = provinces.find(p => p.maTinh === 'HN');
    const tinhHCM = provinces.find(p => p.maTinh === 'HCM');
    const tinhDN = provinces.find(p => p.maTinh === 'DN');

    // ─── Admin ───
    const [admin1, admin2] = await Admin.insertMany([
      { ten: 'Admin 1', email: 'admin1@example.com', matkhau: 'admin123' },
      { ten: 'Admin 2', email: 'admin2@example.com', matkhau: 'admin456' }
    ]);
    console.log("✅ Đã tạo admin.");

    // ─── User ───
    const [user1, user2, user3] = await User.insertMany([
      {
        ten: 'Nguyễn Văn A',
        email: 'a@example.com',
        matkhau: 'pass123',
        vaiTro: 'Cá nhân',
        avatar: 'default.jpg',
        moTa: 'Thích đồ công nghệ'
      },
      {
        ten: 'Trần Thị B',
        email: 'b@example.com',
        matkhau: 'pass456',
        vaiTro: 'Trang',
        avatar: 'default.jpg',
        moTa: 'Bán thời trang, mỹ phẩm'
      },
      {
        ten: 'Lê Văn C',
        email: 'c@example.com',
        matkhau: 'pass789',
        vaiTro: 'Cá nhân',
        avatar: 'default.jpg',
        moTa: 'Tìm đồ thanh lý rẻ'
      }
    ]);
    console.log("✅ Đã tạo người dùng.");

    // ─── Post ───
    await Post.insertMany([
      {
        nguoiDang: user1._id,
        danhMuc: 'Điện tử',
        tinhTrangVatDung: 'Cũ',
        diaChi: tinhHN._id,
        loaiGiaoDich: 'Bán',
        giaTien: 1000000,
        soLuong: 1,
        moTa: 'Laptop cũ, dùng tốt',
        hinhAnh: 'laptop.jpg'
      },
      {
        nguoiDang: user2._id,
        danhMuc: 'Thời trang',
        tinhTrangVatDung: 'Mới',
        diaChi: tinhHCM._id,
        loaiGiaoDich: 'Cho',
        giaTien: 0,
        soLuong: 3,
        moTa: 'Áo thun mới, size M L',
        hinhAnh: 'aothun.jpg'
      },
      {
        nguoiDang: user3._id,
        danhMuc: 'Gia dụng',
        tinhTrangVatDung: 'Cũ',
        diaChi: tinhDN._id,
        loaiGiaoDich: 'Bán',
        giaTien: 200000,
        soLuong: 2,
        moTa: 'Nồi cơm điện cũ, còn tốt',
        hinhAnh: 'noicom.jpg'
      },
      {
        nguoiDang: user1._id,
        danhMuc: 'Gia dụng',
        tinhTrangVatDung: 'Cũ',
        diaChi: tinhDN._id,
        loaiGiaoDich: 'Bán',
        giaTien: 150000,
        soLuong: 1,
        moTa: 'Ghế sofa bông mới 90%, 80x50x100cm',
        hinhAnh: "https://i.pinimg.com/736x/e7/0c/ae/e70cae15753780502c14f2db168bea48.jpg"
      }
    ]);
    console.log("✅ Đã thêm bài đăng.");

    console.log("🎉 Seed dữ liệu hoàn tất!");
  } catch (err) {
    console.error("❌ Lỗi khi seed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
