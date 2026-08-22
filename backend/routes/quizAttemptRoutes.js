import express from "express";
const router = express.Router();
import { ajouterQuizAttempt, listerQuizAttempts, getbyIdQuizAttempt, updateQuizAttempt, deleteQuizAttempt, takeQuiz, submitAnswers, expireAttempt } from "../controllers/quizAttemptController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", ajouterQuizAttempt);
router.get("/lister", listerQuizAttempts);
router.get("/:id", getbyIdQuizAttempt);
router.put("/:id", updateQuizAttempt);
router.delete("/:id", deleteQuizAttempt);
router.post('/start/:quizId', protect, authorize(['student']), takeQuiz);
router.post('/:attemptId/submit', protect, authorize(['student']), submitAnswers);
router.post('/:attemptId/expire', protect, authorize(['student']), expireAttempt);
export default router;