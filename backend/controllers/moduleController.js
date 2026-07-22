const moduleModel = require("../models/Module.js");
const lesson = require("../models/Lesson.js");
exports.ajouterModule = async(req,res)=>{
    try{
        const newModule = new moduleModel(req.body);
        await newModule.save();
        res.status(201).json(newModule);
    }catch(err){
        res.status(400).json({message: "Erreur lors de l'ajout du module", error: err.message});
    }
};
exports.listerModules = async(req,res)=>{
    try{
        const modules = await moduleModel.find();
        res.status(200).json(modules);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération des modules", error: err.message});
    }
};
exports.getbyIdModule = async(req,res)=>{
    try{
        const foundModule = await moduleModel.findById(req.params.id);
        if(!foundModule){
            return res.status(404).json({message: "Module non trouvé"});
        }
        res.status(200).json(foundModule);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération du module", error: err.message});
    }
};
exports.updateModule = async(req,res)=>{
    try{
        const updatedModule = await moduleModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!updatedModule){
            return res.status(404).json({message: "Module non trouvé"});
        }
        res.status(200).json(updatedModule);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la mise à jour du module", error: err.message});
    }
};
exports.deleteModule = async(req,res)=>{
    try{
        const deletedModule = await moduleModel.findByIdAndDelete(req.params.id);
        if(!deletedModule){
            return res.status(404).json({message: "Module non trouvé"});
        }
        // Supprime aussi les leçons liées à ce module
        await lesson.deleteMany({module: req.params.id});
        res.status(200).json({message: "Module supprimé avec succès"});
    }catch(err){
        res.status(500).json({message: "Erreur lors de la suppression du module", error: err.message});
    }
};
