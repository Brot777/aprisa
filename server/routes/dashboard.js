import express from "express";
import {
  getBasicData,
  getDataWeekMetallic,
  getProductionMonth,
} from "../controllers/dashboard.js";

const router = express.Router();

router.get("/basic-data", getBasicData);
router.get("/production-month", getProductionMonth);
router.get("/week-metallic", getDataWeekMetallic);

export default router;
