import fs from "fs";
import path from "path";
import lesson from "../models/Lesson.js";

export const ajouterLesson = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (req.file) {
            payload.pdfUrl = `lessons/${req.file.filename}`;
        }
        const newLesson = new lesson(payload);
        await newLesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ message: "Erreur lors de l'ajout de la leçon", error: err.message });
    }
};

export const listerLessons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.module) {
            filter.module = req.query.module;
        }

        const lessons = await lesson.find(filter).sort({ order: 1 }).skip(skip).limit(limit);
        const totalLessons = await lesson.countDocuments(filter);

        res.status(200).json({
            lessons,
            totalLessons,
            page,
            totalPages: Math.ceil(totalLessons / limit),
            limit,
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des leçons", error: err.message });
    }
};
export const listerToutesLesLecons = async (req, res) => {
    try {
        const filter = {};
        if (req.query.module) {
            filter.module = req.query.module;
        }
        const lessons = await lesson.find(filter).sort({ order: 1 });
        res.status(200).json(lessons);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des leçons", error: err.message });
    }
};

export const getbyIdLesson = async (req, res) => {
    try {
        const foundLesson = await lesson.findById(req.params.id);
        if (!foundLesson) {
            return res.status(404).json({ message: "Leçon non trouvée" });
        }
        res.status(200).json(foundLesson);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la leçon", error: err.message });
    }
};

export const updateLesson = async (req, res) => {
    try {
        const payload = { ...req.body };

        if (req.file) {
            const existingLesson = await lesson.findById(req.params.id);
            if (existingLesson?.pdfUrl) {
                const oldPath = path.join(process.cwd(), "uploads", existingLesson.pdfUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            payload.pdfUrl = `lessons/${req.file.filename}`;
        }

        const updatedLesson = await lesson.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
        if (!updatedLesson) {
            return res.status(404).json({ message: "Leçon non trouvée" });
        }
        res.status(200).json(updatedLesson);
    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: "Erreur lors de la mise à jour de la leçon", error: err.message });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const deletedLesson = await lesson.findByIdAndDelete(req.params.id);
        if (!deletedLesson) {
            return res.status(404).json({ message: "Leçon non trouvée" });
        }
        if (deletedLesson.pdfUrl) {
            const filePath = path.join(process.cwd(), "uploads", deletedLesson.pdfUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(200).json({ message: "Leçon supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la leçon", error: err.message });
    }
};