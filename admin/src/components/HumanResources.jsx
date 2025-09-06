import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import "../style/HumanResources.css";

import EditUser from "./EditUserAdmin";
import ConfirmDelete from "./ConfirmDelete"; 
import AddUserAdmin from "./AddUserAdmin"; 

const HumanResources = ({ type = "user" }) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Lưu trữ item đang được chọn để sửa/xóa
  const [showAddModal, setShowAddModal] = useState(false);

  // Gọi API lấy danh sách user hoặc admin
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = type === "admin"
          ? "http://localhost:5000/api/admin/list"
          : "http://localhost:5000/api/user/list";

        const res = await axios.get(url);
        setList(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách:", error);
      }
    };

    fetchData();
  }, [type]);

  const fetchData = async () => {
    try {
      const url =
        type === "admin"
          ? "http://localhost:5000/api/admin/list"
          : "http://localhost:5000/api/user/list";

      const res = await axios.get(url);
      setList(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách:", error);
    }
  };

  // Lọc theo ô tìm kiếm
  const filteredList = list.filter((item) =>
    item.ten?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Hàm xử lý khi nhấn nút Thêm ---
  const handleAdd = async (data) => {
    try {
      const url = type === "admin"
        ? "http://localhost:5000/api/admin"
        : "http://localhost:5000/api/user";

      await axios.post(url, data);
      alert(`${type === "admin" ? "Admin" : "Người dùng"} đã được thêm thành công!`);
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      alert(`Thêm ${type === "admin" ? "admin" : "người dùng"} thất bại: ${error.response?.data?.message || error.message}`);
    }
  };

  // --- Hàm xử lý khi nhấn nút Sửa ---
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  // --- Hàm xử lý khi nhấn nút Xóa ---
  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // --- Hàm xử lý khi xác nhận sửa (từ Modal) ---
  const handleConfirmEdit = async (updatedData) => {
    try {
      const url =
        type === "admin"
          ? `http://localhost:5000/api/admin/${selectedItem._id}`
          : `http://localhost:5000/api/user/${selectedItem._id}`;

      await axios.put(url, updatedData);
      alert(`${type === "admin" ? "Admin" : "Người dùng"} đã được cập nhật thành công!`);
      setShowEditModal(false);
      setSelectedItem(null);
      fetchData(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert(`Cập nhật ${type === "admin" ? "admin" : "người dùng"} thất bại: ` + (error.response?.data?.message || error.message));
    }
  };

  // --- Hàm xử lý khi xác nhận xóa (từ Modal) ---
  const handleConfirmDelete = async () => {
    try {
      const url =
        type === "admin"
          ? `http://localhost:5000/api/admin/${selectedItem._id}`
          : `http://localhost:5000/api/user/${selectedItem._id}`;

      await axios.delete(url);
      alert(`${type === "admin" ? "Admin" : "Người dùng"} đã được xóa thành công!`);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchData(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert(`Xóa ${type === "admin" ? "admin" : "người dùng"} thất bại: ` + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="human-header">
        <label>
          {type === "admin" ? "Danh sách admin" : "Danh sách nhân sự"}
        </label>

        <form
          className="human-header-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder={`Tìm kiếm ${type === "admin" ? "admin" : "người dùng"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {type === "user" && (
          <button className="human-header-button" onClick={() => setShowAddModal(true)}>Thêm người dùng</button>
        )}
        {type === "admin" && (
          <button className="human-header-button" onClick={() => setShowAddModal(true)}>Thêm admin</button>
        )}
      </div>

      <div className="human-body">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <UserCard
              key={item._id}
              type={type}
              data={item}
              onEdit={handleEdit} // Truyền handleEdit xuống UserCard
              onDelete={handleDelete} // Truyền handleDelete xuống UserCard
            />
          ))
        ) : (
          <p>Không tìm thấy {type === "admin" ? "admin" : "người dùng"} nào.</p>
        )}
      </div>

      {showAddModal && (
        <AddUserAdmin
          type={type}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* Modal Sửa */}
      {showEditModal && selectedItem && (
        <EditUser
          type={type}
          itemData={selectedItem}
          onClose={() => { setShowEditModal(false); setSelectedItem(null); }}
          onSave={handleConfirmEdit}
        />
      )}

      {/* Modal Xóa */}
      {showDeleteModal && selectedItem && (
        <ConfirmDelete
          type={type}
          itemName={selectedItem.ten || selectedItem.email} // Hiển thị tên hoặc email để xác nhận
          onClose={() => { setShowDeleteModal(false); setSelectedItem(null); }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default HumanResources;