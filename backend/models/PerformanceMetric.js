const mongoose = require("mongoose");
const performanceSchema = new mongoose.Schema({
    student : {type: mongoose.Schema.Types.ObjectId, ref: "user",required : true},
    course : {type: mongoose.Schema.Types.ObjectId, ref: "Course",required : true},
    weekName : String,
    quizScoreAverage : {type: Number,default: 0},
    attendanceRate : {type: Number,default: 0},
},{timestamps: {createdAt: true, updatedAt: false}});

module.exports = mongoose.model("PerformanceMetric", performanceSchema);