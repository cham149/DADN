import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import ChatBox from '../components/ChatBox';
import axios from 'axios';
import "../style/Profile.css";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userID } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isOwnProfile = currentUser?._id === userID;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [danhMucList, setDanhMucList] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [error, setError] = useState(null);

  const [moTa, setMoTa] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [giaTien, setGiaTien] = useState("");
  const [tinhTrang, setTinhTrang] = useState("Mới");
  const [diaChiPost, setDiaChiPost] = useState("");
  const [trangThai, setTrangThaiBaiDang] = useState("Còn");
  const [transactionType, setTransactionType] = useState("Bán");
  const [chonDanhMuc, setChonDanhMuc] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAvatar, setEditedAvatar] = useState("");

  const diaChi = [
    "An Giang", "Bắc Ninh", "Cao Bằng", "Cà Mau", "Điện Biên", "Đắk Lắk",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hoà",
    "Lai Châu", "Lạng Sơn", "Lâm Đồng", "Lào Cai", "Nghệ An", "Ninh Bình",
    "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "TP. Cần Thơ",
    "TP. Đà Nẵng", "TP. Hà Nội", "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế",
    "Tây Ninh", "Thanh Hóa", "Thái Nguyên", "Tuyên Quang", "Vĩnh Long"
  ];

    // ▼▼▼ THÊM STATE MỚI ĐỂ QUẢN LÝ VIỆC SỬA BÀI ▼▼▼
  const [editingPost, setEditingPost] = useState(null); // null: tạo mới, object: đang sửa

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentUserID = userID;
        console.log("Fetching with userID from params:", userID);
        if (!currentUserID) {
          const localUser = JSON.parse(localStorage.getItem("user"));
          currentUserID = localUser?._id;
          console.log("Fetching with userID from localStorage:", currentUserID);
          if (!currentUserID) {
            setError("Không tìm thấy userID trong localStorage hoặc params");
            return;
          }
        }

        const axiosConfig = {
          timeout: 5000,
        };

        const [postRes, userRes, danhMucRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/mypost?userID=${currentUserID}`, axiosConfig),
          axios.get(`http://localhost:5000/api/user/${currentUserID}`, axiosConfig),
          axios.get("http://localhost:5000/api/categories", axiosConfig),
        ]);

        console.log("API Responses:", { postRes: postRes.data, userRes: userRes.data, danhMucRes: danhMucRes.data });
        setPosts(postRes.data || []);
        setUser(userRes.data || {});
        setEditedName(userRes.data.ten || "");
        setEditedAvatar(userRes.data.avatar || "");
        setEditedDescription(userRes.data.moTa || "");
        setDanhMucList(danhMucRes.data|| []);
      } catch (error) {
        console.error("Error in fetchData:", error.response?.data || error.message);
        setError(`Lỗi khi tải dữ liệu: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchData();
  }, [userID]);

  //SỬA/XÓA BÀI VIẾT
    const handlePostDeleted = (deletedPostId) => {
      // Cập nhật lại state 'posts' bằng cách lọc ra bài đăng vừa bị xóa
      setPosts(currentPosts => currentPosts.filter(post => post._id !== deletedPostId));
      alert("Đã xóa bài đăng khỏi giao diện."); // Thông báo cho người dùng
  };

  // HÀM BẮT ĐẦU CHẾ ĐỘ CHỈNH SỬA BÀI ĐĂNG (TRUYỀN VÀO PostCard)
  const handleStartEdit = (postToEdit) => {
      setEditingPost(postToEdit); // Lưu lại thông tin bài đăng đang được sửa

      // Điền thông tin cũ của bài viết vào các state của form
      setMoTa(postToEdit.moTa || "");
      setSoLuong(postToEdit.soLuong?.toString() || "");
      setGiaTien(postToEdit.giaTien?.toString() || "");
      setTinhTrang(postToEdit.tinhTrangVatDung || "Mới");
      setDiaChiPost(postToEdit.diaChi || "");
      setChonDanhMuc(postToEdit.danhMuc?._id || "");
      setTransactionType(postToEdit.loaiGiaoDich || "Bán");
      setTrangThaiBaiDang(postToEdit.trangThaiBaiDang || "Còn");
      
      // Cập nhật ảnh preview
      const imageUrl = postToEdit.hinhAnh?.startsWith("http") 
          ? postToEdit.hinhAnh 
          : `http://localhost:5000/uploads/${postToEdit.hinhAnh}`;
      setSelectedImagePreview(imageUrl);
      setSelectedImage(null); // Reset file ảnh mới, vì người dùng có thể không muốn đổi ảnh

      setShowUploadForm(true); // Hiển thị form chỉnh sửa
      window.scrollTo(0, 0); // Tự động cuộn lên đầu trang để người dùng thấy form
  };

    // ▼▼▼ HÀM MỚI: ĐÓNG VÀ RESET FORM ▼▼▼
  const resetAndCloseForm = () => {
    setShowUploadForm(false);
    setEditingPost(null);
    setMoTa("");
    setSoLuong("");
    setGiaTien("");
    setTinhTrang("Mới");
    setDiaChiPost("");
    setTrangThaiBaiDang("Còn");
    setTransactionType("Bán");
    setChonDanhMuc("");
    setSelectedImage(null);
    setSelectedImagePreview("");
  };

  // ▼▼▼ CẬP NHẬT: HÀM NÀY GIỜ XỬ LÝ CẢ TẠO MỚI VÀ CẬP NHẬT ▼▼▼
  const handleFormSubmit = async () => {
    if (!currentUser?._id) {
      alert("Vui lòng đăng nhập để thực hiện.");
      return;
    }

    const formData = new FormData();
    formData.append("moTa", moTa);
    formData.append("soLuong", soLuong);
    formData.append("giaTien", transactionType === 'Cho' ? 0 : giaTien);
    formData.append("tinhTrangVatDung", tinhTrang);
    formData.append("diaChi", diaChiPost);
    formData.append("danhMuc", chonDanhMuc);
    formData.append("loaiGiaoDich", transactionType);
    formData.append("trangThaiBaiDang", trangThai);
    formData.append("nguoiDang", currentUser._id);
    if (selectedImage) {
      formData.append("hinhAnh", selectedImage);
    }

    try {
      if (editingPost) {
        // --- CHẾ ĐỘ SỬA ---
        const res = await axios.put(`http://localhost:5000/api/posts/${editingPost._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(res.data.message);
      } else {
        // --- CHẾ ĐỘ TẠO MỚI ---
        const res = await axios.post("http://localhost:5000/api/post", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(res.data.message);
      }

      resetAndCloseForm();
      // Tải lại danh sách bài đăng để cập nhật giao diện
      const postRes = await axios.get(`http://localhost:5000/api/mypost?userID=${currentUser._id}`);
      setPosts(postRes.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Thao tác thất bại!");
      console.error("Lỗi khi gửi form:", err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 5000,
        });
        setEditedAvatar(res.data.url);
      } catch (err) {
        console.error("Lỗi upload avatar:", err);
        alert("Tải ảnh thất bại");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!user?._id) {
        alert("Không có ID người dùng");
        return;
      }

      const updatedUser = { ten: editedName, moTa: editedDescription, avatar: editedAvatar };
      const res = await axios.put(`http://localhost:5000/api/user/${user._id}`, updatedUser, { timeout: 5000 });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  //CHAT LIÊN HỆ NGƯỜI ĐĂNG (KHI VÀO TCN NGƯỜI KHÁC)
  const [chatData, setChatData] = useState(null); 
  // chatData = { conversationId, partner }

  const handleOpenChat = ({ conversationId, partner, post }) => {
    setChatData({ conversationId, partner, post });
  };

  const handleCloseChat = () => {
    setChatData(null);
  };

  return (
    <>
      <Header />
      <div className='body-profile'>
        {error ? (
          <p style={{ textAlign: "center", padding: "20px", color: "red" }}>{error}</p>
        ) : user ? (
          <>
            <div className='container-user-infor'>
              <div className='div-icon'>
                <i className="ri-music-ai-fill"></i>
                <i className="ri-heart-3-fill" style={{ color: "#F44336" }}></i>
                <i className="ri-close-circle-fill" style={{ color: "#13AF30", backgroundColor: '#fff', borderRadius: '100%' }}></i>
              </div>

              <div className='container-user-left'>
                <div className='container-avatar'>
                  <img
                    src={editedAvatar || "/default-avatar.png"}
                    alt="avatar"
                    onClick={() => isOwnProfile && isEditing && document.getElementById("avatarInput").click()}
                  /> {isOwnProfile && (
                  <input
                    type="file"
                    id="avatarInput"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />)}
                  {isEditing && isOwnProfile ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Tên người dùng"
                      style={{ marginTop: "10px" }}
                    />
                  ) : (
                    <h4 className='username'>{user.ten || "Chưa có tên"}</h4>
                  )}
                </div>

                <div className='container-user-right'>
                  <div className='container-infor'>
                    <h2 className='danhTinh'>{user.vaiTro || "Người dùng"}</h2>
                    {isEditing && isOwnProfile ? (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Mô tả về bạn"
                      />
                    ) : (
                      <p className='moTa'>{user.moTa || "Chưa có mô tả."}</p>
                    )}
                    {isOwnProfile && (
                    <div className='div-edit-infor'>
                      {!isEditing ? (
                        <i className="ri-quill-pen-ai-line" onClick={() => setIsEditing(true)} style={{ cursor: "pointer"}} />
                      ) : (
                        <i className="ri-check-line" onClick={handleSave} style={{ cursor: "pointer" }} />
                      )}
                    </div>)}
                  </div>

                  <div className='trangTri'>
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        width="35"
                        height="35"
                        src="https://img.icons8.com/ios-filled/50/pixel-heart.png"
                        alt="pixel-heart"
                        style={{ marginRight: '10px' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='container-user-body'>
              {isOwnProfile && (
              <div className='container-upload-post'>
                <img
                  className='avatar'
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                />
                <button
                  onClick={() => {
                    console.log("Toggle upload form, current state:", !showUploadForm);
                    setEditingPost(null); 
                    setShowUploadForm(true);
                  }}
                >
                  Bạn muốn đăng gì ?
                </button>
              </div>)}

              {isOwnProfile && showUploadForm && ( //FORM ĐĂNG/SỬA BÀI VIẾT
                <div className='container-upload-post-detail'>
                  <div className='container-upload-post-detail-left'>
                    <img
                      src={selectedImagePreview || user.avatar || "/default-avatar.png"}
                      alt="preview"
                    />
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <button
                      onClick={() => document.getElementById("imageInput").click()}
                    >
                      Chọn ảnh
                    </button>
                  </div>

                  <div className='container-upload-post-detail-right'>
                    <div style={{ display: "flex" }}>
                      <div id='div-left' style={{ flex: 1 }}>
                        <label>Địa chỉ</label>
                        <select
                          value={diaChiPost}
                          onChange={(e) => setDiaChiPost(e.target.value)}
                        >
                          <option value="">-- Chọn địa chỉ --</option>
                          {diaChi.map((tinh, index) => (
                            <option key={index} value={tinh}>{tinh}</option>
                          ))}
                        </select>
                      </div>
                      <div id='div-right'>
                        <label>Tình trạng</label>
                        <select
                          value={tinhTrang}
                          onChange={(e) => setTinhTrang(e.target.value)}
                        >
                          <option value="Mới">Mới</option>
                          <option value="Cũ">Cũ</option>
                        </select>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Mô tả"
                      value={moTa}
                      onChange={(e) => setMoTa(e.target.value)}
                    />

                    <div style={{ display: "flex"}}>
                      <div id='div-left'>
                        <label>Số lượng</label>
                        <input
                          type="text"
                          className="number-product"
                          value={soLuong}
                          onChange={(e) => setSoLuong(e.target.value)}
                        />
                      </div>
                      <div id='div-right'>
                        <label>Danh mục</label>
                        <select
                          value={chonDanhMuc}
                          onChange={(e) => setChonDanhMuc(e.target.value)}
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {danhMucList.length > 0 ? (
                            danhMucList.map((dm) => (
                              <option key={dm._id} value={dm._id}>{dm.tenDanhMuc}</option>
                            ))
                          ) : (
                            <option value="" disabled>Chưa có danh mục</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex" }}>
                      <div id='div-left'>
                        <label>Trạng thái bài đăng</label>
                        <select
                          value={trangThai}
                          onChange={(e) => setTrangThaiBaiDang(e.target.value)}
                        >
                          <option value="Còn">Còn</option>
                          <option value="Đã cho">Đã cho</option>
                          <option value="Đã bán">Đã bán</option>
                        </select>
                      </div>
                      <div id='div-right' style={{ flex: 1 }}>
                        <label>Loại giao dịch</label>
                        <select
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                        >
                          <option value="Bán">Bán</option>
                          <option value="Cho">Cho</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex"}}>
                      {transactionType === "Bán" && (
                        <div id='div-left'>
                          <label className="label-price">Số tiền</label>
                          <input
                            type="text"
                            className="price"
                            value={giaTien}
                            onChange={(e) => setGiaTien(e.target.value)}
                          />
                        </div>
                      )}
                      <div id='div-right' style={{justifyContent: "flex-end" }}>
                        <button onClick={handleFormSubmit}>
                            {editingPost ? 'Lưu thay đổi' : 'Đăng'}
                        </button>
                        <button onClick={resetAndCloseForm} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
                            Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='container-user-post'>
              <h2>Bài đã đăng</h2>
              <div className='container-post' style={{ display: 'flex', flexWrap: 'wrap', gap: '35px' }}>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      type="user"   
                      postId={post._id} 
                      trangThaiBaoCao={post.trangThaiBaoCao}
                      avatar={post.nguoiDang?.avatar || "/default-avatar.png"}
                      tenNguoiDung={post.nguoiDang?.ten || "Người dùng"}
                      thoiGianCapNhat={new Date(post.thoiGianCapNhat).toLocaleString()}
                      moTaSP={post.moTa || ""}
                      anhSP={post.hinhAnh?.startsWith("http") ? post.hinhAnh : `http://localhost:5000/uploads/${post.hinhAnh}`}
                      diaChi={post.diaChi || ""}
                      danhMuc={post.danhMuc?.tenDanhMuc || ""}
                      tinhTrangVatDung={post.tinhTrangVatDung || "Mới"}
                      trangThaiBaiDang={post.trangThaiBaiDang || "Còn"}
                      loaiGiaoDich={post.loaiGiaoDich || "Bán"}
                      soLuong={post.soLuong || 1}
                      soTien={post.loaiGiaoDich === "Cho" ? "Miễn phí" : post.giaTien?.toLocaleString("vi-VN") + "₫" || ""}
                      isProfilePage={true}
                      user={currentUser}              // truyền user hiện tại
                      nguoiDang={post.nguoiDang}      // truyền người đăng
                      onOpenChat={handleOpenChat}     // callback mở chat
                      //Các props quan trọng cho việc Sửa/Xóa
                      postObject={post}
                      onPostDeleted={handlePostDeleted}
                      onStartEdit={handleStartEdit}

                    />
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>Chưa có bài đăng nào</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>Đang tải thông tin người dùng...</p>
        )} 

        {/* CHATBOX HIỆN CUỐI CÙNG */}
        {chatData && (
          <ChatBox
            conversationId={chatData.conversationId}
            userId={currentUser._id}
            partner={chatData.partner}
            post={chatData.post}
            onClose={handleCloseChat}
          />
        )}

      </div>

    </>
  );
};

export default Profile;