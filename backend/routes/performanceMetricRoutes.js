import express from "express";
const router = express.Router();
import { ajouterPerformanceMetric, listerPerformanceMetrics, getbyIdPerformanceMetric, updatePerformanceMetric, deletePerformanceMetric } from "../controllers/performanceMetricController.js";

router.post("/ajouter", ajouterPerformanceMetric);
router.get("/lister", listerPerformanceMetrics);
router.get("/:id", getbyIdPerformanceMetric);
router.put("/:id", updatePerformanceMetric);
router.delete("/:id", deletePerformanceMetric);
export default router;