import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';
import "../style/ChatList.css";

const ChatList = ({ userId }) => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleClickPartner = async (partner) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/conversations/find-or-create`, {
        user1Id: userId,
        user2Id: partner._id
      });

      setSelectedPartner(partner);
      setConversationId(res.data.conversationId);
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
