import express from "express";
const router = express.Router();
import { ajouterLesson, listerLessons, getbyIdLesson, updateLesson, deleteLesson } from "../controllers/lessonController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['teacher', 'admin']), ajouterLesson);
router.get("/lister", listerLessons);
router.get("/:id", getbyIdLesson);
router.put("/:id", protect, authorize(['teacher', 'admin']), updateLesson);
router.delete("/:id", protect, authorize(['teacher', 'admin']), deleteLesson);
export default router;