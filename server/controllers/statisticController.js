import { User, Post, Report } from "../database/database.js";

// /api/statistics?month=9&year=2025
export const getStatistics = async (req, res) => {
  try {
    const { month, year } = req.query;

    // 1. Người dùng theo trạng thái
    const userStats = await User.aggregate([
      { $group: { _id: "$trangThai", count: { $sum: 1 } } }
    ]);

    // 2. Bài đăng theo danh mục
    const postByCategory = await Post.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "danhMuc",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      { $group: { _id: "$category.tenDanhMuc", count: { $sum: 1 } } }
    ]);

    // 3. Bài đăng theo trạng thái
    const postByStatus = await Post.aggregate([
      { $group: { _id: "$trangThaiBaiDang", count: { $sum: 1 } } }
    ]);

    // 4. Báo cáo theo lý do
    const reportByReason = await Report.aggregate([
      { $group: { _id: "$lyDo", count: { $sum: 1 } } }
    ]);

    // 5. 🔝 Top 10 bài bị báo cáo nhiều nhất theo tháng/năm
    let filter = {};
    if (month && year) {
      filter = {
        thoiGianBaoCao: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1)
        }
      };
    }

    const topReportedPosts = await Report.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$baiBiBaoCao",
          soLanBaoCao: { $sum: 1 }
        }
      },
      { $sort: { soLanBaoCao: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post"
        }
      },
      { $unwind: "$post" },
      {
        $project: {
          postId: "$post._id",
          tieuDe: "$post.moTa",   // hoặc đổi thành post.tieuDe nếu bạn thêm field này
          hinhAnh: "$post.hinhAnh",
          soLanBaoCao: 1,
          thoiGianDang: "$post.thoiGianDang"
        }
      }
    ]);

    // 6. Tỷ lệ báo cáo đã xử lý
    const totalReports = await Report.countDocuments();
    const processedReports = await Report.countDocuments({
      trangThai: { $ne: "Đang xử lý" }
    });
    const reportHandledRate =
      totalReports > 0 ? (processedReports / totalReports) * 100 : 0;

    res.status(200).json({
      userStats,
      postByCategory,
      postByStatus,
      reportByReason,
      topReportedPosts,   // ✅ gửi cho frontend
      reportHandledRate
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy thống kê:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
