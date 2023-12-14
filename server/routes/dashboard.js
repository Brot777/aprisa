import express from "express";
import { getBasicData, getProductionTrend } from "../controllers/dashboard.js";

const router = express.Router();

router.get("/basic-data", getBasicData);
router.get("/production-trend", getProductionTrend);

export default router;
