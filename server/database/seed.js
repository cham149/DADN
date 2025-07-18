import mongoose from 'mongoose';
import {
  Admin,
  User,
  Post,
  Report,
  Conversation,
  Message,
  Category
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

    // ─── Danh mục sản phẩm (16 mục theo ảnh, sắp xếp alphabet) ───
    const categoryList = [
      'Cây Trồng',
      'Đồ Bếp',
      'Đồ Thú Cưng',
      'Du Lịch',
      'Động Vật',
      'Giải Trí',
      'Gia Dụng',
      'Giày Dép',
      'Linh Kiện',
      'Mỹ Phẩm',
      'Phụ Kiện',
      'Quần Áo',
      'Sách Vở',
      'Thể Thao',
      'Thiết Bị',
      'Trang Sức'
    ];

    const categoryObjects = categoryList.map(name => ({
      tenDanhMuc: name,
      moTa: `Danh mục về ${name}`
    }));

    const categories = await Category.insertMany(categoryObjects);
    console.log("✅ Đã tạo danh mục.");

    // Lấy danh mục dùng để gán cho bài viết
    const catGiaDung = categories.find(c => c.tenDanhMuc === 'Gia Dụng');
    const catThietBi = categories.find(c => c.tenDanhMuc === 'Thiết Bị');
    const catQuanAo = categories.find(c => c.tenDanhMuc === 'Quần Áo');
    const catMyPham = categories.find(c => c.tenDanhMuc === 'Mỹ Phẩm');

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
        avatar: 'https://i.pinimg.com/1200x/e2/49/26/e249268827c30931ca310fab758f3385.jpg',
        moTa: 'Thích đồ công nghệ'
      },
      {
        ten: 'Trần Thị B',
        email: 'b@example.com',
        matkhau: 'pass456',
        vaiTro: 'Trang',
        avatar: 'https://i.pinimg.com/736x/5a/38/c4/5a38c4765a98cc2529997478ab9d5e54.jpg',
        moTa: 'Bán thời trang, mỹ phẩm'
      },
      {
        ten: 'Lê Văn C',
        email: 'c@example.com',
        matkhau: 'pass789',
        vaiTro: 'Cá nhân',
        avatar: 'https://i.pinimg.com/1200x/42/e3/35/42e335ef34ef9d4d30babbb8c26f535e.jpg',
        moTa: 'Tìm đồ thanh lý rẻ'
      }
    ]);
    console.log("✅ Đã tạo người dùng.");

    // ─── Post ───
    await Post.insertMany([
      {
        nguoiDang: user1._id,
        danhMuc: catThietBi._id,
        tinhTrangVatDung: 'Cũ',
        diaChi: 'Hà Nội',
        loaiGiaoDich: 'Bán',
        giaTien: 1000000,
        soLuong: 1,
        moTa: 'Laptop cũ, dùng tốt',
        hinhAnh: 'https://i.pinimg.com/1200x/76/1b/f3/761bf384668e9f7964807c56abb90303.jpg'
      },
      {
        nguoiDang: user2._id,
        danhMuc: catQuanAo._id,
        tinhTrangVatDung: 'Mới',
        diaChi: 'TP Hồ Chí Minh',
        loaiGiaoDich: 'Cho',
        giaTien: 0,
        soLuong: 3,
        moTa: 'Áo thun mới, size M L',
        hinhAnh: 'https://i.pinimg.com/1200x/05/b6/51/05b6515f740ce8ffc3d2060c2950953b.jpg'
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
        hinhAnh: 'https://i.pinimg.com/736x/58/ac/9a/58ac9a11a747239ea70cf2c519d26f53.jpg'
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

    // ─── Conversation ───
    const conversations = await Conversation.insertMany([
      {
        nguoi1: user1._id,
        nguoi2: user2._id,
        thoiGianTao: new Date(),
        thoiGianCapNhat: new Date()
      },
      {
        nguoi1: user2._id,
        nguoi2: user3._id,
        thoiGianTao: new Date(),
        thoiGianCapNhat: new Date()
      },
      {
        nguoi1: user3._id,
        nguoi2: user1._id,
        thoiGianTao: new Date(),
        thoiGianCapNhat: new Date()
      }
    ]);
    console.log("✅ Đã tạo cuộc hội thoại.");

    // ─── Message ───
    await Message.insertMany([
      {
        cuocTroChuyen: conversations[0]._id,
        nguoiGui: user1._id,
        nguoiNhan: user2._id,
        noiDung: 'Bạn có bán laptop không?',
        thoiGianGui: new Date(),
        trangThai: 'Chưa đọc'
      },
      {
        cuocTroChuyen: conversations[0]._id,
        nguoiGui: user2._id,
        nguoiNhan: user1._id,
        noiDung: 'Có, giá 1 triệu, bạn quan tâm không?',
        thoiGianGui: new Date(),
        trangThai: 'Đã đọc'
      },
      {
        cuocTroChuyen: conversations[1]._id,
        nguoiGui: user2._id,
        nguoiNhan: user3._id,
        noiDung: 'Mình có áo thun mới, bạn muốn xem?',
        thoiGianGui: new Date(),
        trangThai: 'Chưa đọc'
      },
      {
        cuocTroChuyen: conversations[1]._id,
        nguoiGui: user3._id,
        nguoiNhan: user2._id,
        noiDung: 'Cảm ơn, mình muốn xem thử!',
        thoiGianGui: new Date(),
        trangThai: 'Chưa đọc'
      }
    ]);

    console.log("✅ Đã thêm tin nhắn.");

    console.log("🎉 Seed dữ liệu hoàn tất!");
  } catch (err) {
    console.error("❌ Lỗi khi seed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
