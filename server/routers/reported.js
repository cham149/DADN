import express from "express";
import {
  getReportedPosts,
  approveReport,
  rejectReport,
  lockUser,
  unlockUser,
  getUsersWithLockedPosts
} from "../controllers/reportedController.js";

const router = express.Router();

// ───── Reported Posts ─────
router.get("/admin/reported-posts", getReportedPosts);            
router.post("/admin/reports/:reportId/approve", approveReport);    
router.post("/admin/reports/:reportId/reject", rejectReport);     

// ───── Users ─────
router.put("/user/:userId/lock", lockUser);                       
router.put("/user/:userId/unlock", unlockUser);                   
router.get("/users/locked-posts", getUsersWithLockedPosts);       

export default router;
