import express from "express";
const router = express.Router();

import { ajouterCourse, listerCourses, listerbyIdCourse, updateCourse, deleteCourse, enrollCourse } from "../controllers/courseController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['teacher', 'admin']), ajouterCourse);
router.get("/list", listerCourses);
router.get("/:id", listerbyIdCourse);
router.put("/:id", protect, authorize(['teacher', 'admin']), updateCourse);
router.delete("/:id", deleteCourse);
router.post('/:id/enroll', protect, authorize(['student']), enrollCourse);

export default router;