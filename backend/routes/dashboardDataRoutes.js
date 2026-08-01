import express from "express";
const router = express.Router();
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import {
    ajouterDashboardData,
    listerDashboardData,
    getbyIdDashboardData,
    updateDashboardData,
    deleteDashboardData,
    generateForStudent,
    generateForTeacher,
    generateForAdmin
} from "../controllers/dashboardDataController.js";

router.post("/ajouter", protect, authorize(['admin']), ajouterDashboardData);
router.get("/lister", listerDashboardData);
router.get("/:id", getbyIdDashboardData);
router.put("/:id", protect, authorize(['admin']), updateDashboardData);
router.delete("/:id", protect, authorize(['admin']), deleteDashboardData);
router.get('/student', protect, authorize(['student']), generateForStudent);
router.get('/teacher/course/:courseId', protect, authorize(['teacher']), generateForTeacher);
router.get('/admin', protect, authorize(['admin']), generateForAdmin);
export default router;