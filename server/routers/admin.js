import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { 
  createAdmin, updateAdmin, deleteAdmin, getAdminList 
} from "../controllers/adminController.js";

const router = express.Router();

// CRUD Admin
router.post("/admin", createAdmin);       
router.put("/admin/:id", updateAdmin);        
router.delete("/admin/:id", deleteAdmin);    
router.get("/admin/list", getAdminList);     

export default router;
