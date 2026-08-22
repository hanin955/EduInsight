import User from '../models/User.js';
import Admin from '../models/admin.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
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
        const updateData = { ...req.body };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
            delete updateData.password;
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
};
export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: false });
        res.status(200).json({ success: true, message: 'Utilisateur désactivé' });
    } catch (error) { next(error); }
};