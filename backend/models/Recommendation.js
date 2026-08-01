import mongoose from "mongoose";
const recommendationSchema = new mongoose.Schema({
    student : {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    message : {type: String,required: true},
    type : String,
    confidenceScore : {type: Number,default: 0}
}, {timestamps: {createdAt: true, updatedAt: false}});
export default mongoose.model("recommendation", recommendationSchema);