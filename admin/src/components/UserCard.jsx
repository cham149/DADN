import React from 'react'
import '../style/UserCard.css'

const UserCard = ({ type = "user", data, onEdit, onDelete, onLock, onUnlock  }) => {
  const adminAvatar = "https://i.pinimg.com/736x/20/ef/6b/20ef6b554ea249790281e6677abc4160.jpg";

  return (
    <div className='userCard-container'>
      <label className='username'>
        {data?.ten || (type === "admin" ? "ADMIN" : "USERNAME")}
      </label>

      {/* Avatar */}
      <img
        className='user-avatar'
        src={type === "admin" ? (data?.avatar || adminAvatar) : (data?.avatar || "https://i.pinimg.com/736x/20/ef/6b/20ef6b554ea249790281e6677abc4160.jpg")}
        alt="avatar"
      />

      <div className='user-infor'>
        {(type === "user" || type === "reported") ? (
          <>
            <label className='user-email'>email: {data?.email}</label>
            <label className='user-role'>vai trò: {data?.vaiTro}</label>
            <label className='user-locked'>trạng thái: {data?.trangThai}</label>
            <label className='user-detail'>mô tả: {data?.moTa}</label>
            <label className='user-locked'>số bài viết bị khóa: {data?.soBaiVietBiKhoa}</label>
            <label className='user-dateCreated'>ngày tạo: {data?.ngayTao ? new Date(data.ngayTao).toISOString().split("T")[0] : ""}</label>
            <label className='user-dateUpdated'>cập nhật: {data?.ngayCapNhat ? new Date(data.ngayCapNhat).toISOString().split("T")[0] : ""}</label>
          </>
        ) : (
          <>
            <label className='user-email'>email: {data?.email}</label>
            <label className='user-dateCreated'>ngày tạo: {data?.ngayTao ? new Date(data.ngayTao).toISOString().split("T")[0] : ""}</label>
          </>
        )}
      </div>

      <div className='user-button-container'>
        {(type === "user" || type === "admin") && (
          <>
            <button
              className='user-button-update'
              onClick={() => onEdit && onEdit(data)}
            >
              Sửa
            </button>
            <button
              className='user-button-delete'
              onClick={() => onDelete && onDelete(data)}
            >
              Xóa
            </button>
          </>
        )}

          {type === "reported" && (
            <>
              {data?.trangThai === "Mở" && onLock && (
                <button
                  className='user-button-lock'
                  onClick={() => onLock(data)}
                >
                  Khóa
                </button>
              )}
              {data?.trangThai === "Khóa" && onUnlock && (
                <button
                  className='user-button-unlock'
                  onClick={() => onUnlock(data)}
                >
                  Mở khóa
                </button>
              )}
            </>
          )}
      </div>
    </div>
  )
}

export default UserCard
