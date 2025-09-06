import React, { useState, useEffect } from "react";
import "../style/Edit.css";

const EditUser = ({ type, itemData, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Khởi tạo formData với dữ liệu hiện có khi modal mở
    setFormData(itemData);
  }, [itemData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Gọi hàm onSave được truyền từ HumanResources
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{type === "admin" ? "Sửa thông tin Admin" : "Sửa thông tin Người dùng"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên:</label>
            <input
              type="text"
              name="ten"
              value={formData.ten || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="text"
              name="matkhau"
              value={formData.matkhau || ""}
              onChange={handleChange}
              required
            />
          </div>

          {type === "user" && (
            <>
              <div className="form-group">
                <label>Vai trò:</label>
                <select name="vaiTro" value={formData.vaiTro || "user"} onChange={handleChange}>
                  <option value="caNhan">Cá nhân</option>
                  <option value="trang">Trang</option>
                </select>
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
                <select name="trangThai" value={formData.trangThai || "Hoạt động"} onChange={handleChange}>
                  <option value="Mở">Mở</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số bài viết bị khóa:</label>
                <input
                  type="number"
                  name="soBaiVietBiKhoa"
                  value={formData.soBaiVietBiKhoa || 0}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="save-button">Lưu</button>
            <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;