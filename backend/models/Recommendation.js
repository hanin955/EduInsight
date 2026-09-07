import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        score: { type: Number, required: true, min: 0, max: 100 },
        reason: { type: String, required: true, trim: true },
        status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    },
    { timestamps: true }
);

recommendationSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);