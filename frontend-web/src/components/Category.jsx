import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        console.log("Categories trong React:", categories);

        console.log("Kết quả API:", res.data); 
        setCategories(res.data.categories);
        
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
        {Array.isArray(categories) ? (
          categories.map((cat) => (
            <li key={cat._id} className="category-item">
              {cat.tenDanhMuc} {/* ✅ Chỉ hiển thị chuỗi */}
            </li>
          ))
        ) : (
          <li>Không có danh mục nào.</li>
        )}
      </ul>
    </div>
  );
};

export default Category;
