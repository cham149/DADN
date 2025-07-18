import React, { useEffect, useState } from "react";
import "../style/Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/search?query=${searchQuery}`);
      console.log("🔍 Kết quả tìm kiếm:", res.data);

      navigate("/", {
        state: {
          searchKeyword: searchQuery,
          searchPosts: res.data.posts,
          searchUsers: res.data.users,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi tìm kiếm:", err);
    }
  };

  const handleHoSo = () => {
    setIsDropdownOpen(false);
    if (user && user._id) {
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/profile"); // Fallback nếu không có user
    }
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
        <div className="logo-section" onClick={() => {
          navigate("/", {
            replace: true,
            state: {
              searchKeyword: null,
              searchPosts: [],
              searchUsers: [],
            },
          });
        }}>
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
                  <ul onClick={handleHoSo} className="dropdown-item">Hồ sơ</ul>
                  <ul onClick={handleDangXuat} className="dropdown-item">Đăng xuất</ul>
                </div>
              )}
            </>
          ) : (
            <button onClick={handleLoginRedirect} className="profile-button">
              <i className="ri-logout-circle-line"></i>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;