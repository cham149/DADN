import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "../style/ChatBox.css";
import EmojiPicker from 'emoji-picker-react';

const ChatBox = ({ conversationId, userId, partner, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messageEndRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const handleEmojiClick = (emojiData) => {
    setNewMsg((prev) => prev + emojiData.emoji);
  };

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

  useEffect(() => {
    // Tự động cuộn xuống cuối khi có tin nhắn mới
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/messages`, {
        cuocTroChuyen: conversationId,
        nguoiGui: userId,
        nguoiNhan: partner._id,
        noiDung: newMsg
      });

      setMessages((prev) => [...prev, res.data.message]);
      setNewMsg('');
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
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
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message-wrapper ${msg.nguoiGui?._id === userId ? 'sent-wrapper' : 'received-wrapper'}`}>
            <div className={`message ${msg.nguoiGui?._id === userId ? 'sent' : 'received'}`}>
              <span>{msg.noiDung}</span>
            </div>
          </div>

        ))}
        <div ref={messageEndRef}></div>
      </div>

      <div className="chatbox-input">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSend}><i class="ri-send-plane-2-fill"></i></button>
      </div>
    </div>
  );
};

export default ChatBox;
