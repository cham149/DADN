import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import "../style/Menu.css";

const Menu = ({ isOpen, setBannerText }) => {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ ten: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData) {
      setAdminInfo({ ten: adminData.ten || "", email: adminData.email || "" });
    }
  }, []);

  const toggleSubmenu = () => setOpenSubmenu(!openSubmenu);

  const handleClickNhanSu = () => toggleSubmenu();

  const handleAdminClick = () => {
    setBannerText("ADMIN");
    setOpenSubmenu(false);
  };

  const handleUserClick = () => {
    setBannerText("USER");
    setOpenSubmenu(false);
  };

  //hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("admin");   // xoá token/info admin
    navigate("/login");                 // điều hướng về trang login
  };

  return (
    <div className={`admin-container ${isOpen ? "open" : ""}`}>
      <div className='admin-infor'>
        <img
          src="https://i.pinimg.com/736x/20/ef/6b/20ef6b554ea249790281e6677abc4160.jpg"
          className='admin-img'
          alt="admin"
        />
        <div>
          <label className='admin-name'>{adminInfo.ten || "admin name"}</label><br/>
          <label className='admin-gmail'>{adminInfo.email || "admin@gmail.com"}</label>
        </div>
      </div>

      <div className='menu-list'>
        <ul>
          <li onClick={handleClickNhanSu}>Quản lý nhân sự</li>
          {openSubmenu && (
            <ul className="submenu">
              <li onClick={handleAdminClick}>Admin</li>
              <li onClick={handleUserClick}>Người dùng</li>
            </ul>
          )}
          <li onClick={() => setBannerText("QUẢN LÝ BÀI ĐĂNG")}>Quản lý bài đăng</li>
          <li onClick={() => setBannerText("QUẢN LÝ BÁO CÁO")}>Quản lý báo cáo</li>
          <li onClick={() => setBannerText("THỐNG KÊ")}>Thống kê</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
