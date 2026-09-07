import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/lessons/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
    }
};

const uploadLessonPdf = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter,
});

export default uploadLessonPdf;