import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Inscription from '../models/Inscription.js';
import PerformanceMetric from '../models/PerformanceMetric.js';
import Recommendation from '../models/Recommendation.js';

const difficultyRank = { 'Débutant': 1, 'Intermédiaire': 2, 'Avancé': 3 };

const relatedKeywords = [
    ['javascript', ['react', 'node', 'express', 'typescript', 'rest']],
    ['react', ['typescript', 'javascript', 'html', 'css']],
    ['node', ['express', 'rest', 'docker']],
    ['express', ['rest', 'node', 'docker']],
    ['mongodb', ['node', 'express', 'rest']],
    ['html', ['css', 'javascript', 'react']],
    ['css', ['html', 'react']],
];

const normalize = (value) => (value || '').toLowerCase();

const isRelated = (currentCourse, candidate) => {
    const current = normalize(currentCourse.title);
    const target = normalize(candidate.title);
    return relatedKeywords.some(([keyword, targets]) =>
        current.includes(keyword) &&
        targets.some((targetKeyword) => target.includes(targetKeyword))
    );
};

const buildCandidate = (student, currentCourse, course, performance) => {
    const related = currentCourse ? isRelated(currentCourse, course) : false;

    const suggestedDifficulty = performance >= 75 ? 3 : performance >= 50 ? 2 : 1;
    const courseDifficulty = difficultyRank[course.level];

    const compatible =
        courseDifficulty !== undefined &&
        Math.abs(courseDifficulty - suggestedDifficulty) <= 1;

    if (!compatible) return null;

    const performanceBonus =
        performance >= 75 ? 20 : performance >= 50 ? 12 : 6;

    const score = Math.min(100,
        (related ? 40 : 0) + (compatible ? 25 : 0) + (related ? 20 : 0) + performanceBonus
    );

    const reason = related
        ? `Votre moyenne de ${Math.round(performance)}% en ${currentCourse.title} constitue une bonne base pour ${course.title}.`
        : `Le cours ${course.title} (niveau ${course.level}) correspond à votre progression actuelle.`;

    return { course: course._id, score, reason };
};

const generateRecommendations = async (studentId) => {
    const student = await Student.findById(studentId).lean();
    if (!student) {
        const error = new Error('Étudiant introuvable.');
        error.statusCode = 404;
        throw error;
    }

    const activeInscription = await Inscription.findOne({ student: studentId, status: 'active' })
        .sort({ enrolledAt: -1 })
        .populate('course')
        .lean();

    const currentCourse = activeInscription?.course || null;

    let performance = 0;
    if (currentCourse) {
        const metrics = await PerformanceMetric.find({ student: studentId, course: currentCourse._id }).lean();
        if (metrics.length) {
            performance = metrics.reduce((sum, m) => sum + m.quizScoreAverage, 0) / metrics.length;
        }
    }

    const enrolledCourseIds = (await Inscription.find({ student: studentId }).lean()).map((i) =>
        String(i.course)
    );

    const courses = await Course.find().sort({ title: 1 }).lean();

    const candidates = courses
        .filter((course) => !enrolledCourseIds.includes(String(course._id)))
        .map((course) => buildCandidate(student, currentCourse, course, performance))
        .filter(Boolean)
        .sort((left, right) => right.score - left.score)
        .slice(0, 5);

    await Recommendation.deleteMany({ student: studentId });

    if (candidates.length) {
        await Recommendation.insertMany(
            candidates.map((candidate) => ({ ...candidate, student: studentId }))
        );
    }

    return Recommendation.find({ student: studentId })
        .populate('course', 'title level duration')
        .sort({ score: -1 })
        .lean();
};

export { generateRecommendations };