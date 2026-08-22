import mongoose from "mongoose";
import User from "./User.js";
const studentSchema = new mongoose.Schema({
    level: { type: String, enum: ["L1", "L2", "L3", "M1", "M2"] },
    group: String,
    departement: { type: mongoose.Schema.Types.ObjectId, ref: "departement" },
    enrollmentDate: { type: Date, default: Date.now },
    speciality: { type: String, required: true },
    studentCode: { type: String, unique: true, required: true },
});
export default User.discriminator("student", studentSchema);