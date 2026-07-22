const answer = require("../models/Answer.js");
exports.ajouterAnswer = async(req,res)=>{
    try{
        const newAnswer = new answer(req.body);
        await newAnswer.save();
        res.status(201).json(newAnswer);
    }catch(err){
        res.status(400).json({message: "Erreur lors de l'ajout de la réponse", error: err.message});
    }
};
exports.listerAnswers = async(req,res)=>{
    try{
        const answers = await answer.find();
        res.status(200).json(answers);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération des réponses", error: err.message});
    }
};
exports.getbyIdAnswer = async(req,res)=>{
    try{
        const foundAnswer = await answer.findById(req.params.id);
        if(!foundAnswer){
            return res.status(404).json({message: "Réponse non trouvée"});
        }
        res.status(200).json(foundAnswer);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération de la réponse", error: err.message});
    }
};
exports.updateAnswer = async(req,res)=>{
    try{
        const updatedAnswer = await answer.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!updatedAnswer){
            return res.status(404).json({message: "Réponse non trouvée"});
        }
        res.status(200).json(updatedAnswer);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la mise à jour de la réponse", error: err.message});
    }
};
exports.deleteAnswer = async(req,res)=>{
    try{
        const deletedAnswer = await answer.findByIdAndDelete(req.params.id);
        if(!deletedAnswer){
            return res.status(404).json({message: "Réponse non trouvée"});
        }
        res.status(200).json({message: "Réponse supprimée avec succès"});
    }catch(err){
        res.status(500).json({message: "Erreur lors de la suppression de la réponse", error: err.message});
    }
};
