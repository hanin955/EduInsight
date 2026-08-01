import { User, Admin, Teacher, Student } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res, next) => {
    try {
        const { email, password, role, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;
        const payload = { ...rest, email, password: hashedPassword };
        if (role === 'admin') newUser = await Admin.create(payload);
        else if (role === 'teacher') newUser = await Teacher.create(payload);
        else newUser = await Student.create(payload);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: false });
        res.status(200).json({ success: true, message: 'Utilisateur désactivé' });
    } catch (error) { next(error); }
};