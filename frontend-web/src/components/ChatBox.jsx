import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import socket from '../socket';
import "../style/ChatBox.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatBox = ({ conversationId, userId, partner, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messageEndRef = useRef(null);

  // Đăng ký user lên socket khi vào
  useEffect(() => {
    if (userId) {
      socket.emit("addUser", userId);
    }
  }, [userId]);

  // Lấy tin nhắn ban đầu
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${conversationId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy tin nhắn:', err);
      }
    };

    if (conversationId) fetchMessages();
  }, [conversationId]);

  // Tự động cuộn khi có tin nhắn
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Nhận tin nhắn mới từ socket
  useEffect(() => {
    socket.on("receiveMessage", ({ senderId, message }) => {
      if (message.cuocTroChuyen === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const msgToSend = {
      cuocTroChuyen: conversationId,
      nguoiGui: userId,
      nguoiNhan: partner._id,
      noiDung: newMsg
    };

    try {
      const res = await axios.post(`http://localhost:5000/api/messages`, msgToSend);
      const savedMessage = res.data.message;

      setMessages((prev) => [...prev, savedMessage]);
      setNewMsg('');

      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: partner._id,
        message: savedMessage
      });
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };
  
  const handleRightClick = (e, msg) => {
    e.preventDefault();

    const confirmDelete = window.confirm("Bạn có chắc muốn xoá tin nhắn này?");
    if (confirmDelete) {
      deleteMessage(msg._id);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Lỗi khi xoá tin nhắn:", error);
    }
  };

  //gọi api
  const markMessagesAsRead = async () => {
  try {
    await axios.put(`http://localhost:5000/api/messages/read-message`, {
      conversationId,
      userId
    });
    // Cập nhật lại state để mất chữ "chưa đọc"
    setMessages((prev) =>
      prev.map((msg) =>
        msg.nguoiNhan?._id === userId && msg.trangThai === "Chưa đọc"
          ? { ...msg, trangThai: "Đã đọc" }
          : msg
      )
    );
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái đã đọc:", err);
  }
};
// Gọi hàm sau khi mở ChatBox khoảng vài giây
useEffect(() => {
  if (conversationId && userId) {
    const timeout = setTimeout(() => {
      markMessagesAsRead();
    }, 3000); // Sau 3 giây

    return () => clearTimeout(timeout);
  }
}, [conversationId, userId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={partner.avatar || "/default-avatar.png"}
            alt="avatar" className='avatar'/>
          <span>{partner.ten}</span>
        </div>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="chatbox-body">
        {messages.map((msg) => {
          const isSentByMe = msg.nguoiGui?._id === userId || msg.nguoiGui === userId;

          return (
            <div
              key={msg._id}
              className={`message-wrapper ${isSentByMe ? 'sent-wrapper' : 'received-wrapper'}`}
              onContextMenu={(e) => handleRightClick(e, msg)} // 👈 Bắt sự kiện click chuột phải
            >
              <div className={`message ${isSentByMe ? 'sent' : 'received'}`}>
                <span>{msg.noiDung}</span>
                <div className="meta">
                  <span className="time">{dayjs(msg.thoiGianGui).fromNow()}</span>
                  {!isSentByMe && msg.trangThai === "Chưa đọc" && (
                    <span className="status">• Chưa đọc</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef}></div>
      </div>

      <div className="chatbox-input">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSend}><i className="ri-send-plane-2-fill"></i></button>
      </div>
    </div>
  );
};

export default ChatBox;
