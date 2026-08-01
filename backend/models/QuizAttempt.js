import mongoose from "mongoose";
const quizAttemptSchema = new mongoose.Schema({
    student : {type: mongoose.Schema.Types.ObjectId, ref: "user",required : true},
    quiz : {type: mongoose.Schema.Types.ObjectId, ref: "quiz",required : true},
    score : {type: Number,default : 0},
    totalQuestions : {type: Number,default : 0},
    startedAt : {type: Date,default : Date.now},
    submittedAt : Date,
    duration : Number 
}, {timestamps: true});
export default mongoose.model("quizAttempt", quizAttemptSchema);