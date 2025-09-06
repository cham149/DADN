import { Post, Report, User, Admin } from "../database/database.js";

// Lấy danh sách bài viết chờ duyệt
export const getPendingPosts = async (req, res) => {
  try {
    const pendingPosts = await Post.find({ trangThaiBaoCao: "Chờ duyệt" })
      .populate("nguoiDang", "ten avatar")
      .populate("danhMuc", "tenDanhMuc");
    res.json(pendingPosts);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết chờ duyệt:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin duyệt khóa bài viết
export const lockPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post || post.trangThaiBaoCao !== "Chờ duyệt") {
      return res.status(404).json({ message: "Bài viết không hợp lệ hoặc không ở trạng thái chờ duyệt." });
    }

    post.trangThaiBaoCao = "Đã khóa";
    await post.save();

    await Report.updateMany({ baiBiBaoCao: postId }, { trangThai: "Đã xử lý" });

    const user = await User.findById(post.nguoiDang);
    if (user) {
      user.soBaiVietBiKhoa += 1;

      if (user.soBaiVietBiKhoa >= 5) {
        user.trangThai = "Khóa";
      }
      await user.save();
    }

    res.json({ message: "Đã khóa bài viết và cập nhật người dùng thành công." });
  } catch (error) {
    console.error("Lỗi khi khóa bài viết:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin từ chối báo cáo
export const rejectReports = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    post.trangThaiBaoCao = "Bình thường";
    post.soLuotBaoCao = 0;
    await post.save();

    await Report.updateMany({ baiBiBaoCao: req.params.postId }, { trangThai: "Bị từ chối" });

    res.json({ message: "Đã từ chối các báo cáo cho bài viết này." });
  } catch (error) {
    console.error("Lỗi khi từ chối báo cáo:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
