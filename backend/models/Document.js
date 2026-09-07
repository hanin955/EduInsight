import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        fileName: { type: String, required: true },
        originalName: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        ownerRole: { type: String, enum: ["admin", "teacher", "student"], required: true },
        visibility: { type: String, enum: ["private", "shared"], default: "private" },
    },
    { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;