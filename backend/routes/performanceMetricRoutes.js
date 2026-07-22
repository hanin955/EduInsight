const express = require("express");
const router = express.Router();
const performanceMetricControllers = require("../controllers/performanceMetricController.js");

router.post("/ajouter", performanceMetricControllers.ajouterPerformanceMetric);
router.get("/lister", performanceMetricControllers.listerPerformanceMetrics);
router.get("/:id", performanceMetricControllers.getbyIdPerformanceMetric);
router.put("/:id", performanceMetricControllers.updatePerformanceMetric);
router.delete("/:id", performanceMetricControllers.deletePerformanceMetric);

module.exports = router;