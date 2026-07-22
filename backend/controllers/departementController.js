const departement = require("../models/Department.js");
exports.ajouterDepartement = async(req,res)=>{
    try{
        const newDepartement = new departement(req.body);
        await newDepartement.save();
        res.status(201).json(newDepartement);
    }catch(err){
        res.status(400).json({message : "erreur lors de l\'ajout du departement", error : err.message});
    }
};
exports.listerDepartements = async(req,res)=>{
    try{
        const departements = await departement.find();
        res.status(200).json(departements);
    }catch(err){
        res.status(404).json({message : "erreur lors de la récupération des departements"});
    }
};
exports.getbyIdDepatement = async(req,res) =>{
    try{
        const Departement = await departement.findById(req.params.id);
        if(!Departement){
            return res.status(404).json({message : "Departement non trouvé"});
        }
        res.status(200).json(Departement);
    }catch(err){
        res.status(404).json({message : "erreur lors de la récupération du departement"});
    }
};
exports.updateDepartement = async(req,res)=>{
    try{
        const updateDepartement = await departement.findByIdAndUpdate(req.params.id,req.body,{new:true,runvalidators :true});
        if(!updateDepartement){
            return res.status(404).json({message :"Departement non trouvé"});
        }
        res.status(200).json(updateDepartement);
    }catch(err){
        res.status(500).json({message : "erreur lors de la mise à jour du departement"});
    }
};
exports.deleteDepartement = async(req,res)=>{
    try{
        const deletpartement = await departement.findByIdAndDelete(req.params.id);
        if(!deletpartement){
            return res.status(404).json({message :"Departement non trouvé"});
        }
        res.status(200).json({message : "Departement supprimé avec succès"});
    }catch(err){
        res.status(500).json({message : "erreur lors de la suppression du departement"});
    }
};



