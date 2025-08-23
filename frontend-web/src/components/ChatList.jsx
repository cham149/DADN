import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';
import "../style/ChatList.css";
import socket from "../socket";

const ChatList = ({ userId }) => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({}); //đánh dấu số tin nhắn chưa đọc

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/partners/${userId}`);
        setPartners(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy partner:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPartners();
    }
  }, [userId]);

  //đếm số tin nhắn chưa đọc
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/unread/${userId}`);
        const data = {};
        res.data.forEach(item => {
          data[item._id] = item.count;
        });
        setUnreadCounts(data);
      } catch (err) {
        console.error("Lỗi lấy số tin chưa đọc:", err);
      }
    };

    if (userId) fetchUnread();
  }, [userId]);

  //ChatList lắng nghe socket update tin nhắn
  useEffect(() => {
    socket.on("updateUnread", ({ conversationId, userId }) => {
      console.log("🔔 Cập nhật tin nhắn đã đọc:", conversationId, userId);

      // Ví dụ: clear badge cho userId này
      setUnreadCounts(prev => ({
        ...prev,
        [userId]: 0
      }));
    });

    return () => socket.off("updateUnread");
  }, []);

  const handleClickPartner = async (partner) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/conversations/find-or-create`, {
        user1Id: userId,
        user2Id: partner._id
      });

      setSelectedPartner(partner);
      setConversationId(res.data.conversationId);

      // ✅ Clear badge ngay lập tức cho partner này
      setUnreadCounts(prev => ({
        ...prev,
        [partner._id]: 0
      }));

      // ✅ Emit qua socket để sync cho người kia (server sẽ broadcast updateUnread)
      socket.emit("markAsRead", {
        conversationId: res.data.conversationId,
        userId,
        partnerId: partner._id
      });

    } catch (err) {
      console.error("Lỗi khi tìm hoặc tạo cuộc trò chuyện:", err);
    }
  };

  return (
    <div className='chatList-container'>
      <h3>Danh sách trò chuyện</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <ul>
          {partners.map((partner) => (
            <li
              key={partner._id}
              onClick={() => handleClickPartner(partner)}>
              <img
                src={partner.avatar || 'https://via.placeholder.com/40'}
                alt={partner.ten}
                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
              />
              {partner.ten}
              {unreadCounts[partner._id] > 0 && (
                <span className="badge">{unreadCounts[partner._id]}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedPartner && conversationId && (
        <ChatBox
          conversationId={conversationId}
          userId={userId}
          partner={selectedPartner}
          onClose={() => {
            setSelectedPartner(null);
            setConversationId(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatList;
