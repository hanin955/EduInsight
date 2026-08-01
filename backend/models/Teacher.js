import mongoose from "mongoose";
import User from "./User.js";
const TeacherSchema = new mongoose.Schema({
    speciality :{type : String , required :true},
    office: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "departement" },
    hireDate : {type : Date, defaulte : Date.now},
});
export default User.discriminator("teacher",TeacherSchema);