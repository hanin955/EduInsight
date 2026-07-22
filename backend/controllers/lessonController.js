const lesson = require("../models/Lesson.js");
exports.ajouterLesson = async(req,res)=>{
    try{
        const newLesson = new lesson(req.body);
        await newLesson.save();
        res.status(201).json(newLesson);
    }catch(err){
        res.status(400).json({message: "Erreur lors de l'ajout de la leçon", error: err.message});
    }
};
exports.listerLessons = async(req,res)=>{
    try{
        const lessons = await lesson.find();
        res.status(200).json(lessons);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération des leçons", error: err.message});
    }
};
exports.getbyIdLesson = async(req,res)=>{
    try{
        const foundLesson = await lesson.findById(req.params.id);
        if(!foundLesson){
            return res.status(404).json({message: "Leçon non trouvée"});
        }
        res.status(200).json(foundLesson);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération de la leçon", error: err.message});
    }
};
exports.updateLesson = async(req,res)=>{
    try{
        const updatedLesson = await lesson.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!updatedLesson){
            return res.status(404).json({message: "Leçon non trouvée"});
        }
        res.status(200).json(updatedLesson);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la mise à jour de la leçon", error: err.message});
    }
};
exports.deleteLesson = async(req,res)=>{
    try{
        const deletedLesson = await lesson.findByIdAndDelete(req.params.id);
        if(!deletedLesson){
            return res.status(404).json({message: "Leçon non trouvée"});
        }
        res.status(200).json({message: "Leçon supprimée avec succès"});
    }catch(err){
        res.status(500).json({message: "Erreur lors de la suppression de la leçon", error: err.message});
    }
};