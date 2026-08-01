import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: "user",required: true},
    title : {type: String, required: true},
    message : {type: String, required: true},
    type : String,
    isRead : {type: Boolean},
    confidenceScore: {type : Number,default: 0}
}, {timestamps: {createdAt: true, updatedAt: false}});
export default mongoose.model("notification", notificationSchema);