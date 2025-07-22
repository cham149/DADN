import React, { useState, useRef, useEffect } from "react";
import "../style/PostCard.css"; 
import OptionMenu from "./OptionMenu";
import axios from "axios";

const PostCard = ({
  avatar,
  tenNguoiDung,
  thoiGianCapNhat,
  moTaSP,
  anhSP,
  diaChi,
  danhMuc,
  tinhTrangVatDung,
  trangThaiBaiDang,
  loaiGiaoDich,
  soLuong,
  soTien,
  isProfilePage,
  user,
  nguoiDang,
  onOpenChat
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const handleContact = async () => {
    console.log("🔍 user:", user);
    console.log("🔍 nguoiDang:", nguoiDang);

    if (!user || !nguoiDang || user._id === nguoiDang._id) {
      console.log("⛔ Không thể liên hệ (user không tồn tại hoặc là người đăng)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/conversations/find-or-create", {
        user1Id: user._id,
        user2Id: nguoiDang._id
      });

      console.log("✅ Tạo hoặc tìm conversation:", res.data);

      const conversationId = res.data.conversationId;
      onOpenChat({
        conversationId,
        partner: nguoiDang
      });
    } catch (err) {
      console.error("❌ Lỗi khi liên hệ:", err);
      alert("Không thể liên hệ người đăng lúc này");
    }
  };

  // Click ngoài thì ẩn menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    alert("Sửa bài đăng!");
  };

  const handleDelete = () => {
    alert("Xóa bài đăng!");
  };

  const handleReport = (reason) => {
    alert(`Đã gửi báo cáo với lý do: ${reason}`);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={avatar} className="avatar" />
        <div style={{ flex: "3" }}>
          <div className="username">{tenNguoiDung}</div>
          <div className="time">{thoiGianCapNhat}</div>
        </div>
        
        <div className="menu-wrapper" style={{ position: "relative" }}>
            <i
              className="ri-more-fill"
              onClick={() => setShowMenu(!showMenu)}
              style={{ cursor: "pointer" }}
            ></i>

            {showMenu && (
              <div ref={menuRef}>
                <OptionMenu
                  isProfilePage={isProfilePage}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReport={handleReport}
                />
              </div>
            )}
        </div>
      </div>

      <img src={anhSP} alt="post" className="post-image" />

      <div className="post-content">
        <div><b>Mô tả:</b><label>{moTaSP}</label></div>
        <div><b>Địa chỉ:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{diaChi}</label></div>

        <div className="post-container-mini-content">
          <div className="info-mini">
            <div><b>Danh mục:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{danhMuc}</label></div>
            <div><b>Tình trạng:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{tinhTrangVatDung}</label></div>
            <div><b>Trạng thái:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{trangThaiBaiDang}</label></div>
          </div>
          <div className="info-mini">
            <div><b>Giao dịch:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{loaiGiaoDich}</label></div>
            {loaiGiaoDich === "Bán" ? (
              <>
                <div><b>Số lượng:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{soLuong}</label></div>
                <div><b>Số tiền:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{soTien}</label></div>
              </>
            ) : (
              <div><i>Cho ai có nhu cầu</i></div>
            )}
          </div>
        </div>
      </div>

      <button className="contact-button" onClick={handleContact}>liên hệ người đăng</button>

    </div>
  );
};

export default PostCard;
 