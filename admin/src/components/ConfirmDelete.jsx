import React from "react";
import "../style/Edit.css"; 

const ConfirmDelete = ({ type, itemName, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal">
        <h2>Xác nhận xóa {type === "admin" ? "Admin" : "Người dùng"}</h2>
        <p>Bạn có chắc chắn muốn xóa **{itemName}** không?</p>
        <div className="modal-actions">
          <button className="delete-button" onClick={onConfirm}>Xóa</button>
          <button className="cancel-button" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;