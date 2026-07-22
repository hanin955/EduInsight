const { QuizAttempt, Answer } = require('../models/QuizAttempt.js');
const { Question, Choice } = require('../models/Quiz.js');
exports.ajouterQuizAttempt = async(req,res)=>{
    try{
        const newAttempt = new quizAttempt(req.body);
        await newAttempt.save();
        res.status(201).json(newAttempt);
    }catch(err){
        res.status(400).json({message: "Erreur lors de la création de la tentative", error: err.message});
    }
};
exports.listerQuizAttempts = async(req,res)=>{
    try{
        const attempts = await quizAttempt.find();
        res.status(200).json(attempts);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération des tentatives", error: err.message});
    }
};
exports.getbyIdQuizAttempt = async(req,res)=>{
    try{
        const foundAttempt = await quizAttempt.findById(req.params.id);
        if(!foundAttempt){
            return res.status(404).json({message: "Tentative non trouvée"});
        }
        res.status(200).json(foundAttempt);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération de la tentative", error: err.message});
    }
};
exports.updateQuizAttempt = async(req,res)=>{
    try{
        const updatedAttempt = await quizAttempt.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!updatedAttempt){
            return res.status(404).json({message: "Tentative non trouvée"});
        }
        res.status(200).json(updatedAttempt);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la mise à jour de la tentative", error: err.message});
    }
};
exports.deleteQuizAttempt = async(req,res)=>{
    try{
        const deletedAttempt = await quizAttempt.findByIdAndDelete(req.params.id);
        if(!deletedAttempt){
            return res.status(404).json({message: "Tentative non trouvée"});
        }
        res.status(200).json({message: "Tentative supprimée avec succès"});
    }catch(err){
        res.status(500).json({message: "Erreur lors de la suppression de la tentative", error: err.message});
    }
};
exports.takeQuiz = async (req, res, next) => {
    try {
        const attempt = await QuizAttempt.create({ student: req.user.id, quiz: req.params.quizId });
        res.status(201).json({ success: true, data: attempt });
    } catch (error) { next(error); }
};
exports.submitAnswers = async (req, res, next) => {
    try {
        const { attemptId } = req.params;
        const { answers } = req.body; // Array of { questionId, selectedChoiceId, textAnswer }
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

