import React, { useState } from 'react';
import Header from '../components/Header';
import "../style/Profile.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showUploadForm, setShowUploadForm] = useState(false); //state ẩn hiện div đăng bài
  const [transactionType, setTransactionType] = useState("ban"); //state ẩn hiện số tiền 

  return (
    <>
      <Header /><br />
      <div className='body-profile'>

        {/* Thông tin user */}
        <div className='container-user-infor'>
          <div className='div-icon'>
            <i className="ri-music-ai-fill"></i>
            <i className="ri-heart-3-fill" style={{ color: "#F44336" }}></i>
            <i className="ri-close-circle-fill" style={{ color: "#13AF30", backgroundColor: '#fff', borderRadius: '100%' }}></i>
          </div>

          <div className='container-user-left'>
            <div className='container-avatar'>
              <img src={user?.avatar} alt="avatar" />
              <h4 className='username'>{user?.ten}</h4>
            </div>

            <div className='container-user-right'>
              <div className='container-infor'>
                <h2 className='danhTinh'>{user?.vaiTro}</h2>
                <p className='moTa'>{user?.moTa || "Chưa có mô tả."}</p>
                <div className='div-edit-infor'>
                  <i className="ri-quill-pen-ai-line"></i>
                  <i className="ri-check-line"></i>
                </div>
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

        {/* Đăng bài mới */}
        <div className='container-user-body'>
          
          {/* ////////div đăng bài */}
          <div className='container-upload-post'>
            <img className='avatar' src={user?.avatar || "/default-avatar.png"} alt="avatar" />
            <button onClick={() => setShowUploadForm(!showUploadForm)}>Bạn muốn đăng gì ?</button>
          </div>

          {/* Ẩn / hiện div form đăng bài */}
          {showUploadForm && (
            <div className='container-upload-post-detail'>
              <div className='container-upload-post-detail-left'>
                <img src={user?.avatar || "/default-avatar.png"} alt="preview" />
                <button>Chọn ảnh</button>
              </div>

              <div className='container-upload-post-detail-right'>
                <div style={{ display: 'flex' }}>
                  <div id='div-left'>
                    <label>Địa chỉ</label>
                    <select>
                      <option value="1">Lựa chọn 1</option>
                      <option value="2">Lựa chọn 2</option>
                      <option value="3">Lựa chọn 3</option>
                    </select>
                  </div>
                  <div id='div-right'>
                    <label>Tình trạng</label>
                    <select>
                      <option value="moi">Mới</option>
                      <option value="cu">Cũ</option>
                    </select>
                  </div>
                </div>

                <input type="text" placeholder='Mô tả' />

                <div style={{ display: 'flex' }}>
                  <div id='div-left'>
                    <label>Số lượng</label>
                    <input type="text" className='number-product' />
                  </div>
                  <div id='div-right'>
                    <label>Danh mục</label>
                    <select>
                      <option value="1">Lựa chọn 1</option>
                      <option value="2">Lựa chọn 2</option>
                      <option value="3">Lựa chọn 3</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex' }}>
                  <div id='div-left'>
                    <label>Trạng thái bài đăng</label>
                    <select>
                      <option value="1">Còn</option>
                      <option value="2">Đã cho</option>
                      <option value="3">Đã bán</option>
                    </select>
                  </div>
                  <div id='div-right'>
                    <label>Loại giao dịch</label>
                    <select   value={transactionType}  onChange={(e) => setTransactionType(e.target.value)}>
                      <option value="ban">Bán</option>
                      <option value="cho">Cho</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex' }}>
                  {transactionType === "ban" && (<div id='div-left'>
                    <label className='label-price'>Số tiền</label>
                    <input type="text" className='price' />
                  </div>)}
                  <div id='div-right' style={{ justifyContent: 'flex-end' }}>
                    <button>Đăng</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Các bài đăng của người dùng */}
        <div className='container-user-post'>
          <h2>Bài đã đăng</h2>
          <div className='container-post'>
            {/* chèn component vô */}
          </div>
        </div>

      </div>
    </>
  );
};

export default Profile;
