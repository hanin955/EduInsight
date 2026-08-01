import express from "express";
const router = express.Router();

import { ajouterUtilisateur, listerUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";

router.post("/ajouter", ajouterUtilisateur);
router.get("/list", protect, authorize(["admin"]), listerUtilisateurs);
router.get("/:id", getUtilisateurById);
router.put("/:id", updateUtilisateur);
router.delete("/:id", deleteUtilisateur);

export default router;