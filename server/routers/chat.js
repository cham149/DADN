import express from "express";
import {
  getPartners,
  findOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  markMessageAsRead,
  getUnreadMessageCounts
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/partners/:userId", getPartners);
router.post("/conversations/find-or-create", findOrCreateConversation);
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);
router.delete("/messages/:id", deleteMessage);
router.put("/messages/read-message", markMessageAsRead);
router.get("/messages/unread/:userId", getUnreadMessageCounts);

export default router;