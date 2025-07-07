import mongoose from 'mongoose';

// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DADN");

// ───── Tỉnh/Thành phố ─────
const ProvinceSchema = new mongoose.Schema({
  maTinh: { type: String, required: true, unique: true },
  tenTinh: { type: String, required: true, unique: true }
});
export const Province = mongoose.model('Province', ProvinceSchema);

// ───── Admin ─────
const AdminSchema = new mongoose.Schema({
  ten: String,
  email: { type: String, unique: true },
  matkhau: String,
  ngayTao: { type: Date, default: Date.now }
});
export const Admin = mongoose.model('Admin', AdminSchema);

// ───── Người dùng ─────
const UserSchema = new mongoose.Schema({
  ten: String,
  email: { type: String, unique: true },
  matkhau: String,
  vaiTro: { type: String, enum: ['Trang', 'Cá nhân'] },
  avatar: String,
  trangThai: { type: String, enum: ['Khóa', 'Mở'], default: 'Mở' },
  ngayTao: { type: Date, default: Date.now },
  ngayCapNhat: { type: Date, default: Date.now },
  moTa: { type: String, default: '' }
});
export const User = mongoose.model('User', UserSchema);

// ───── Bài đăng ─────
const PostSchema = new mongoose.Schema({
  nguoiDang: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thoiGianDang: { type: Date, default: Date.now },
  thoiGianCapNhat: { type: Date, default: Date.now },
  danhMuc: String,
  tinhTrangVatDung: { type: String, enum: ['Mới', 'Cũ'] },
  diaChi: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  loaiGiaoDich: { type: String, enum: ['Bán', 'Cho'] },
  giaTien: Number,
  trangThaiBaiDang: { type: String, enum: ['Đã bán', 'Đã cho', 'Còn'], default: 'Còn' },
  soLuong: Number,
  moTa: String,
  hinhAnh: String
});
export const Post = mongoose.model('Post', PostSchema);

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
  noiDung: String,
  thoiGianGui: { type: Date, default: Date.now },
  trangThai: { type: String, enum: ['Đã đọc', 'Chưa đọc'], default: 'Chưa đọc' }
});
export const Message = mongoose.model('Message', MessageSchema);

console.log("✅ Cấu trúc schema đã được khai báo và kết nối MongoDB thành công.");
