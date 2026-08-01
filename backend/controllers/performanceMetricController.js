import PerformanceMetric from "../models/PerformanceMetric.js";

export const ajouterPerformanceMetric = async (req, res) => {
    try {
        const newPerformanceMetric = new PerformanceMetric(req.body);
        await newPerformanceMetric.save();
        res.status(201).json({ message: "PerformanceMetric ajouté avec succès", performanceMetric: newPerformanceMetric });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout du PerformanceMetric", error: err.message });
    }
};

export const listerPerformanceMetrics = async (req, res) => {
    try {
        const performanceMetrics = await PerformanceMetric.find();
        res.status(200).json(performanceMetrics);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des PerformanceMetrics", error: err.message });
    }
};

export const getbyIdPerformanceMetric = async (req, res) => {
    try {
        const performanceMetric = await PerformanceMetric.findById(req.params.id);
        if (!performanceMetric) {
            return res.status(404).json({ message: "PerformanceMetric non trouvé" });
        }
        res.status(200).json(performanceMetric);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du PerformanceMetric", error: err.message });
    }
};

export const updatePerformanceMetric = async (req, res) => {
    try {
        const updatePerformanceMetric = await PerformanceMetric.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatePerformanceMetric) {
            return res.status(404).json({ message: "PerformanceMetric non trouvé" });
        }
        res.status(200).json(updatePerformanceMetric);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du PerformanceMetric", error: err.message });
    }
};

export const deletePerformanceMetric = async (req, res) => {
    try {
        const deletePerformanceMetric = await PerformanceMetric.findByIdAndDelete(req.params.id);
        if (!deletePerformanceMetric) {
            return res.status(404).json({ message: "PerformanceMetric non trouvé" });
        }
        res.status(200).json({ message: "PerformanceMetric supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression du PerformanceMetric", error: err.message });
    }
};