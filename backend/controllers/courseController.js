import Course from '../models/Course.js';
import Inscription from '../models/Inscription.js'; 

export const ajouterCourse = async (req, res) => {
    try {
        const { title, description, departement, teacher, duration, level } = req.body;
        const teacherId = teacher || req.user.id;
        const newCourse = new Course({
            title,
            description,
            departement,
            teacher: teacherId,
            duration,
            level,
            image: req.files?.image?.[0] ? req.files.image[0].filename : 'cours.jpg',
            pdf: req.files?.pdf?.[0] ? req.files.pdf[0].filename : undefined,
        });
        await newCourse.save();
        res.status(201).json({ message: "Course ajouté avec succès", course: newCourse });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la course", error: err.message });
    }
};

export const listerCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.teacher) {
            filter.teacher = req.query.teacher;
        }
        const courses = await Course.find(filter).populate('teacher', 'firstName lastName name email').skip(skip).limit(limit);
        const totalCourses = await Course.countDocuments(filter);
        res.status(200).json({ courses, totalCourses, page, totalPages: Math.ceil(totalCourses / limit), limit });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des courses", error: err.message });
    }
};

export const listerbyIdCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('teacher', 'firstName lastName name email');
        if (!course) {
            return res.status(404).json({ message: "Course non trouvé" });
        }
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du course", error: err.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files?.image?.[0]) {
            updateData.image = req.files.image[0].filename;
        }
        if (req.files?.pdf?.[0]) {
            updateData.pdf = req.files.pdf[0].filename;
        }
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: "Course non trouvé" });
        }
        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du course", error: err.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course non trouvé" });
        }
        res.status(200).json({ message: "Course supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression du course", error: err.message });
    }
};

export const enrollCourse = async (req, res, next) => {
    try {
        const inscription = await Inscription.create({ student: req.user.id, course: req.params.id });
        res.status(201).json({ success: true, data: inscription });
    } catch (error) {
        next(error);
    }
};