import express from "express";
const router = express.Router();
import {
    ajouterLesson,
    listerLessons,
    listerToutesLesLecons,
    getbyIdLesson,
    updateLesson,
    deleteLesson,
} from "../controllers/lessonController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
import uploadLessonPdf from "../middlewares/uploadLessonPdf.js";

router.post("/ajouter", protect, authorize(['teacher', 'admin']), uploadLessonPdf.single("pdf"), ajouterLesson);
router.get("/lister", listerLessons);
router.get("/lister-tout", listerToutesLesLecons);
router.get("/:id", getbyIdLesson);
router.put("/:id", protect, authorize(['teacher', 'admin']), uploadLessonPdf.single("pdf"), updateLesson);
router.delete("/:id", protect, authorize(['teacher', 'admin']), deleteLesson);

export default router;