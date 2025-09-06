import express from "express";
import { getPendingPosts, lockPost, rejectReports, getAdminList } from "../controllers/reportedController.js"; // Import getAdminList

const router = express.Router();

router.get("/admin/list", getAdminList); // Thêm route này
router.get("/admin/pending-posts", getPendingPosts);
router.post("/admin/posts/:postId/lock", lockPost);
router.post("/admin/posts/:postId/reject", rejectReports);

export default router;