import React, { useState } from "react";
import "../style/Edit.css";

const AddUser = ({ type, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    ten: "",
    email: "",
    matkhau: "",
    avatar: "",
    moTa: "",
    vaiTro: "Cá nhân",
    trangThai: "Mở",
    soBaiVietBiKhoa: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{type === "admin" ? "Thêm Admin" : "Thêm Người dùng"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên:</label>
            <input type="text" name="ten" value={formData.ten} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input type="password" name="matkhau" value={formData.matkhau} onChange={handleChange} required />
          </div>

          {type === "user" && (
            <>
              <div className="form-group">
                <label>Vai trò:</label>
                <select name="vaiTro" value={formData.vaiTro} onChange={handleChange}>
                  <option value="Cá nhân">Cá nhân</option>
                  <option value="Trang">Trang</option>
                </select>
              </div>
              <div className="form-group">
                <label>Avatar URL:</label>
                <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
                <select name="trangThai" value={formData.trangThai} onChange={handleChange}>
                  <option value="Mở">Mở</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số bài viết bị khóa:</label>
                <input type="number" name="soBaiVietBiKhoa" value={formData.soBaiVietBiKhoa} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="save-button">Thêm</button>
            <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
