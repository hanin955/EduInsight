import express from "express";
const router = express.Router();
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import uploadDocumentMiddleware from "../middlewares/uploadDocument.js";
import {
    uploadDocument,
    listMyDocuments,
    uploadSharedDocument,
    listMySharedDocuments,
    listSharedDocumentsForStudent,
    deleteDocument,
} from "../controllers/documentController.js";
router.post("/", protect, uploadDocumentMiddleware.single("document"), uploadDocument);
router.get("/", protect, listMyDocuments);
router.post("/shared", protect, authorize(["admin", "teacher"]), uploadDocumentMiddleware.single("document"), uploadSharedDocument);
router.get("/shared/mine", protect, authorize(["admin", "teacher"]), listMySharedDocuments);
router.get("/shared/student", protect, authorize(["student"]), listSharedDocumentsForStudent);
router.delete("/:id", protect, deleteDocument);
export default router;