const express = require("express");
const router = express.Router(); 
const { register, login } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const courController = require("../controllers/courseController");
const lessonController = require("../controllers/lessonController");
const choiceController = require("../controllers/choiceController");
const quizAttemptController = require("../controllers/quizAttemptController");
const dashboardDatController = require("../controllers/dashboardDataController");
const recommandationsController = require("../controllers/recommendationController");
const moduleController = require("../controllers/moduleController");
const questionContoller = require("../controllers/questionController");
const userController = require("../controllers/userController");
const departementController = require("../controllers/departementController");
const performanceMetricController = require("../controllers/performanceMetricController");
const { logout, updateProfile, changePassword } = require('../controllers/authController.js');
// ACCÈS & PROFIL
router.post("/register", register);
router.post("/login", login);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);
router.get("/list", protect, authorize(["student", "teacher"]), (req, res) => {
    res.json({ message: "Profil utilisateur", user: req.user });
});
router.put("/updateprofile", protect, authorize(["student", "teacher"]),updateProfile); // modifier son profil
router.get("/admin", protect, authorize(["admin"]), (req, res) => {
    res.json({ message: "Espace administrateur" });
});
router.get("/consolter", protect, authorize(["student", "teacher"]), courController.listerCourses);
router.get("/filtrer", protect, authorize(["student", "teacher"]), courController.listerbyIdCourse); 
router.get("/suivre", protect, authorize(["student", "teacher"]), lessonController.listerLessons);
router.post("/participer", protect, authorize(["student"]), choiceController.ajouterChoice);
router.get("/score", protect, authorize(["student"]), quizAttemptController.listerQuizAttempts);
router.get("/rec", protect, authorize(["student"]), recommandationsController.getbyIdRecommendation);
router.get("/logout",protect,authorize("teacher","student"),logout);
// GESTION PÉDAGOGIQUE (Enseignant) 
router.post("/ajouter", protect, authorize(["teacher", "admin"]), courController.ajouterCourse);
router.put("/update", protect, authorize(["teacher", "admin"]), courController.updateCourse);
router.delete("/delete", protect, authorize(["teacher", "admin"]), courController.deleteCourse);
router.post("/ajoutermodule", protect, authorize(["teacher"]), moduleController.ajouterModule);
router.put("/updatemodule", protect, authorize(["teacher"]), moduleController.updateModule); 
router.delete("/deletemodule", protect, authorize(["teacher"]), moduleController.deleteModule); 
router.post("/ajouterlesson", protect, authorize(["teacher"]), lessonController.ajouterLesson);
router.put("/updateleçon", protect, authorize(["teacher"]), lessonController.updateLesson);
router.delete("/deleteleçon", protect, authorize(["teacher"]), lessonController.deleteLesson);
router.post("/ajouterquestion", protect, authorize(["teacher"]), questionContoller.ajouterQuestion);
router.get("/listerquestion", protect, authorize(["student", "teacher"]), questionContoller.listerQuestions);
router.put("/updeteqeustion", protect, authorize(["teacher"]), questionContoller.updateQuestion);
router.delete("/deletequestion", protect, authorize(["teacher"]), questionContoller.deleteQuestion);
router.get("/tentatives", protect, authorize(["teacher"]), quizAttemptController.listerQuizAttempts); 
router.get("/dashboard", protect, authorize(["teacher"]), dashboardDatController.getbyIdDashboardData); 
router.get("/statistiques", protect, authorize(["teacher"]), performanceMetricController.listerPerformanceMetrics);

// ADMINISTRATION
router.post("/ajouteruser", protect, authorize(["admin"]), userController.ajouterUtilisateur);
router.get("/listeruser", protect, authorize(["admin"]), userController.listerUtilisateurs);
router.put("/updeteuser", protect, authorize(["admin"]), userController.updateUtilisateur);
router.delete("/deleteuser", protect, authorize(["admin"]), userController.deleteUtilisateur);
router.post("/ajouterdep", protect, authorize(["admin"]), departementController.ajouterDepartement);
router.put("/updatedep", protect, authorize(["admin"]), departementController.updateDepartement);
router.delete("/deletedep", protect, authorize(["admin"]), departementController.deleteDepartement);
router.get("/lister", protect, authorize(["admin"]), departementController.listerDepartements);
// "Consulter les rapports globaux" + "Gérer les paramètres du système"
router.get("/rapports/statistiques", protect, authorize(["admin"]), dashboardDatController.getbyIdDashboardData);
module.exports = router;