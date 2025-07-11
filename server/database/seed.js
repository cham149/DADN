import mongoose from 'mongoose';
import {
  Admin,
  User,
  Post,
  Report,
  Conversation,
  Message,
  Category // ✅ Thêm Category
} from './database.js';

mongoose.connect("mongodb://localhost:27017/DADN", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedDatabase() {
  try {
    console.log("🧹 Đang xoá dữ liệu cũ...");
    await Promise.all([
      Category.deleteMany(),
      Admin.deleteMany(),
      User.deleteMany(),
      Post.deleteMany(),
      Report.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany()
    ]);
    console.log("✅ Đã xoá dữ liệu cũ.");

    // ─── Danh mục sản phẩm ───
    const categories = await Category.insertMany([
      { tenDanhMuc: 'Điện tử', moTa: 'Thiết bị điện tử' },
      { tenDanhMuc: 'Thời trang', moTa: 'Quần áo, phụ kiện' },
      { tenDanhMuc: 'Gia dụng', moTa: 'Đồ dùng trong nhà' }
    ]);
    console.log("✅ Đã tạo danh mục.");

    const catDienTu = categories.find(c => c.tenDanhMuc === 'Điện tử');
    const catThoiTrang = categories.find(c => c.tenDanhMuc === 'Thời trang');
    const catGiaDung = categories.find(c => c.tenDanhMuc === 'Gia dụng');

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
        danhMuc: catDienTu._id,
        tinhTrangVatDung: 'Cũ',
        diaChi: 'Hà Nội',
        loaiGiaoDich: 'Bán',
        giaTien: 1000000,
        soLuong: 1,
        moTa: 'Laptop cũ, dùng tốt',
        hinhAnh: 'laptop.jpg'
      },
      {
        nguoiDang: user2._id,
        danhMuc: catThoiTrang._id,
        tinhTrangVatDung: 'Mới',
        diaChi: 'TP Hồ Chí Minh',
        loaiGiaoDich: 'Cho',
        giaTien: 0,
        soLuong: 3,
        moTa: 'Áo thun mới, size M L',
        hinhAnh: 'aothun.jpg'
      },
      {
        nguoiDang: user3._id,
        danhMuc: catGiaDung._id,
        tinhTrangVatDung: 'Cũ',
        diaChi: 'Đà Nẵng',
        loaiGiaoDich: 'Bán',
        giaTien: 200000,
        soLuong: 2,
        moTa: 'Nồi cơm điện cũ, còn tốt',
        hinhAnh: 'noicom.jpg'
      },
      {
        nguoiDang: user1._id,
        danhMuc: catGiaDung._id,
        tinhTrangVatDung: 'Cũ',
        diaChi: 'Đà Nẵng',
        loaiGiaoDich: 'Bán',
        giaTien: 150000,
        soLuong: 1,
        moTa: 'Ghế sofa bông mới 90%, 80x50x100cm',
        hinhAnh: 'https://i.pinimg.com/736x/e7/0c/ae/e70cae15753780502c14f2db168bea48.jpg'
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
