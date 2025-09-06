import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Post.css";

const Post = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
const [newCategory, setNewCategory] = useState({ tenDanhMuc: "", moTa: "" });

const handleInputChange = (e) => {
  setNewCategory({ ...newCategory, tenDanhMuc: e.target.value });
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  // Mở modal thêm danh mục
  const handleOpenModal = () => {
    setNewCategory({ tenDanhMuc: "", moTa: "" });
    setShowModal(true);
  };

  // Thêm danh mục mới
    const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.tenDanhMuc.trim()) return alert("Tên danh mục không được để trống");

    try {
        await axios.post("http://localhost:5000/api/categories", { tenDanhMuc: newCategory.tenDanhMuc });
        setShowModal(false);
        setNewCategory({ tenDanhMuc: "" }); // reset input
        fetchCategories(); // reload danh sách
    } catch (err) {
console.error("Lỗi thêm danh mục chi tiết:", JSON.stringify(err.response?.data, null, 2) || err);

        if (err.response?.data?.details) {
        alert("Lỗi:\n" + err.response.data.details.join("\n"));
        } else if (err.response?.data?.message) {
        alert("Lỗi: " + err.response.data.message);
        } else {
        alert("Lỗi thêm danh mục");
        }
    }
    };

  // Xóa danh mục khi click phải
  const handleRightClick = async (e, category) => {
    e.preventDefault();
    const confirmDelete = window.confirm(`Bạn có muốn xóa danh mục "${category.tenDanhMuc}" không?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${category._id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xóa danh mục");
    }
  };

  return (
    <div>
      <div className="post-header">
        <label>Danh mục</label>
        <button className="post-header-button" onClick={handleOpenModal}>Thêm danh mục</button>
      </div>

      <div className="post-body">
        {categories.map((cat) => (
          <label
            key={cat._id}
            className="category-list"
            onContextMenu={(e) => handleRightClick(e, cat)}
          >
            {cat.tenDanhMuc}
          </label>
        ))}
      </div>

      {/* Modal thêm danh mục */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thêm danh mục mới</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Tên danh mục:</label>
                <input
                    type="text"
                    value={newCategory.tenDanhMuc}
                    onChange={handleInputChange}
                    placeholder="Nhập tên danh mục"
                />
              </div>
              <div className="form-group">
                <label>Mô tả (tùy chọn):</label>
                <textarea
                  value={newCategory.moTa}
                  onChange={(e) => setNewCategory({ ...newCategory, moTa: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">Thêm</button>
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="post-header">
        <label>Loại giao dịch</label>
        <button className="post-header-button">Thêm loại giao dịch</button>
      </div>
      <div className="post-body">
        <label className="type-of-transaction">Bán</label>
        <label className="type-of-transaction">Cho</label>
      </div>
    </div>
  );
};

export default Post;
