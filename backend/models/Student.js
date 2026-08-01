const mongoose = require ("mongoose");
import User from "./User.js";
const studentSchema = mongoose.Schema({
    studentCode :{type : String,required : true, unique : true , maxlenght: 10, minlenght :5},
    level :{type : String, enum :["L1","L2","L3","M1","M2"]},
    group : String,
    departement : {type : mongoose.Schema.Types.ObjectId,ref : "departement"},
    errollmentDate :{type : Date,default : Date.now},
})
module.exports= User.discriminator("student",studentSchema);