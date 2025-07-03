import React, { useEffect, useState } from "react";
import "../style/Header.css";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchQuery);
  };

  const handleDangXuat = () => {
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    setUser(null);
    navigate("/");
  };

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <header className="header">
      <div className="logo-section">
        <i className="ri-store-2-line"></i>
        <span className="logo-text">RECAP</span>
      </div>

      <form onSubmit={handleSearch} className="search-section">
        <input
          type="text"
          placeholder="searching..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn-search">
          <i className="ri-search-2-line"></i>
        </button>
      </form>

      <div className="user-container">
        <button className="notification-button">
          <i className="ri-notification-line"></i>
        </button>

        <div className="profile">
          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="profile-button"
                aria-label="Menu người dùng"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  className="avatar-image"
                  alt="avatar"
                />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <ul className="dropdown-item">Hồ sơ</ul>
                  <ul onClick={handleDangXuat} className="dropdown-item">Đăng xuất</ul>
                </div>
              )}
            </>
          ) : (
            <button onClick={handleLoginRedirect} className="profile-button">
              <i class="ri-logout-circle-line"></i>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
