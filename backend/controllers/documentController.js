import fs from "fs";
import path from "path";
import Document from "../models/Document.js";
import Inscription from "../models/Inscription.js";
import Course from "../models/Course.js";

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier envoyé" });
        }
        const { title } = req.body;
        const newDoc = await Document.create({
            title: title || req.file.originalname,
            fileName: `documents/${req.file.filename}`,
            originalName: req.file.originalname,
            fileType: path.extname(req.file.originalname).replace(".", ""),
            fileSize: req.file.size,
            owner: req.user.id,
            ownerRole: req.user.role,
            visibility: "private",
        });
        res.status(201).json({ message: "Document ajouté avec succès", document: newDoc });
    } catch (err) {
        console.error("Erreur uploadDocument:", err);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: err.message });
    }
};

export const listMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.id, visibility: "private" }).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (err) {
        console.error("Erreur listMyDocuments:", err);
        res.status(500).json({ message: err.message });
    }
};

export const uploadSharedDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier envoyé" });
        }
        const { title } = req.body;
        const newDoc = await Document.create({
            title: title || req.file.originalname,
            fileName: `documents/${req.file.filename}`,
            originalName: req.file.originalname,
            fileType: path.extname(req.file.originalname).replace(".", ""),
            fileSize: req.file.size,
            owner: req.user.id,
            ownerRole: req.user.role,
            visibility: "shared",
        });
        res.status(201).json({ message: "Document partagé ajouté avec succès", document: newDoc });
    } catch (err) {
        console.error("Erreur uploadSharedDocument:", err);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: err.message });
    }
};

export const listMySharedDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.id, visibility: "shared" }).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (err) {
        console.error("Erreur listMySharedDocuments:", err);
        res.status(500).json({ message: err.message });
    }
};

export const listSharedDocumentsForStudent = async (req, res) => {
    try {
        const inscriptions = await Inscription.find({ student: req.user.id });
        const courseIds = inscriptions.map((ins) => ins.course?._id || ins.course);

        const courses = await Course.find({ _id: { $in: courseIds } }).select("teacher");
        const teacherIds = [...new Set(courses.map((c) => c.teacher?.toString()).filter(Boolean))];

        const documents = await Document.find({
            visibility: "shared",
            $or: [
                { ownerRole: "admin" },
                { owner: { $in: teacherIds } },
            ],
        })
            .populate("owner", "firstName lastName role")
            .sort({ createdAt: -1 });

        res.status(200).json(documents);
    } catch (err) {
        console.error("Erreur listSharedDocumentsForStudent:", err);
        res.status(500).json({ message: err.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: "Document non trouvé" });
        }
        const isOwner = doc.owner.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Non autorisé à supprimer ce document" });
        }
        const filePath = path.join(process.cwd(), "uploads", doc.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await Document.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Document supprimé avec succès" });
    } catch (err) {
        console.error("Erreur deleteDocument:", err);
        res.status(500).json({ message: err.message });
    }
};