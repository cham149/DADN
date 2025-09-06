import mongoose from "mongoose";
import { User, Conversation, Message } from "../database/database.js";

// Lấy danh sách đối tác trò chuyện của người dùng
export const getPartners = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const conversations = await Conversation.find({
      $or: [{ nguoi1: userId }, { nguoi2: userId }]
    });

    if (conversations.length === 0) {
      return res.status(200).json([]); // Trả về mảng rỗng nếu không có cuộc trò chuyện nào
    }

    const otherUserIds = conversations.map(conv => {
      return conv.nguoi1.equals(userId) ? conv.nguoi2 : conv.nguoi1;
    });

    const uniqueUserIds = [...new Set(otherUserIds.map(id => id.toString()))];

    const otherUsers = await User.find({
      _id: { $in: uniqueUserIds }
    });

    return res.json(otherUsers);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

// Tìm hoặc tạo cuộc trò chuyện
export const findOrCreateConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ error: "Thiếu userId" });
    }

    const u1 = new mongoose.Types.ObjectId(user1Id);
    const u2 = new mongoose.Types.ObjectId(user2Id);

    let conversation = await Conversation.findOne({
      $or: [
        { nguoi1: u1, nguoi2: u2 },
        { nguoi1: u2, nguoi2: u1 }
      ]
    });

    if (!conversation) {
      conversation = new Conversation({ nguoi1: u1, nguoi2: u2 });
      await conversation.save();
    }

    return res.status(200).json({ conversationId: conversation._id });
  } catch (error) {
    console.error("Lỗi khi tìm hoặc tạo conversation:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy tin nhắn của một cuộc trò chuyện
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "ID cuộc trò chuyện không hợp lệ" });
    }

    const messages = await Message.find({ cuocTroChuyen: conversationId })
      .populate("nguoiGui nguoiNhan")
      .sort({ thoiGianGui: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Gửi tin nhắn mới
export const sendMessage = async (req, res) => {
  try {
    const { cuocTroChuyen, nguoiGui, nguoiNhan, noiDung, loai, postData } = req.body;

    if (!cuocTroChuyen || !nguoiGui || !nguoiNhan || (loai === "text" && !noiDung)) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const newMessage = new Message({
      cuocTroChuyen,
      nguoiGui,
      nguoiNhan,
      noiDung: noiDung || "",
      loai: loai || "text",
      postData: postData || null
    });

    await newMessage.save();
    await newMessage.populate("nguoiGui nguoiNhan");

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xoá tin nhắn theo ID
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy tin nhắn" });

    res.json({ message: "Đã xoá thành công" });
  } catch (err) {
    console.error("Lỗi xoá tin nhắn:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Đánh dấu là đã đọc
export const markMessageAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    if (!conversationId || !userId) {
      return res.status(400).json({ error: "Thiếu conversationId hoặc userId" });
    }

    const result = await Message.updateMany(
      {
        cuocTroChuyen: conversationId,
        nguoiNhan: userId,
        trangThai: "Chưa đọc"
      },
      { $set: { trangThai: "Đã đọc" } }
    );

    res.json({ message: "Đã cập nhật trạng thái", updated: result.modifiedCount });
  } catch (err) {
    console.error("Lỗi đánh dấu đã đọc:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy số tin chưa đọc của từng partner
export const getUnreadMessageCounts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const unread = await Message.aggregate([
      { $match: { nguoiNhan: new mongoose.Types.ObjectId(userId), trangThai: "Chưa đọc" } },
      {
        $group: {
          _id: "$nguoiGui",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(unread);
  } catch (err) {
    console.error("Lỗi lấy số tin chưa đọc:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};