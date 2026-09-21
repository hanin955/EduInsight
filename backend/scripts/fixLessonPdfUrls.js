import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduinsight';

const fix = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');
    const lessons = await Lesson.find();
    let updated = 0;
    for (const l of lessons) {
      if (!l.pdfUrl) continue;
      const normalized = l.pdfUrl.startsWith('/') ? l.pdfUrl.slice(1) : l.pdfUrl;
      const filePath = path.join(process.cwd(), 'uploads', normalized);
      if (!fs.existsSync(filePath)) {
        l.pdfUrl = undefined;
        await l.save();
        updated++;
        console.log(`Cleared missing pdf for lesson ${l._id}: ${normalized}`);
      }
    }
    console.log(`Done. Updated ${updated} lessons.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

fix();
