import express from "express";
const router = express.Router();

import { register, login, logout, updateProfile, changePassword } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";

import { listerCourses, listerbyIdCourse, ajouterCourse, updateCourse, deleteCourse } from "../controllers/courseController.js";
import { listerLessons, ajouterLesson, updateLesson, deleteLesson } from "../controllers/lessonController.js";
import { ajouterChoice } from "../controllers/choiceController.js";
import { listerQuizAttempts } from "../controllers/quizAttemptController.js";
import { getbyIdDashboardData } from "../controllers/dashboardDataController.js";
import { getbyIdRecommendation } from "../controllers/recommendationController.js";
import { ajouterModule, updateModule, deleteModule } from "../controllers/moduleController.js";
import { ajouterQuestion, listerQuestions, updateQuestion, deleteQuestion } from "../controllers/questionController.js";
import { ajouterUtilisateur, listerUtilisateurs, updateUtilisateur, deleteUtilisateur } from "../controllers/userController.js";
import { ajouterDepartement, updateDepartement, deleteDepartement, listerDepartements } from "../controllers/departementController.js";
import { listerPerformanceMetrics } from "../controllers/performanceMetricController.js";

// ACCÈS & PROFIL
router.post("/register", register);
router.post("/login", login);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

router.get("/list", protect, authorize(["student", "teacher"]), (req, res) => {
    res.json({ message: "Profil utilisateur", user: req.user });
});
router.put("/updateprofile", protect, authorize(["student", "teacher"]), updateProfile);

router.get("/admin", protect, authorize(["admin"]), (req, res) => {
    res.json({ message: "Espace administrateur" });
});

router.get("/consolter", protect, authorize(["student", "teacher"]), listerCourses);
router.get("/filtrer", protect, authorize(["student", "teacher"]), listerbyIdCourse);
router.get("/suivre", protect, authorize(["student", "teacher"]), listerLessons);
router.post("/participer", protect, authorize(["student"]), ajouterChoice);
router.get("/score", protect, authorize(["student"]), listerQuizAttempts);
router.get("/rec", protect, authorize(["student"]), getbyIdRecommendation);
router.get("/logout", protect, authorize(["teacher", "student"]), logout);

// GESTION PÉDAGOGIQUE (Enseignant)
router.post("/ajouter", protect, authorize(["teacher", "admin"]), ajouterCourse);
router.put("/update", protect, authorize(["teacher", "admin"]), updateCourse);
router.delete("/delete", protect, authorize(["teacher", "admin"]), deleteCourse);

router.post("/ajoutermodule", protect, authorize(["teacher"]), ajouterModule);
router.put("/updatemodule", protect, authorize(["teacher"]), updateModule);
router.delete("/deletemodule", protect, authorize(["teacher"]), deleteModule);

router.post("/ajouterlesson", protect, authorize(["teacher"]), ajouterLesson);
router.put("/updateleçon", protect, authorize(["teacher"]), updateLesson);
router.delete("/deleteleçon", protect, authorize(["teacher"]), deleteLesson);

router.post("/ajouterquestion", protect, authorize(["teacher"]), ajouterQuestion);
router.get("/listerquestion", protect, authorize(["student", "teacher"]), listerQuestions);
router.put("/updeteqeustion", protect, authorize(["teacher"]), updateQuestion);
router.delete("/deletequestion", protect, authorize(["teacher"]), deleteQuestion);

router.get("/tentatives", protect, authorize(["teacher"]), listerQuizAttempts);
router.get("/dashboard", protect, authorize(["teacher"]), getbyIdDashboardData);
router.get("/statistiques", protect, authorize(["teacher"]), listerPerformanceMetrics);

// ADMINISTRATION
router.post("/ajouteruser", protect, authorize(["admin"]), ajouterUtilisateur);
router.get("/listeruser", protect, authorize(["admin"]), listerUtilisateurs);
router.put("/updeteuser", protect, authorize(["admin"]), updateUtilisateur);
router.delete("/deleteuser", protect, authorize(["admin"]), deleteUtilisateur);

router.post("/ajouterdep", protect, authorize(["admin"]), ajouterDepartement);
router.put("/updatedep", protect, authorize(["admin"]), updateDepartement);
router.delete("/deletedep", protect, authorize(["admin"]), deleteDepartement);
router.get("/lister", protect, authorize(["admin"]), listerDepartements);

router.get("/rapports/statistiques", protect, authorize(["admin"]), getbyIdDashboardData);

export default router;