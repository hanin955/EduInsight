import mongoose from "mongoose";
const inscriptionSchema = new mongoose.Schema({
    student : {type: mongoose.Schema.Types.ObjectId, ref: "User",required : true},
    course : {type: mongoose.Schema.Types.ObjectId, ref: "Course",required : true},
    enrolledAt : {type: Date, default: Date.now},
    status : {type: String, enum: ["active", "completed", "dropped"], default: "active"}
},{timestamps : true});
export default mongoose.model("inscription", inscriptionSchema);