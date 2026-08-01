import choice from "../models/Choice.js";

export const ajouterChoice = async (req, res) => {
    try {
        const newChoice = new choice(req.body);
        await newChoice.save();
        res.status(201).json(newChoice);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout du choix", error: err.message });
    }
};

export const listerChoices = async (req, res) => {
    try {
        const choices = await choice.find();
        res.status(200).json(choices);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des choix", error: err.message });
    }
};

export const getbyIdChoice = async (req, res) => {
    try {
        const foundChoice = await choice.findById(req.params.id);
        if (!foundChoice) {
            return res.status(404).json({ message: "Choix non trouvé" });
        }
        res.status(200).json(foundChoice);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du choix", error: err.message });
    }
};

export const updateChoice = async (req, res) => {
    try {
        const updatedChoice = await choice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedChoice) {
            return res.status(404).json({ message: "Choix non trouvé" });
        }
        res.status(200).json(updatedChoice);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du choix", error: err.message });
    }
};

export const deleteChoice = async (req, res) => {
    try {
        const deletedChoice = await choice.findByIdAndDelete(req.params.id);
        if (!deletedChoice) {
            return res.status(404).json({ message: "Choix non trouvé" });
        }
        res.status(200).json({ message: "Choix supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression du choix", error: err.message });
    }
};