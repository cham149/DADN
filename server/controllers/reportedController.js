import { Post, Report, User, Admin } from "../database/database.js";

//lấy danh sách bài post đang xử lý
export const getReportedPosts = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("nguoiBaoCao", "ten avatar")
      .populate("nguoiBiBaoCao", "ten avatar")
      .populate("baiBiBaoCao", "_id moTa hinhAnh soLuotBaoCao trangThaiBaoCao")
      .populate("adminXuLy", "ten email")
      .lean();

    // Gom báo cáo theo bài
    const grouped = {};
    reports.forEach(r => {
      const postId = r.baiBiBaoCao?._id?.toString();
      if (!postId) return;

      if (!grouped[postId]) {
        grouped[postId] = {
          postId,
          chuBai: r.nguoiBiBaoCao,
          moTa: r.baiBiBaoCao?.moTa,
          hinhAnh: r.baiBiBaoCao?.hinhAnh,
          soLuotBaoCao: r.baiBiBaoCao?.soLuotBaoCao || 0,
          trangThaiBaoCao: r.baiBiBaoCao?.trangThaiBaoCao ,
          reports: [] // <== mảng thay vì 1 object
        };
      }

      grouped[postId].reports.push({
        lyDo: r.lyDo,
        _id: r._id,  
        thoiGianBaoCao: r.thoiGianBaoCao,
        nguoiBaoCao: r.nguoiBaoCao,
        trangThai: r.trangThai
      });
    });

    res.status(200).json(Object.values(grouped));
    // console.log("Bài bị báo cáo:", Object.values(grouped)); 
  } catch (error) {
    console.error("Lỗi khi lấy danh sách báo cáo:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin duyệt bài viết
export const approveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminId } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Không tìm thấy report" });

    if (report.trangThai !== "Đang xử lý") {
      return res.status(400).json({ message: "Report này đã được xử lý" });
    }

    report.trangThai = "Đã duyệt";
    report.adminXuLy = adminId;
    await report.save();

    // Cập nhật số lần duyệt của bài viết
    const approvedCount = await Report.countDocuments({
      baiBiBaoCao: report.baiBiBaoCao,
      trangThai: "Đã duyệt"
    });

    const post = await Post.findById(report.baiBiBaoCao);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    post.soLuotBaoCao = await Report.countDocuments({
      baiBiBaoCao: report.baiBiBaoCao,
      trangThai: "Đang xử lý"
    });

    // Quyết định trạng thái bài viết dựa trên số lần duyệt
    post.trangThaiBaoCao = approvedCount >= 3 ? "Đã khóa" : "Đã xử lý";

    await post.save();

    res.json({ message: "Report đã được duyệt", approvedCount, pendingReports: post.soLuotBaoCao });
  } catch (error) {
    console.error("Lỗi khi duyệt report:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin từ chối báo cáo
export const rejectReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminId } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Không tìm thấy report" });

    if (report.trangThai !== "Đang xử lý") {
      return res.status(400).json({ message: "Report này đã được xử lý" });
    }

    report.trangThai = "Không duyệt";
    report.adminXuLy = adminId;
    await report.save();

    // Cập nhật số lần từ chối của bài viết
    const rejectedCount = await Report.countDocuments({
      baiBiBaoCao: report.baiBiBaoCao,
      trangThai: "Không duyệt"
    });

    const post = await Post.findById(report.baiBiBaoCao);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    post.soLuotBaoCao = await Report.countDocuments({
      baiBiBaoCao: report.baiBiBaoCao,
      trangThai: "Đang xử lý"
    });

    // Quyết định trạng thái bài viết dựa trên số lần từ chối
    post.trangThaiBaoCao = rejectedCount >= 3 ? "Từ chối khóa" : "Bị từ chối";

    await post.save();

    res.json({ message: "Report đã bị từ chối", rejectedCount, pendingReports: post.soLuotBaoCao });
  } catch (error) {
    console.error("Lỗi khi từ chối report:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// ───── Khóa tài khoản người dùng ─────
export const lockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.trangThai = "Khóa";
    await user.save();

    res.json({ message: "Khóa tài khoản thành công", user });
  } catch (error) {
    console.error("Lỗi khi khóa tài khoản:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ───── Mở khóa tài khoản người dùng ─────
export const unlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.trangThai = "Mở";
    await user.save();

    res.json({ message: "Mở khóa tài khoản thành công", user });
  } catch (error) {
    console.error("Lỗi khi mở khóa tài khoản:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ───── Lấy danh sách user có bài viết bị khóa ─────
export const getUsersWithLockedPosts = async (req, res) => {
  try {
    const users = await User.find({ soBaiVietBiKhoa: { $gte: 1 } })
    res.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user có bài viết bị khóa:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
