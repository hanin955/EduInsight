const mongoose = require("mongoose");
const User = require("./User");
const TeacherSchema = new mongoose.Schema({
    speciality :{type : String , required :true},
    office: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "departement" },
    hireDate : {type : Date, defaulte : Date.now},
});
module.exports = User.discriminator("teacher",TeacherSchema);