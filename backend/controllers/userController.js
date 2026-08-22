import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
export const ajouterUtilisateur = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, phone, isActive, speciality, level } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const basePayload = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            avatar: req.file ? req.file.filename : null,
            isActive
        };
        let nouvelUser;
        if (role === 'teacher') {
            nouvelUser = await Teacher.create({
                ...basePayload,
                speciality,
            });
        } else if (role === 'student') {
            const studentCode = 'ETU' + Date.now().toString().slice(-7);
            nouvelUser = await Student.create({
                ...basePayload,
                studentCode,
                speciality,
                level: level || undefined,
            });
        } else {
            nouvelUser = await User.create({
                ...basePayload,
                role: role || 'admin',
            });
        }
        res.status(201).json({ message: "Utilisateur ajouté avec succès", User: nouvelUser });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de l'utilisateur", error: err.message });
    }
};
export const listerUtilisateurs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        const users = await User.find(filter).skip(skip).limit(limit);
        const totalUsers = await User.countDocuments(filter);
        res.status(200).json({ users, totalUsers, page, totalPages: Math.ceil(totalUsers / limit), limit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getUtilisateurById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err.message });
    }
};
export const updateUtilisateur = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.avatar = req.file.filename;
        }
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
            delete updateData.password;
        }
        const updatedUtilisateur = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedUtilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(updatedUtilisateur);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: err.message });
    }
};
export const deleteUtilisateur = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur de suppression", error: err.message });
    }
};