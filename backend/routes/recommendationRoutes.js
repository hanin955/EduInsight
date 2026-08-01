import express from "express";
const router = express.Router();
import { ajouterRecommendation, listerRecommendations, listerRecommendationsByStudent, getbyIdRecommendation, updateRecommendation, deleteRecommendation } from "../controllers/recommendationController.js";

router.post("/ajouter", ajouterRecommendation);
router.get("/lister", listerRecommendations);
router.get("/student/:studentId", listerRecommendationsByStudent);
router.get("/:id", getbyIdRecommendation);
router.put("/:id", updateRecommendation);
router.delete("/:id", deleteRecommendation);
export default router;