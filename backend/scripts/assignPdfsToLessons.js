import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduinsight';

const uploadsDir = path.join(process.cwd(), 'uploads');
const lessonsDir = path.join(uploadsDir, 'lessons');

const isPdf = (name) => name.toLowerCase().endsWith('.pdf');

const gatherPdfFiles = (dir) => {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (it.name === 'lessons') continue; // skip lessons folder
      results.push(...gatherPdfFiles(p));
    } else if (it.isFile() && isPdf(it.name)) {
      results.push(p);
    }
  }
  return results;
};

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    if (!fs.existsSync(lessonsDir)) fs.mkdirSync(lessonsDir, { recursive: true });

    const pdfFiles = gatherPdfFiles(uploadsDir);
    console.log('Found PDFs:', pdfFiles.length);
    if (pdfFiles.length === 0) {
      console.log('No PDFs to assign. Exiting.');
      process.exit(0);
    }

    const lessons = await Lesson.find({ $or: [{ pdfUrl: { $exists: false } }, { pdfUrl: null }, { pdfUrl: '' }] }).sort({ createdAt: 1 });
    console.log('Lessons without pdfUrl:', lessons.length);
    let idx = 0;
    for (const lesson of lessons) {
      const src = pdfFiles[idx % pdfFiles.length];
      const filename = path.basename(src);
      const dest = path.join(lessonsDir, filename);
      // if src already in lessons dir, keep it
      if (path.dirname(src) !== lessonsDir) {
        // avoid overwriting: if dest exists, append index
        let finalDest = dest;
        let count = 1;
        while (fs.existsSync(finalDest)) {
          const name = path.parse(filename).name;
          const ext = path.parse(filename).ext;
          finalDest = path.join(lessonsDir, `${name}-${count}${ext}`);
          count++;
        }
        fs.copyFileSync(src, finalDest);
        const assignedName = path.basename(finalDest);
        lesson.pdfUrl = `lessons/${assignedName}`;
        console.log(`Assigned ${assignedName} to lesson ${lesson._id}`);
      } else {
        // already under lessons
        lesson.pdfUrl = `lessons/${filename}`;
        console.log(`Assigned existing lessons/${filename} to lesson ${lesson._id}`);
      }
      await lesson.save();
      idx++;
      // stop if we've assigned to all lessons and used each PDF at least once
      if (idx >= lessons.length) break;
    }

    console.log('Done assigning PDFs.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

run();
