import express from "express";
import { reportPost } from "../controllers/reportController.js";

const router = express.Router();

router.post("/posts/:postId/report", reportPost);

export default router;