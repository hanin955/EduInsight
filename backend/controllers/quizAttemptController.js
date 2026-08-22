import QuizAttempt from "../models/QuizAttempt.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Choice from "../models/Choice.js";
import Quiz from "../models/Quiz.js";

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
    } catch (error) {
        console.error("Erreur dans takeQuiz:", error);
        next(error);
    }
};

export const submitAnswers = async (req, res, next) => {
    try {
        const { attemptId } = req.params;
        const { answers } = req.body;

        const attempt = await QuizAttempt.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({ message: "Tentative non trouvée" });
        }
        if (attempt.status === 'expired') {
            return res.status(400).json({ message: "Cette tentative a expiré, soumission refusée." });
        }
        if (attempt.submittedAt) {
            return res.status(400).json({ message: "Cette tentative a déjà été soumise." });
        }

        const quiz = await Quiz.findById(attempt.quiz);
        if (quiz && quiz.duration) {
            const elapsedSeconds = (Date.now() - attempt.startedAt.getTime()) / 1000;
            const allowedSeconds = quiz.duration * 60;
            if (elapsedSeconds > allowedSeconds) {
                attempt.status = 'expired';
                attempt.submittedAt = new Date();
                attempt.duration = Math.floor(elapsedSeconds);
                await attempt.save();
                return res.status(400).json({
                    message: "Temps écoulé. Cette tentative a été marquée comme expirée.",
                    expired: true
                });
            }
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: "Le champ 'answers' doit être un tableau" });
        }

        const allQuestions = await Question.find({ quiz: attempt.quiz });
        const totalPossiblePoints = allQuestions.reduce((sum, q) => sum + (q.points || 0), 0);

        let totalScore = 0;
        for (const item of answers) {
            const question = await Question.findById(item.questionId);
            if (!question) {
                console.warn("Question introuvable pour l'id :", item.questionId);
                continue;
            }

            let isCorrect = false;
            let pointsEarned = 0;

            if (question.type === 'MCQ' || question.type === 'TrueFalse') {
                const correctChoice = await Choice.findOne({ question: question._id, isCorrect: true });
                if (correctChoice && item.selectedChoiceId && correctChoice._id.toString() === item.selectedChoiceId) {
                    isCorrect = true;
                    pointsEarned = question.points || 0;
                }
            }

            totalScore += pointsEarned;

            await Answer.create({
                attempt: attempt._id,
                question: question._id,
                selectedChoice: item.selectedChoiceId || null,
                textAnswer: item.textAnswer,
                isCorrect,
                pointsEarned
            });
        }

        const percentage = totalPossiblePoints > 0
            ? Math.round((totalScore / totalPossiblePoints) * 100)
            : 0;

        attempt.score = totalScore;
        attempt.totalPoints = totalPossiblePoints;
        attempt.percentage = percentage;
        attempt.submittedAt = new Date();
        attempt.duration = Math.floor((attempt.submittedAt - attempt.startedAt) / 1000);
        attempt.status = 'completed';

        await attempt.save();

        res.status(200).json({
            success: true,
            score: attempt.score,
            totalPoints: attempt.totalPoints,
            percentage: attempt.percentage
        });
    } catch (error) {
        console.error("Erreur dans submitAnswers:", error);
        next(error);
    }
};

export const expireAttempt = async (req, res, next) => {
    try {
        const attempt = await QuizAttempt.findById(req.params.attemptId);
        if (!attempt) {
            return res.status(404).json({ message: "Tentative non trouvée" });
        }
        if (attempt.submittedAt) {
            return res.status(200).json({ success: true, data: attempt });
        }
        attempt.status = 'expired';
        attempt.submittedAt = new Date();
        attempt.duration = Math.floor((attempt.submittedAt - attempt.startedAt) / 1000);
        await attempt.save();
        res.status(200).json({ success: true, data: attempt });
    } catch (error) {
        console.error("Erreur dans expireAttempt:", error);
        next(error);
    }
};