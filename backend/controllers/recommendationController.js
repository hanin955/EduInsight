import mongoose from 'mongoose';
import Recommendation from '../models/Recommendation.js';
import { generateRecommendations } from '../services/recommendationServices.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getRecommendations = async (req, res) => {
    try {
        if (!isValidId(req.params.studentId)) {
            return res.status(400).json({ success: false, message: "Identifiant étudiant invalide" });
        }
        let data = await Recommendation.find({ student: req.params.studentId })
            .populate('course', 'title level duration')
            .sort({ score: -1 });

        if (!data.length) {
            data = await generateRecommendations(req.params.studentId);
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ success: false, message: err.message || "Erreur lors de la récupération des recommandations" });
    }
};

export const createRecommendations = async (req, res) => {
    try {
        const { studentId } = req.body;
        if (!isValidId(studentId)) {
            return res.status(400).json({ success: false, message: "Identifiant étudiant invalide" });
        }
        const data = await generateRecommendations(studentId);
        res.status(201).json({ success: true, data });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ success: false, message: err.message || "Erreur lors de la génération des recommandations" });
    }
};

export const ajouterRecommendation = async (req, res) => {
    try {
        const newRecommendation = new Recommendation(req.body);
        await newRecommendation.save();
        res.status(201).json(newRecommendation);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Une recommandation existe déjà pour cet étudiant et ce cours" });
        }
        res.status(400).json({ message: "Erreur lors de l'ajout de la recommandation", error: err.message });
    }
};

export const listerRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find().sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations", error: err.message });
    }
};

export const listerRecommendationsByStudent = async (req, res) => {
    try {
        if (!isValidId(req.params.studentId)) {
            return res.status(400).json({ message: "Identifiant étudiant invalide" });
        }
        const recommendations = await Recommendation.find({ student: req.params.studentId }).sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations de l'étudiant", error: err.message });
    }
};

export const getbyIdRecommendation = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }
        const foundRecommendation = await Recommendation.findById(req.params.id);
        if (!foundRecommendation) {
            return res.status(404).json({ message: "Recommandation non trouvée" });
        }
        res.status(200).json(foundRecommendation);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la recommandation", error: err.message });
    }
};

export const updateRecommendation = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }
        const updatedRecommendation = await Recommendation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRecommendation) {
            return res.status(404).json({ message: "Recommandation non trouvée" });
        }
        res.status(200).json(updatedRecommendation);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la recommandation", error: err.message });
    }
};

export const deleteRecommendation = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }
        const deletedRecommendation = await Recommendation.findByIdAndDelete(req.params.id);
        if (!deletedRecommendation) {
            return res.status(404).json({ message: "Recommandation non trouvée" });
        }
        res.status(200).json({ message: "Recommandation supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la recommandation", error: err.message });
    }
};

export const markRecommendationAsRead = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Identifiant recommandation invalide" });
        }
        const recommendation = await Recommendation.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
        if (!recommendation) {
            return res.status(404).json({ success: false, message: "Recommandation introuvable." });
        }
        res.status(200).json({ success: true, data: recommendation });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du statut", error: err.message });
    }
};

export const markAllRecommendationsAsRead = async (req, res) => {
    try {
        const { studentId } = req.body;
        if (!isValidId(studentId)) {
            return res.status(400).json({ success: false, message: "Identifiant étudiant invalide" });
        }
        await Recommendation.updateMany({ student: studentId, status: 'unread' }, { status: 'read' });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour des statuts", error: err.message });
    }
};