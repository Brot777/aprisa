import express from "express";
import { getDataDay, getDataMonth, getDataWeek } from "../controllers/paint.js";

const router = express.Router();

router.get("/day", getDataDay);
router.get("/month", getDataMonth);
router.get("/week", getDataWeek);

export default router;
