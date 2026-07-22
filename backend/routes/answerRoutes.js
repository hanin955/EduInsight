const express = require("express");
const router = express.Router();
const answerControllers = require("../controllers/answerController.js");
router.post("/ajouter", answerControllers.ajouterAnswer);
router.get("/lister", answerControllers.listerAnswers);
router.get("/:id", answerControllers.getbyIdAnswer);
router.put("/:id", answerControllers.updateAnswer);
router.delete("/:id", answerControllers.deleteAnswer);
module.exports = router;