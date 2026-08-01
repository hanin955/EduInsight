import mongoose from "mongoose";
import User from "./User.js";
const adminSchema = mongoose.Schema({
    premissions: ['ALL_PERMISSIONS'] ,
});
export default User.discriminator("admin",adminSchema);
