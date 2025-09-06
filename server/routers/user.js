import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { 
  uploadAvatar, createUser, updateUser, deleteUser, getUserById, getUserList 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

router.post("/user", createUser);            
router.put("/user/:id", updateUser);       
router.delete("/user/:id", deleteUser);      
router.get("/user/list", getUserList);       
router.get("/user/:id", getUserById);        

export default router;
