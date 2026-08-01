import dashboardData from "../models/DashboardData.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Inscription from "../models/Inscription.js";
import PerformanceMetric from "../models/PerformanceMetric.js";

export const ajouterDashboardData = async (req, res) => {
    try {
        const newDashboardData = new dashboardData(req.body);
        await newDashboardData.save();
        res.status(201).json(newDashboardData);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout du dashboard", error: err.message });
    }
};

export const listerDashboardData = async (req, res) => {
    try {
        const dashboards = await dashboardData.find();
        res.status(200).json(dashboards);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des dashboards", error: err.message });
    }
};

export const getbyIdDashboardData = async (req, res) => {
    try {
        const foundDashboardData = await dashboardData.findById(req.params.id);
        if (!foundDashboardData) {
            return res.status(404).json({ message: "Dashboard non trouvé" });
        }
        res.status(200).json(foundDashboardData);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du dashboard", error: err.message });
    }
};

export const updateDashboardData = async (req, res) => {
    try {
        const updatedDashboardData = await dashboardData.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDashboardData) {
            return res.status(404).json({ message: "Dashboard non trouvé" });
        }
        res.status(200).json(updatedDashboardData);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du dashboard", error: err.message });
    }
};

export const deleteDashboardData = async (req, res) => {
    try {
        const deletedDashboardData = await dashboardData.findByIdAndDelete(req.params.id);
        if (!deletedDashboardData) {
            return res.status(404).json({ message: "Dashboard non trouvé" });
        }
        res.status(200).json({ message: "Dashboard supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression du dashboard", error: err.message });
    }
};

export const generateForStudent = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const attempts = await QuizAttempt.find({ student: studentId });
        const enrollments = await Inscription.find({ student: studentId });
        const totalCourses = enrollments.length;
        const averageScore = attempts.reduce((acc, curr) => acc + curr.score, 0) / (attempts.length || 1);
        const dashboard = await dashboardData.findOneAndUpdate(
            { user: studentId },
            { user: studentId, totalCourses, averageScore },
            { upsert: true, new: true }
        );
        res.status(200).json({ success: true, data: dashboard });
    } catch (error) { next(error); }
};

export const generateForTeacher = async (req, res, next) => {
    try {
        const metrics = await PerformanceMetric.find({ course: req.params.courseId });
        res.status(200).json({ success: true, data: metrics });
    } catch (error) { next(error); }
};

export const generateForAdmin = async (req, res, next) => {
    try {
        const totalStudents = await Inscription.countDocuments();
        res.status(200).json({ success: true, data: { totalStudents } });
    } catch (error) { next(error); }
};