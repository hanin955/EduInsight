import recommendation from "../models/Recommendation.js";

export const ajouterRecommendation = async (req, res) => {
    try {
        const newRecommendation = new recommendation(req.body);
        await newRecommendation.save();
        res.status(201).json(newRecommendation);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la recommandation", error: err.message });
    }
};

export const listerRecommendations = async (req, res) => {
    try {
        const recommendations = await recommendation.find().sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations", error: err.message });
    }
};

export const listerRecommendationsByStudent = async (req, res) => {
    try {
        const recommendations = await recommendation.find({ student: req.params.studentId }).sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations de l'étudiant", error: err.message });
    }
};

export const getbyIdRecommendation = async (req, res) => {
    try {
        const foundRecommendation = await recommendation.findById(req.params.id);
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
        const updatedRecommendation = await recommendation.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedRecommendation = await recommendation.findByIdAndDelete(req.params.id);
        if (!deletedRecommendation) {
            return res.status(404).json({ message: "Recommandation non trouvée" });
        }
        res.status(200).json({ message: "Recommandation supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la recommandation", error: err.message });
    }
};