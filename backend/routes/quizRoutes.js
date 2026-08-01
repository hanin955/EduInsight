import express from "express";
const router = express.Router();
import { ajouterQuiz, listerQuiz, getbyIdQuiz, updateQuiz, deleteQuiz, publishQuiz } from "../controllers/quizController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['teacher', 'admin']), ajouterQuiz);
router.get("/lister", listerQuiz);
router.get("/:id", getbyIdQuiz);
router.put("/:id", protect, authorize(['teacher', 'admin']), updateQuiz);
router.delete("/:id", protect, authorize(['teacher', 'admin']), deleteQuiz);
router.patch('/:id/publish', protect, authorize(['teacher', 'admin']), publishQuiz);
export default router;