import express from "express";
import { getBasicData, getProductionMonth } from "../controllers/dashboard.js";

const router = express.Router();

router.get("/basic-data", getBasicData);
router.get("/production-month", getProductionMonth);

export default router;
