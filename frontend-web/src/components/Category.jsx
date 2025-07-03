import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data.danhMuc || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category_infor">
      <h3 className="category-title">Danh mục</h3>
      <ul className="category-list">
        {categories.map((cat, index) => (
          <li key={index} className="category-item">
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
