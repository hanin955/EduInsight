import mongoose from "mongoose";

const options = {
    discriminatorKey: "role",
    collection: "users",
    timestamps: true,
};

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "teacher", "student"],
            default: "student",
        },
        phone: String,
        avatar: String,
        isActive: { type: Boolean, default: true },
    },
    options
);
const User = mongoose.model("User", userSchema);
const Admin = User.discriminator("admin", new mongoose.Schema({}));
const Teacher = User.discriminator("teacher", new mongoose.Schema({}));
const Student = User.discriminator("student", new mongoose.Schema({}));
export { User, Admin, Teacher, Student };
export default User;
