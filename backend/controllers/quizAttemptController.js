import QuizAttempt from "../models/QuizAttempt.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Choice from "../models/Choice.js";

export const ajouterQuizAttempt = async (req, res) => {
    try {
        const newAttempt = new QuizAttempt(req.body);
        await newAttempt.save();
        res.status(201).json(newAttempt);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de la création de la tentative", error: err.message });
    }
};

export const listerQuizAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find();
        res.status(200).json(attempts);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des tentatives", error: err.message });
    }
};

export const getbyIdQuizAttempt = async (req, res) => {
    try {
        const foundAttempt = await QuizAttempt.findById(req.params.id);
        if (!foundAttempt) {
            return res.status(404).json({ message: "Tentative non trouvée" });
        }
        res.status(200).json(foundAttempt);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la tentative", error: err.message });
    }
};

export const updateQuizAttempt = async (req, res) => {
    try {
        const updatedAttempt = await QuizAttempt.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAttempt) {
            return res.status(404).json({ message: "Tentative non trouvée" });
        }
        res.status(200).json(updatedAttempt);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la tentative", error: err.message });
    }
};

export const deleteQuizAttempt = async (req, res) => {
    try {
        const deletedAttempt = await QuizAttempt.findByIdAndDelete(req.params.id);
        if (!deletedAttempt) {
            return res.status(404).json({ message: "Tentative non trouvée" });
        }
        res.status(200).json({ message: "Tentative supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la tentative", error: err.message });
    }
};

export const takeQuiz = async (req, res, next) => {
    try {
        const attempt = await QuizAttempt.create({ student: req.user.id, quiz: req.params.quizId });
        res.status(201).json({ success: true, data: attempt });
    } catch (error) { next(error); }
};

export const submitAnswers = async (req, res, next) => {
    try {
        const { attemptId } = req.params;
        const { answers } = req.body;
        const attempt = await QuizAttempt.findById(attemptId);
        let totalScore = 0;
        for (const item of answers) {
            const question = await Question.findById(item.questionId);
            let isCorrect = false;
            let pointsEarned = 0;
            if (question.type === 'MCQ' || question.type === 'TrueFalse') {
                const correctChoice = await Choice.findOne({ question: question._id, isCorrect: true });
                if (correctChoice && correctChoice._id.toString() === item.selectedChoiceId) {
                    isCorrect = true;
                    pointsEarned = question.points;
                }
            }
            totalScore += pointsEarned;
            await Answer.create({
                attempt: attempt._id,
                question: question._id,
                selectedChoice: item.selectedChoiceId,
                textAnswer: item.textAnswer,
                isCorrect,
                pointsEarned
            });
        }
        attempt.score = totalScore;
        attempt.submittedAt = new Date();
        attempt.duration = Math.floor((attempt.submittedAt - attempt.startedAt) / 1000);
        await attempt.save();
        res.status(200).json({ success: true, score: attempt.score });
    } catch (error) { next(error); }
};