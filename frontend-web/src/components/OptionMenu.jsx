import React, { useState } from "react";
import "../style/OptionMenu.css";

const OptionMenu = ({ isProfilePage, onEdit, onDelete, onReport }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const handleReportSubmit = () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do báo cáo!");
      return;
    }
    onReport(selectedReason); // truyền lý do lên parent
    setShowReportForm(false); // ẩn form sau khi gửi
    setSelectedReason(""); // reset
  };

  return (
    <div className="post-options-menu">
      {isProfilePage ? (
        <>
          <div onClick={onEdit}>✏️ Sửa bài đăng</div>
          <div onClick={onDelete}>🗑️ Xóa bài đăng</div>
        </>
      ) : showReportForm ? (
        <div className="report-form">
          <label>Chọn lý do báo cáo:</label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            <option value="">-- Chọn lý do --</option>
            <option value="Nội dung không phù hợp">Nội dung không phù hợp</option>
            <option value="Spam / Quảng cáo">Spam / Quảng cáo</option>
            <option value="Lừa đảo">Lừa đảo</option>
            <option value="Xả rác">Xả rác</option>
            <option value="Khác">Khác</option>
          </select>
          <button onClick={handleReportSubmit}>Gửi báo cáo</button>
        </div>
      ) : (
        <div onClick={() => setShowReportForm(true)}>🚩 Báo cáo bài đăng</div>
      )}
    </div>
  );
};

export default OptionMenu;
