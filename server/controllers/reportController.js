import { Post, Report, User } from "../database/database.js";

// Báo cáo bài viết
export const reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { nguoiBaoCaoId, lyDo } = req.body;

    if (!nguoiBaoCaoId || !lyDo) {
      return res.status(400).json({ message: "Thiếu thông tin người báo cáo hoặc lý do." });
    }

    const existingReport = await Report.findOne({
      baiBiBaoCao: postId,
      nguoiBaoCao: nguoiBaoCaoId,
    });

    if (existingReport) {
      return res.status(400).json({ message: "Bạn đã báo cáo bài viết này rồi." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }

    const newReport = new Report({
      nguoiBaoCao: nguoiBaoCaoId,
      baiBiBaoCao: postId,
      nguoiBiBaoCao: post.nguoiDang,
      lyDo,
      trangThai: "Đang xử lý"
    });
    await newReport.save();

    post.soLuotBaoCao += 1;

    if (post.soLuotBaoCao >= 3) {
      post.trangThaiBaoCao = "Đang xử lý";
    }

    await post.save();

    res.status(201).json({ message: "Báo cáo bài viết thành công." });
  } catch (error) {
    console.error("Lỗi khi báo cáo bài viết:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};