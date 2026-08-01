import express from "express";
const router = express.Router();
import { ajouterAuditLog, listerAuditLogs, getbyIdAuditLog, updateAuditLog, deleteAuditLog } from "../controllers/auditLogController.js";

router.post("/ajouter", ajouterAuditLog);
router.get("/lister", listerAuditLogs);
router.get("/:id", getbyIdAuditLog);
router.put("/:id", updateAuditLog);
router.delete("/:id", deleteAuditLog);
export default router;