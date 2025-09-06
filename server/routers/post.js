import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { getMyPosts, createPost, deletePost, updatePost, getPosts, globalSearch } from "../controllers/postController.js";

const router = express.Router();

router.get("/mypost", getMyPosts);
router.post("/post", upload.single("hinhAnh"), createPost);
router.delete("/posts/:postId", deletePost);
router.put("/posts/:postId", upload.single("hinhAnh"), updatePost);
router.get("/posts", getPosts);
router.get("/search", globalSearch); // Có thể cân nhắc tách search thành 1 route riêng

export default router;