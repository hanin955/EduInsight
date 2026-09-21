import mongoose from "mongoose";
const quizSchema = new mongoose.Schema({
    course : {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
    title : {type: String,required: true},
    description : String,
    duration : {type: Number},
    passingScore : {type: Number, default : 50},
    isPublished : {type: Boolean,default: false},
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
}, {timestamps: true});
export default mongoose.model("Quiz", quizSchema);