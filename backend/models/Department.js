import mongoose from "mongoose";
import User from "../models/User.js";
const departementSchema = new mongoose.Schema({
    name : String,
    description : String,
},{timestamps :true});
export default mongoose.model("Department", departementSchema);