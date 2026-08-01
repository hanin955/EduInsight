import express from "express";
const router = express.Router();
import { ajouterQuestion, listerQuestions, getbyIdQuestion, updateQuestion, deleteQuestion } from "../controllers/questionController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['teacher', 'admin']), ajouterQuestion);
router.get("/lister", listerQuestions);
router.get("/:id", getbyIdQuestion);
router.put("/:id", protect, authorize(['teacher', 'admin']), updateQuestion);
router.delete("/:id", protect, authorize(['teacher', 'admin']), deleteQuestion);
export default router;