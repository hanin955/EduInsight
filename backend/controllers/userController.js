const User = require('../models/User.js');
exports.ajouterUtilisateur = async(req,res) => {
    try { const {firstName,lastName,email,password,role,phone,avatar,isActive} = req.body;
        const nouvelUser = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            phone,
            avatar : req.file ? req.file.filename : null,
            isActive
        });
        await nouvelUser.save();
        res.status(201).json({message : "Utilisateur ajouté avec succès",User : nouvelUser});
    }catch(err){
        res.status(400).json({message : "Erreur lors de l'ajout de l'utilisateur", error : err.message});
    }
};
exports.listerUtilisateurs = async(req,res) =>{
    try{
        const Users = await User.find();
        res.status(200).json(Users);
    }catch(err){
        res.status(500).json({error : err.message});
    }
};
exports.getUtilisateurById = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message : "Utilisateur non trouvé"});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message : "Erreur lors de la récupération de l'utilisateur", error : err.message});
    }
};
exports.updateUtilisateur = async(req,res) =>{
    try{
        const updatedUtilisateur = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!updatedUtilisateur){
            return res.status(404).json({message : "Utilisateur non trouvé"});
        }
        res.status(200).json(updatedUtilisateur);
    }catch(err){
        res.status(500).json({message : "Erreur lors de la mise à jour de l'utilisateur", error : err.message});
    }
};
exports.deleteUtilisateur = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (err) {
    res.status(500).json({ message: "Erreur de suppression", error: err.message });
    }
};

