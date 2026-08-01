import mongoose from "mongoose";
const answerSchema = new mongoose.Schema({
    attempt : {type: mongoose.Schema.Types.ObjectId, ref: "QuizAttempt",required : true},
    question : {type: mongoose.Schema.Types.ObjectId, ref: "Question",required : true},
    selectedChoice : {type: mongoose.Schema.Types.ObjectId, ref: "Choice"},
    textAnswer : String,
    isCorrect : {type: Boolean,default : false},
    pointsEarned : {type: Number, default: 0}
},{timestamps: true});
export default mongoose.model("Answer", answerSchema);