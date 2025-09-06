import mongoose from 'mongoose';

// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DADN");

// ───── Admin ─────
const AdminSchema = new mongoose.Schema({
  ten: String,
  email: { type: String, unique: true },
  matkhau: String,
}, { timestamps: { createdAt: 'ngayTao'}});

export const Admin = mongoose.model('Admin', AdminSchema);

// ───── Người dùng ─────
const UserSchema = new mongoose.Schema({
  ten: String,
  email: { type: String, unique: true },
  matkhau: String,
  vaiTro: { type: String, enum: ['Trang', 'Cá nhân'] },
  avatar: String,
  trangThai: { type: String, enum: ['Khóa', 'Mở'], default: 'Mở' },
  moTa: { type: String, default: '' },
  soBaiVietBiKhoa: { type: Number, default: 0 } 
}, { timestamps: { createdAt: 'ngayTao', updatedAt: 'ngayCapNhat' }});
export const User = mongoose.model('User', UserSchema);

// ───── Bài đăng ─────
const PostSchema = new mongoose.Schema({
  nguoiDang: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thoiGianDang: { type: Date, default: Date.now },
  thoiGianCapNhat: { type: Date, default: Date.now },
  danhMuc: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  tinhTrangVatDung: { type: String, enum: ['Mới', 'Cũ'] },
  diaChi: String,
  loaiGiaoDich: { type: String, enum: ['Bán', 'Cho'] },
  giaTien: Number,
  trangThaiBaiDang: { type: String, enum: ['Đã bán', 'Đã cho', 'Còn'], default: 'Còn' },
  soLuong: Number,
  moTa: String,
  hinhAnh: String,
  soLuotBaoCao: { type: Number, default: 0 },
  trangThaiBaoCao: { type: String, enum: ['Bình thường', 'Chờ duyệt', 'Đã khóa'], default: 'Bình thường' }

});
export const Post = mongoose.model('Post', PostSchema);

// ───── Danh mục sản phẩm ─────
const CategorySchema = new mongoose.Schema({
  tenDanhMuc: { type: String, required: true, unique: true },
  moTa: { type: String, default: '' }
});
export const Category = mongoose.model('Category', CategorySchema);

// ───── Lịch sử báo cáo ─────
const ReportSchema = new mongoose.Schema({
  nguoiBaoCao: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nguoiBiBaoCao: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  baiBiBaoCao: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  lyDo: String,
  thoiGianBaoCao: { type: Date, default: Date.now },
  trangThai: { type: String, enum: ['Đang xử lý', 'Đã xử lý', 'Bị từ chối'], default: 'Đang xử lý' },
  adminXuLy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }
});
export const Report = mongoose.model('Report', ReportSchema);

// ───── Cuộc trò chuyện ─────
const ConversationSchema = new mongoose.Schema({
  nguoi1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nguoi2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thoiGianTao: { type: Date, default: Date.now },
  thoiGianCapNhat: { type: Date, default: Date.now }
});
export const Conversation = mongoose.model('Conversation', ConversationSchema);

// ───── Tin nhắn ─────
const MessageSchema = new mongoose.Schema({
  cuocTroChuyen: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  nguoiGui: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nguoiNhan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  noiDung: { type: String},
  loai: { type: String, enum: ["text", "post"], default: "text"},
  postData: { type: Object, default: null},
  thoiGianGui: { type: Date, default: Date.now },
  trangThai: { type: String, enum: ['Đã đọc', 'Chưa đọc'], default: 'Chưa đọc' }
});
export const Message = mongoose.model('Message', MessageSchema);

console.log("✅ Cấu trúc schema đã được khai báo và kết nối MongoDB thành công.");
