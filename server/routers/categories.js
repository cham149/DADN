import express from "express";
import { getCategories, createCategory, deleteCategory} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", createCategory); 
router.delete("/categories/:id", deleteCategory); 

export default router;