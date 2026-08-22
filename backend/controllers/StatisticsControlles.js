import mongoose from "mongoose";
import DashboardData from "../models/DashboardData.js";
import User from "../models/User.js";
export const filterFromQuery = (query) => {
    const filter = {};
    if (query.user) filter.user = new mongoose.Types.ObjectId(query.user);
    if (query.averageScore) filter.averageScore = Number(query.averageScore);
    return filter;
};
export const getPlatformGrowth = async (req, res) => {
    try {
        const data = await User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, month: "$_id", count: 1 } }
        ]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getCourseCompletion = async (req, res) => {
    try {
        const filter = filterFromQuery(req.query);
        const data = await DashboardData.aggregate([
            { $match: filter },
            {
                $addFields: {
                    status: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$progress", 100] }, then: "Completed" },
                                { case: { $eq: ["$progress", 0] }, then: "Not Started" },
                            ],
                            default: "In Progress"
                        }
                    }
                }
            },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { _id: 0, status: "$_id", count: 1 } }
        ]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getDashboardStatistics = async (req, res) => {
    try {
        const filter = filterFromQuery(req.query);
        const [summary] = await DashboardData.aggregate([
            { $match: filter },
            { $group: { _id: null, totalStudents: { $sum: 1 }, averageScore: { $avg: "$averageScore" }, averageAttendance: { $avg: "$attendanceRate" }, averageProgress: { $avg: "$progress" } } },
            { $project: { _id: 0, totalStudents: 1, averageScore: { $round: ["$averageScore", 2] }, averageAttendance: { $round: ["$averageAttendance", 2] }, averageProgress: { $round: ["$averageProgress", 2] } } }
        ]);
        res.json({
            success: true,
            data: summary || { totalStudents: 0, averageScore: 0, averageAttendance: 0, averageProgress: 0 }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getStudentByGrade = async (req, res) => {
    try {
        const data = await DashboardData.aggregate([
            { $match: filterFromQuery(req.query) },
            { $addFields: { grade: { $switch: { branches: [
                { case: { $gte: ["$averageScore", 90] }, then: "A" },
                { case: { $gte: ["$averageScore", 80] }, then: "B" },
                { case: { $gte: ["$averageScore", 70] }, then: "C" },
                { case: { $gte: ["$averageScore", 60] }, then: "D" },
            ], default: "F" } } } },
            ...(req.query.grade ? [{ $match: { grade: req.query.grade } }] : []),
            { $group: { _id: "$grade", count: { $sum: 1 } } },
            { $project: { _id: 0, grade: "$_id", count: 1 } },
            { $sort: { grade: 1 } }
        ]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getUserByrole = async (req, res) => {
    try {
        const data = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $project: { _id: 0, role: "$_id", count: 1 } },
            { $sort: { role: 1 } }
        ]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};