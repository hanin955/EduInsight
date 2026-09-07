import express from "express";
import { 
    ajouterCourse, 
    listerCourses, 
    listerbyIdCourse, 
    updateCourse, 
    deleteCourse, 
    enrollCourse 
} from "../controllers/courseController.js";
import authorize from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
const router = express.Router();
const courseUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
]);
router.get("/list", listerCourses);
router.get("/:id", listerbyIdCourse);
router.post("/ajouter", protect, authorize(['teacher', 'admin']), courseUpload, ajouterCourse);
router.put("/:id", protect, authorize(['teacher', 'admin']), courseUpload, updateCourse);
router.delete("/:id", protect, authorize(['teacher', 'admin']), deleteCourse);
router.post('/:id/enroll', protect, authorize(['student']), enrollCourse);
export default router;