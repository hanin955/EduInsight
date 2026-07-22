const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
    course : {type: mongoose.Schema.Types.ObjectId, ref: "course", required: true},
    title : {type: String,required: true},
    description : String,
    duration : {type: Number},
    passingScore : {type: Number, default : 50},
    isPublished : {type: Boolean,default: false},
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: "user"},
}, {timestamps: true});
module.exports = mongoose.model("quiz", quizSchema);