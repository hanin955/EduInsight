import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { firstName, lastName, email, password, role, speciality, level, group, departement } = req.body;
    try {
        const UserExiste = await User.findOne({ email });
        if (UserExiste) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const allowedRoles = ['student', 'teacher'];
        const finalRole = allowedRoles.includes(role) ? role : 'student';
        const basePayload = {
            firstName,
            lastName,
            email,
            speciality,
            password: hashPassword,
        };
        if (finalRole === 'teacher') {
            if (!speciality) {
                return res.status(400).json({ message: "La spécialité est requise pour un enseignant" });
            }
            await Teacher.create({
                ...basePayload,
                speciality,
            });
        } else {
            const studentCode = 'ETU' + Date.now().toString().slice(-8);
            await Student.create({
                ...basePayload,
                studentCode,
                level: level || undefined,
                group: group || undefined,
                departement: departement || undefined,
            });
        }
        res.status(201).json({ message: "Inscription réussie" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "Identifiants invalides" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Déconnexion réussie' });
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ success: true, message: 'Mot de passe mis à jour' });
    } catch (error) {
        next(error);
    }
};