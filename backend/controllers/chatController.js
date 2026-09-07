import mongoose from "mongoose";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Inscription from "../models/Inscription.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { generateChatResponse } from "../services/aiService.js";

export const chat = async (req, res) => {
  const { message, studentId } = req.body;
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ success: false, message: 'Le message est obligatoire.' });
  if (message.trim().length > 1000) return res.status(400).json({ success: false, message: 'Le message est trop long.' });
  if (!mongoose.isValidObjectId(studentId)) return res.status(400).json({ success: false, message: 'Identifiant étudiant invalide.' });

  const student = await Student.findById(studentId).lean();
  if (!student) return res.status(404).json({ success: false, message: 'Étudiant introuvable.' });

  const courses = await Course.find({}).select('title description level duration').lean();
  const coursesById = new Map(courses.map((c) => [String(c._id), c]));

  const inscriptions = await Inscription.find({ student: studentId }).lean();

  const quizAttempts = await QuizAttempt.find({ student: studentId, status: 'completed' })
    .select('score totalPoints percentage submittedAt')
    .lean();

  const enrolledCourseIds = inscriptions.map((i) => String(i.course));
  const avgPercentage = quizAttempts.length
    ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.percentage || 0), 0) / quizAttempts.length)
    : null;

  const statistics = {
    level: student.level,
    group: student.group,
    speciality: student.speciality,
    enrolledCourses: inscriptions.map((i) => {
      const course = coursesById.get(String(i.course));
      return { name: course?.title || 'Cours inconnu', level: course?.level, status: i.status };
    }),
    quizCount: quizAttempts.length,
    avgPercentage
  };

  const answer = await generateChatResponse({
    message: message.trim(),
    student,
    courses,
    enrolledCourseIds,
    statistics
  });
  res.json({ success: true, message: answer });
};