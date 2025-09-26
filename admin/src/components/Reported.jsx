import React from 'react';
import '../style/Reported.css';

const Reported = ({
  postId,
  reportId,
  chuBai,
  trangThaiBaoCao,
  soLuotBaoCao,
  report,
  hinhAnh,
  moTa,
  onApprove,
  onReject
}) => {
  if (!report) return null;

  return (
    <div className="reported-container">
      <label className="reported-id">{postId}</label>

      <img
        className="reported-post-image"
        src={
          hinhAnh?.startsWith("http")
            ? hinhAnh
            : `http://localhost:5000/uploads/${hinhAnh}`
        }
        alt="post"
      />

      <div className="reported-post-infor">
        <label className="reported-username">
          Tên người đăng: {chuBai?.ten || "Ẩn danh"}
        </label>

        <p className="reported-post-desc">Mô tả bài: {moTa || "Không có mô tả"}</p>

        <div className="reported-reason-item">
          <label className="reported-reason">Lý do báo cáo: <br/> {report.lyDo}</label> <br />
          <label className="reported-reporter">Người báo cáo: {report.nguoiBaoCao?.ten}</label> <br />
          <label className="reported-time">
            Thời gian: {report.thoiGianBaoCao
              ? (() => {
                  const d = new Date(report.thoiGianBaoCao);
                  const time = d.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const date = d.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  return `${time}, ${date}`;
                })()
              : "N/A"}
          </label>
        </div> <br />

        <label className="reported-status">Trạng thái: {trangThaiBaoCao}</label>
        <label className="reported-count">Tổng số báo cáo: {soLuotBaoCao}</label>
      </div>

      <div className="reported-button-container">
        {trangThaiBaoCao === "Đang xử lý" && (
          <>
            <button
              className={`reported-button-yes ${soLuotBaoCao < 3 ? 'disabled' : ''}`}
              onClick={() => onApprove(reportId)}
            >
              Duyệt
            </button>
            <button
              className="reported-button-no"
              onClick={() => onReject(reportId)}
            >
              Không duyệt
            </button>
          </>
        )}

        {trangThaiBaoCao === "Bình thường" && (
          <>
            <button className="reported-button-yes disabled" disabled>
              Duyệt
            </button>
            <button className="reported-button-no disabled" disabled>
              Không duyệt
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Reported;
