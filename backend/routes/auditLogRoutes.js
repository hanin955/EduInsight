const express = require("express");
const router = express.Router();
const auditLogControllers = require("../controllers/auditLogController.js");
router.post("/ajouter", auditLogControllers.ajouterAuditLog);
router.get("/lister", auditLogControllers.listerAuditLogs);
router.get("/:id", auditLogControllers.getbyIdAuditLog);
router.put("/:id", auditLogControllers.updateAuditLog);
router.delete("/:id", auditLogControllers.deleteAuditLog);
module.exports = router;