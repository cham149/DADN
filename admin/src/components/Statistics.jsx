import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, XAxis, YAxis
} from "recharts";
import "../style/Statistics.css";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/statistics?month=${month}&year=${year}`
      );
      setStats(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [month, year]);

  if (loading) return <p>⏳ Đang tải thống kê...</p>;
  if (!stats) return <p>⚠️ Không có dữ liệu thống kê</p>;

  return (
    <div className="statistics-container">
      <div className="chart-grid">
        {/* 1. Người dùng theo trạng thái */}
        <div className="chart-box">
          <h3>👥 Người dùng theo trạng thái</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.userStats.map(u => ({ name: u._id, value: u.count }))}
                cx="50%" cy="50%" outerRadius={80} label dataKey="value"
              >
                {stats.userStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Bài đăng theo danh mục */}
        <div className="chart-box">
          <h3>📝 Bài đăng theo danh mục</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.postByCategory.map(p => ({ name: p._id, value: p.count }))}
                cx="50%" cy="50%" outerRadius={80} label dataKey="value"
              >
                {stats.postByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Bài đăng theo trạng thái */}
        <div className="chart-box">
          <h3>📌 Bài đăng theo trạng thái</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.postByStatus.map(p => ({ name: p._id, value: p.count }))}
                cx="50%" cy="50%" outerRadius={80} label dataKey="value"
              >
                {stats.postByStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Báo cáo theo lý do */}
        <div className="chart-box">
          <h3>🚨 Báo cáo theo lý do</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.reportByReason.map(r => ({ name: r._id, value: r.count }))}
                cx="50%" cy="50%" outerRadius={80} label dataKey="value"
              >
                {stats.reportByReason.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div> <br />

      {/* Bộ lọc tháng/năm */}
      <div className="filter-box">
        <label>Chọn tháng: </label>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <label style={{ marginLeft: "10px" }}>Chọn năm: </label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* 🔝 Top 10 bài đăng bị báo cáo nhiều nhất */}
      <div className="chart-box">
        <h3>🔝 Top 10 bài đăng bị báo cáo nhiều nhất</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={stats.topReportedPosts.map(post => ({
              name: post.tieuDe || "(Không có tiêu đề)",
              count: post.soLanBaoCao
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
            <Legend />
            <Bar dataKey="count" fill="#FF9F40" />
          </BarChart>
        </ResponsiveContainer>
      </div> <br />

      {/* 7. Tỷ lệ báo cáo đã xử lý */}
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <h4>Tỷ lệ báo cáo đã xử lý</h4>
          <p>{stats.reportHandledRate.toFixed(2)}%</p>
          <big>{stats.reportHandledRate >= 80 ? "✅ Tốt" : "⚠️ Cần cải thiện"}</big>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
