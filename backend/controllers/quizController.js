const quiz = require("../models/Quiz.js");
exports.ajouterQuiz = async(req,res)=>{
    try{
        const newQuiz = new quiz(req.body);
        await newQuiz.save();
        res.status(201).json(newQuiz);
    }catch(err){
        res.status(400).json({message: "Erreur lors de l'ajout du quiz", error: err.message});
    }
};
exports.listerQuiz = async(req,res)=>{
    try{
        const quizzes = await quiz.find();
        res.status(200).json(quizzes);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération des quiz", error: err.message});
    }
};
exports.getbyIdQuiz = async(req,res)=>{
    try{
        const foundQuiz = await quiz.findById(req.params.id);
        if(!foundQuiz){
            return res.status(404).json({message: "Quiz non trouvé"});
        }
        res.status(200).json(foundQuiz);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération du quiz", error: err.message});
    }
};
exports.updateQuiz = async(req,res)=>{
    try{
        const updatedQuiz = await quiz.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!updatedQuiz){
            return res.status(404).json({message: "Quiz non trouvé"});
        }
        res.status(200).json(updatedQuiz);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la mise à jour du quiz", error: err.message});
    }
};
exports.deleteQuiz = async(req,res)=>{
    try{
        const deletedQuiz = await quiz.findByIdAndDelete(req.params.id);
        if(!deletedQuiz){
            return res.status(404).json({message: "Quiz non trouvé"});
        }
        res.status(200).json({message: "Quiz supprimé avec succès"});
    }catch(err){
        res.status(500).json({message: "Erreur lors de la suppression du quiz", error: err.message});
    }
};
exports.publishQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, { isPublished: true }, { new: true });
        res.status(200).json({ success: true, data: quiz });
    } catch (error) { next(error); }
};
exports.addQuestion = async (req, res, next) => {
    try {
        const { choices, ...questionData } = req.body;
        const question = await Question.create({ ...questionData, quiz: req.params.quizId });
    if (choices && choices.length > 0) {
        const choiceDocs = choices.map(c => ({ ...c, question: question._id }));
        await Choice.insertMany(choiceDocs);
    }

    res.status(201).json({ success: true, data: question });
    } catch (error) { next(error); }
};


