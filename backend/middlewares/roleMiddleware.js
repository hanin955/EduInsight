const user = require("../models/User");
const authorize = (roles =[])=>{ // roles = [] : un tableau des rôles autorisés avec [] par defaut
    return(req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message : "Accès refusé"});
        }
        next();
    };
};
module.exports = authorize;