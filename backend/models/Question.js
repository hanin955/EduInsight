import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
    quiz : {type: mongoose.Schema.Types.ObjectId, ref: "quiz",required : true },
    statement : {type: String,required : true },
    type : {type: String, enum: ["MCQ", "TrueFalse", "ShortAnswer"],required : true},
    points : {type: Number,dafault : 1},
    order :{type : Number, dafault : 0}
}, {timestamps: true});
export default mongoose.model("question", questionSchema);