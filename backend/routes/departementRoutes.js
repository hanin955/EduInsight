import express from "express";
const router = express.Router();
import { ajouterDepartement, listerDepartements, getbyIdDepatement, updateDepartement, deleteDepartement } from "../controllers/departementController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['admin']), ajouterDepartement);
router.get("/lister", listerDepartements);
router.get("/:id", getbyIdDepatement);
router.put("/:id", protect, authorize(['admin']), updateDepartement);
router.delete("/:id", protect, authorize(['admin']), deleteDepartement);
export default router;