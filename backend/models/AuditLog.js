import mongoose from "mongoose";
const auditLogSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    action : {type: String,required: true},
    entity : {type: String,equired: true},
    entityId : {type: mongoose.Schema.Types.ObjectId},
    ipAddress : String
}, {timestamps: {createdAt: true, updatedAt: false}});
export default mongoose.model("AuditLog", auditLogSchema);