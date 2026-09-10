import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import departementRoutes from "./routes/departementRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import quizAttemptRoutes from "./routes/quizAttemptRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import choiceRoutes from "./routes/choiceRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import performanceMetricRoutes from "./routes/performanceMetricRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
const CLIENT_URL = process.env.CLIENT_URL || '*';
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Health check for hosting platforms
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/chat', chatRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use("/admin", adminRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departements", departementRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quizattempts", quizAttemptRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/choices", choiceRoutes);
app.use("/api/auditlogs", auditLogRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/performancemetrics", performanceMetricRoutes);
app.use("/api/documents", documentRoutes);
// Serve frontend in production when a build exists
if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(process.cwd(), '..', 'frontend', 'dist');
    if (fs.existsSync(frontendDist)) {
        app.use(express.static(frontendDist));
        // Serve SPA index.html for non-API GET requests (avoid path-to-regexp patterns)
        app.use((req, res, next) => {
            if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
                return res.sendFile(path.join(frontendDist, 'index.html'));
            }
            next();
        });
    } else {
        console.warn(`Frontend build not found at ${frontendDist} — skipping static file serving.`);
    }
}
app.use((err, req, res, next) => {
    console.error("Erreur globale interceptée:", err);
    res.status(500).json({ message: err.message || "Erreur serveur inattendue" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server lancé sur http://localhost:${PORT}`);
});