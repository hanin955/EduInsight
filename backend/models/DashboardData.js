const mongoose = require("mongoose");
const dashboardDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalCourses: {
        type: Number,
        default: 0,
    },
    averageScore: {
        type: Number,
        default: 0,
    },
    attendanceRate: {
        type: Number,
        default: 0,
    },
    progress: {
        type: Number,
        default: 0,
    },
    rank: {
        type: Number,
        default: 0,
    },
});
module.exports = mongoose.model("DashboardData", dashboardDataSchema);