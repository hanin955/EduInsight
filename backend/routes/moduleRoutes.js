import express from "express";
const router = express.Router();
import { ajouterModule, listerModules, getbyIdModule, updateModule, deleteModule } from "../controllers/moduleController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['teacher', 'admin']), ajouterModule);
router.get("/lister", listerModules);
router.get("/:id", getbyIdModule);
router.put("/:id", protect, authorize(['teacher', 'admin']), updateModule);
router.delete("/:id", protect, authorize(['teacher', 'admin']), deleteModule);
export default router;