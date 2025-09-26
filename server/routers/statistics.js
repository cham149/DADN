import express from "express";
import { getStatistics } from "../controllers/statisticController.js";

const router = express.Router();

router.get("/statistics", getStatistics);

export default router;
