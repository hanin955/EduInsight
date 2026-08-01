import Course from '../models/course.js';
import Inscription from '../models/Inscription.js'; 

export const ajouterCourse = async (req, res) => {
    try {
        const { title, description, departement, teacher, duration, level } = req.body;
        const newCourse = new Course({
            title,
            description,
            departement,
            teacher,
            duration,
            level,
            image: req.file ? req.file.filename : null
        });
        await newCourse.save();
        res.status(201).json({ message: "Course ajouté avec succès", course: newCourse });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la course", error: err.message });
    }
};

export const listerCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des courses", error: err.message });
    }
};

export const listerbyIdCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
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
        const updateCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updateCourse) {
            return res.status(404).json({ message: "Course non trouvé" });
        }
        res.status(200).json(updateCourse);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du course", error: err.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const deleteCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deleteCourse) {
            return res.status(404).json({ message: "Course non trouvé" });
        }
        res.status(200).json({ message: "course supprimé avec succès" });
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