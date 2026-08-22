import express from "express";
import { getStudentByGrade, getDashboardStatistics, getUserByrole, getCourseCompletion, getPlatformGrowth } from "../controllers/StatisticsControlles.js";
const router = express.Router();
router.get("/students-by-grade", getStudentByGrade);
router.get("/dashboard", getDashboardStatistics);
router.get("/users-by-role", getUserByrole);
router.get("/course-completion", getCourseCompletion);
router.get("/platform-growth", getPlatformGrowth);
export default router;