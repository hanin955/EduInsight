import express from "express";
const router = express.Router();
import { ajouterNotification, listerNotifications, getbyIdNotification, deleteNotification, markAsRead } from "../controllers/notificationController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/ajouter", protect, authorize(['admin']), ajouterNotification);
router.get("/lister", protect, authorize(['student']), listerNotifications);
router.get("/:id", protect, authorize(['student']), getbyIdNotification);
router.delete("/:id", protect, authorize(['admin']), deleteNotification);
router.patch('/:id/read', markAsRead);
export default router;