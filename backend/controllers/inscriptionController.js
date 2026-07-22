const inscription = require("../models/Inscription.js");
exports.ajouterInscription = async(req,res)=>{
    try{
        const newInscription = new inscription(req.body);
        await newInscription.save();
        res.status(201).json(newInscription);
    }catch(err){
        res.status(400).json({message: "Erreur lors de l'ajout de l'inscription", error: err.message});
    }
};
exports.listerInscriptions = async(req,res)=>{
    try{
        const inscriptions = await inscription.find();
        res.status(200).json(inscriptions);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération des inscriptions", error: err.message});
    }
};
exports.getbyIdInscription = async(req,res)=>{
    try{
        const foundInscription = await inscription.findById(req.params.id);
        if(!foundInscription){
            return res.status(404).json({message: "Inscription non trouvée"});
        }
        res.status(200).json(foundInscription);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la récupération de l'inscription", error: err.message});
    }
};
exports.updateInscription = async(req,res)=>{
    try{
        const updatedInscription = await inscription.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!updatedInscription){
            return res.status(404).json({message: "Inscription non trouvée"});
        }
        res.status(200).json(updatedInscription);
    }catch(err){
        res.status(500).json({message: "Erreur lors de la mise à jour de l'inscription", error: err.message});
    }
};
exports.deleteInscription = async(req,res)=>{
    try{
        const deletedInscription = await inscription.findByIdAndDelete(req.params.id);
        if(!deletedInscription){
            return res.status(404).json({message: "Inscription non trouvée"});
        }
        res.status(200).json({message: "Inscription supprimée avec succès"});
    }catch(err){
        res.status(500).json({message: "Erreur lors de la suppression de l'inscription", error: err.message});
    }
};