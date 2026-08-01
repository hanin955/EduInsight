import express from "express";
const router = express.Router();
import { ajouterChoice, listerChoices, getbyIdChoice, updateChoice, deleteChoice } from "../controllers/choiceController.js";

router.post("/ajouter", ajouterChoice);
router.get("/lister", listerChoices);
router.get("/:id", getbyIdChoice);
router.put("/:id", updateChoice);
router.delete("/:id", deleteChoice);
export default router;