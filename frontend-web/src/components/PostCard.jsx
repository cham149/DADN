import React, { useState, useRef, useEffect } from "react";
import "../style/PostCard.css"; 
import OptionMenu from "./OptionMenu";
import axios from "axios";

const PostCard = ({
  type = "user",
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
  onOpenChat,
  postId,
  trangThaiBaoCao,
  soLuotBaoCao, 
  onPostDeleted,
  onStartEdit,
  // Lấy toàn bộ object post để truyền đi khi sửa
  postObject 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const handleContact = async () => {
    if (!user || !nguoiDang || user._id === nguoiDang._id) {
      alert("⛔ Không thể liên hệ (user không tồn tại hoặc là người đăng)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/conversations/find-or-create", {
        user1Id: user._id,
        user2Id: nguoiDang._id
      });

      const conversationId = res.data.conversationId;

      onOpenChat({
        conversationId,
        partner: nguoiDang,
        post: {
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
          nguoiDang,
        }
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
    // Gọi hàm từ component cha, truyền toàn bộ dữ liệu bài viết lên
    onStartEdit(postObject); 
  };

  // ▼▼▼ SỬA LẠI HÀM NÀY ▼▼▼
  const handleDelete = async () => {
    // Thêm bước xác nhận để an toàn
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      return;
    }

    try {
      // Gọi API xóa từ backend
      const res = await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        // Gửi kèm userId trong body để backend xác thực quyền
        data: { userId: user._id } 
      });

      alert(res.data.message);
      // Gọi hàm từ component cha để xóa bài viết khỏi giao diện
      onPostDeleted(postId);

    } catch (error) {
      alert(error.response?.data?.message || "Xóa bài đăng thất bại.");
    }
  };

  const handleReport = async (reason) => {
    if (!user) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này.");
      return;
    }
    if (!postId) {
      alert("Lỗi: Không tìm thấy ID bài viết.");
      return;
    }
    if (user._id === nguoiDang._id) {
      alert("⛔ Bạn không thể báo cáo bài viết của chính mình.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/report`, {
        nguoiBaoCaoId: user._id,
        lyDo: reason,
      });
      alert(res.data.message); // Hiển thị thông báo từ server
      setShowMenu(false); // Ẩn menu sau khi báo cáo
    } catch (error) {
      // Hiển thị lỗi từ server nếu có (ví dụ: "Bạn đã báo cáo bài này rồi")
      alert(error.response?.data?.message || "Gửi báo cáo thất bại.");
    }
  };

  // --- QUY TẮC 4: Bài viết bị làm mờ xám trên trang cá nhân của chủ bài ---
  const isOwner = user?._id === nguoiDang?._id;
  const isPendingAndOwnerViewing = trangThaiBaoCao === 'Đã khóa' && isProfilePage && isOwner;
console.log("user._id:", user?._id);
console.log("nguoiDang._id:", nguoiDang?._id);
console.log("isOwner:", isOwner);
console.log("id" , postId);

console.log("trangThaiBaoCao:", trangThaiBaoCao);
console.log("isPendingAndOwnerViewing:", trangThaiBaoCao === 'Đã khóa' && isProfilePage && isOwner);

  return (
    <div className={`post-card ${isPendingAndOwnerViewing ? 'pending-review' : ''}`}>
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
            {type === "admin" && (
              <div className="admin-extra">
                <div><b>Số lượt báo cáo:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{soLuotBaoCao}</label></div>
              </div>
            )}
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
            {type === "admin" && (
              <div className="admin-extra">
                <div><b>Trạng thái báo cáo:</b><label style={{ color: 'red', fontWeight: 'bold' }}>{trangThaiBaoCao}</label></div>
              </div>
            )}

          </div>
        </div>
      </div>

      {type === "user" && (
        <button className="contact-button" onClick={handleContact}>
          Liên hệ người đăng
        </button>
      )}

    </div>
  );
};

export default PostCard;
 