import question from "../models/Question.js";

export const ajouterQuestion = async (req, res) => {
    try {
        const newQuestion = new question(req.body);
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la question", error: err.message });
    }
};

export const listerQuestions = async (req, res) => {
    try {
        const questions = await question.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des questions", error: err.message });
    }
};

export const getbyIdQuestion = async (req, res) => {
    try {
        const foundQuestion = await question.findById(req.params.id);
        if (!foundQuestion) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.status(200).json(foundQuestion);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la question", error: err.message });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la question", error: err.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.status(200).json({ message: "Question supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la question", error: err.message });
    }
};