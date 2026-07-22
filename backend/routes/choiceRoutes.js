const express = require("express");
const router = express.Router();
const choiceControllers = require("../controllers/choiceController.js");
router.post("/ajouter", choiceControllers.ajouterChoice);
router.get("/lister", choiceControllers.listerChoices);
router.get("/:id", choiceControllers.getbyIdChoice);
router.put("/:id", choiceControllers.updateChoice);
router.delete("/:id", choiceControllers.deleteChoice);
module.exports = router;