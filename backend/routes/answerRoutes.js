import express from "express";
const router = express.Router();
import { ajouterAnswer, listerAnswers, getbyIdAnswer, updateAnswer, deleteAnswer } from "../controllers/answerController.js";

router.post("/ajouter", ajouterAnswer);
router.get("/lister", listerAnswers);
router.get("/:id", getbyIdAnswer);
router.put("/:id", updateAnswer);
router.delete("/:id", deleteAnswer);
export default router;