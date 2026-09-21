import mongoose from "mongoose";
const quizAttemptSchema = new mongoose.Schema({
    student : {type: mongoose.Schema.Types.ObjectId, ref: "User", required : true},
    quiz : {type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required : true},
    score : {type: Number,default : 0},
    totalQuestions : {type: Number,default : 0},
    totalPoints : {type: Number, default: 0},
    percentage : {type: Number, default: 0},
    startedAt : {type: Date,default : Date.now},
    submittedAt : Date,
    duration : Number,
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'expired'],
        default: 'in_progress'
    }
}, {timestamps: true});
export default mongoose.model("QuizAttempt", quizAttemptSchema);