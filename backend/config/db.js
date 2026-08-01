import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        console.log("URI utilisée :", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connexion MongoDB réussie");
    } catch (err) {
        console.error("❌ Erreur de connexion MongoDB :", err.message);
        process.exit(1);
    }
};
export default connectDB;
