import React, { useEffect, useState } from "react";
import "../style/Report.css";
import Reported from "./Reported";
import UserCard from "./UserCard";
import axios from "axios";

const Report = () => {
  const [users, setUsers] = useState([]);
  const [reporteds, setReporteds] = useState([]);

  // ───── Lấy danh sách user ─────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/locked-posts");
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
      }
    };
    fetchUsers();
  }, []);

  // ───── Lấy danh sách bài bị báo cáo ─────
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/reported-posts");
        setReporteds(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách reported:", error);
      }
    };
    fetchReports();
  }, []);

  // ───── Xử lý User ─────
  const handleLock = async (user) => {
    try {
      await axios.put(`http://localhost:5000/api/user/${user._id}/lock`);
      alert(`🔒 Tài khoản ${user.ten || user.email} đã bị khóa`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, trangThai: "Khóa" } : u))
      );
    } catch (error) {
      console.error("Lỗi khi khóa user:", error);
      alert("Khóa tài khoản thất bại");
    }
  };

  const handleUnlock = async (user) => {
    try {
      await axios.put(`http://localhost:5000/api/user/${user._id}/unlock`);
      alert(`✅ Tài khoản ${user.ten || user.email} đã được mở khóa`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, trangThai: "Mở" } : u))
      );
    } catch (error) {
      console.error("Lỗi khi mở khóa user:", error);
      alert("Mở khóa tài khoản thất bại");
    }
  };

  // ───── Xử lý Reported Post ─────
  const handleApprove = async (reportId) => {
    try {
      // Lấy thông tin admin từ localStorage
      const adminData = JSON.parse(localStorage.getItem("admin"));
      const currentAdminId = adminData?._id;
      if (!currentAdminId) {
        alert("Không tìm thấy thông tin admin");
        return;
      }

      // Gửi request duyệt report
      await axios.post(
        `http://localhost:5000/api/admin/reports/${reportId}/approve`,
        { adminId: currentAdminId }
      );

      alert("✅ Báo cáo đã được duyệt");

      // Cập nhật state để render lại UI
      setReporteds((prev) =>
        prev.map((r) => ({
          ...r,
          reports: r.reports.map((rep) =>
            rep._id.toString() === reportId.toString()
              ? { ...rep, trangThai: "Đã duyệt", adminXuLy: adminData }
              : rep
          ),
        }))
      );
    } catch (error) {
      console.error("Lỗi khi duyệt report:", error);
      alert("Duyệt report thất bại");
    }
  };

  const handleReject = async (reportId) => {
    try {
      // Lấy thông tin admin từ localStorage
      const adminData = JSON.parse(localStorage.getItem("admin"));
      const currentAdminId = adminData?._id;
      if (!currentAdminId) {
        alert("Không tìm thấy thông tin admin");
        return;
      }

      // Gửi request từ chối report
      await axios.post(
        `http://localhost:5000/api/admin/reports/${reportId}/reject`,
        { adminId: currentAdminId }
      );

      alert("❌ Báo cáo đã bị từ chối");

      // Cập nhật state để render lại UI
      setReporteds((prev) =>
        prev.map((r) => ({
          ...r,
          reports: r.reports.map((rep) =>
            rep._id.toString() === reportId.toString()
              ? { ...rep, trangThai: "Không duyệt", adminXuLy: adminData }
              : rep
          ),
        }))
      );
    } catch (error) {
      console.error("Lỗi khi từ chối report:", error);
      alert("Từ chối report thất bại");
    }
  };

  return (
    <div>
      {/* Danh sách chờ xử lý */}
      <div className="report-header">
        <label>Danh sách chờ</label>
      </div>
      <div className="report-body">
        {reporteds.some((r) =>
          r.reports.some((rep) => rep.trangThai === "Đang xử lý")
        ) ? (
          reporteds.flatMap((r) =>
            r.reports
              .filter((rep) => rep.trangThai === "Đang xử lý")
              .map((rep) => (
                <Reported
                  key={rep._id}
                  reportId={rep._id}
                  postId={r.postId}
                  chuBai={r.chuBai}
                  trangThaiBaoCao={rep.trangThai}
                  soLuotBaoCao={r.soLuotBaoCao}
                  report={rep}
                  hinhAnh={r.hinhAnh}
                  moTa={r.moTa}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
          )
        ) : (
          <p className="no-data">Không còn dữ liệu để duyệt</p>
        )}
      </div>

      {/* Danh sách đã duyệt */}
      <div className="report-header">
        <label>Danh sách đã duyệt</label>
      </div>
      <div className="report-body">
        {reporteds.some((r) =>
          r.reports.some(
            (rep) => rep.trangThai === "Đã duyệt" || rep.trangThai === "Không duyệt"
          )
        ) ? (
          reporteds.flatMap((r) =>
            r.reports
              .filter(
                (rep) =>
                  rep.trangThai === "Đã duyệt" || rep.trangThai === "Không duyệt"
              )
              .map((rep) => (
                <Reported
                  key={rep._id}
                  reportId={rep._id}
                  postId={r.postId}
                  chuBai={r.chuBai}
                  trangThaiBaoCao={rep.trangThai}
                  soLuotBaoCao={r.soLuotBaoCao}
                  report={rep}
                  hinhAnh={r.hinhAnh}
                  moTa={r.moTa}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
          )
        ) : (
          <p className="no-data">Không có dữ liệu</p>
        )}
      </div>

      {/* Danh sách User */}
      <div className="report-header">
        <label>Danh sách những tài khoản sẽ bị khóa / mở khóa</label>
      </div>
      <div className="report-body">
        {users.map((user) => (
          <UserCard
            key={user._id}
            type="reported"
            data={user}
            onLock={handleLock}
            onUnlock={handleUnlock}
          />
        ))}
      </div>
    </div>
  );
};

export default Report;
