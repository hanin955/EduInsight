const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Department = require('./models/Department.js');
const User = require('./models/User.js');
const Admin = require('./models/admin.js');
const Teacher = require('./models/Teacher.js');
const Student = require('./models/Student.js');
const Course = require('./models/Course.js');
const Module = require('./models/Module.js');
const Lesson = require('./models/Lesson.js');
const Quiz = require('./models/Quiz.js');
const Question = require('./models/Question.js');
const Choice = require('./models/Choice.js');
const QuizAttempt = require('./models/QuizAttempt.js');
const Answer = require('./models/Answer.js');
const AuditLog = require('./models/AuditLog.js');
const DashboardData = require('./models/DashboardData.js');
const Inscription = require('./models/Inscription.js');
const PerformanceMetric = require('./models/PerformanceMetric.js');
const Recommendation = require('./models/Recommendation.js');
const Notification = require('./models/Notification.js'); 
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduinsight';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🔌 Connecté à MongoDB...');
    await Promise.all([
        Department.deleteMany({}), User.deleteMany({}), Course.deleteMany({}),
        Module.deleteMany({}), Lesson.deleteMany({}), Quiz.deleteMany({}),
        Question.deleteMany({}), Choice.deleteMany({}), QuizAttempt.deleteMany({}),
        Answer.deleteMany({}), AuditLog.deleteMany({}), DashboardData.deleteMany({}),
        Inscription.deleteMany({}), PerformanceMetric.deleteMany({}),
        Recommendation.deleteMany({}), Notification.deleteMany({}),
    ]);
    console.log('🧹 Base nettoyée.');
    const hashedPassword = await bcrypt.hash('Password123',10);
    const departments = await Department.insertMany([
        { name: 'Informatique & Technologies', description: 'Génie logiciel et développement web' },
        { name: 'Génie Civil', description: 'Construction, structures et travaux publics' },
        { name: 'Mathématiques Appliquées', description: 'Statistiques, analyse numérique' },
        { name: 'Sciences Économiques', description: 'Économie, gestion et finance' },
        { name: 'Réseaux & Télécoms', description: 'Infrastructure réseau et télécommunications' },
        { name: 'Intelligence Artificielle', description: 'Machine learning et data science' },
        { name: 'Électronique', description: 'Systèmes électroniques et embarqués' },
        { name: 'Gestion & Management', description: 'Management des entreprises' },
        { name: 'Physique Appliquée', description: 'Physique industrielle et instrumentation' },
        { name: 'Design & Multimédia', description: 'Design graphique et audiovisuel' },
    ]);
    console.log('✅ 10 Departments créés.');
    const admins = await Admin.insertMany([
        { firstName: 'Karim', lastName: 'Haddad', email: 'karim.haddad@eduinsight.com', password: hashedPassword, premissions: [{ type: 'ALL_PERMISSIONS' }] },
        { firstName: 'Sonia', lastName: 'Trabelsi', email: 'sonia.trabelsi@eduinsight.com', password: hashedPassword, premissions: [{ type: 'MANAGE_USERS' }] },
        { firstName: 'Mehdi', lastName: 'Ferjani', email: 'mehdi.ferjani@eduinsight.com', password: hashedPassword, premissions: [{ type: 'MANAGE_COURSES' }] },
        { firstName: 'Amira', lastName: 'Bouzid', email: 'amira.bouzid@eduinsight.com', password: hashedPassword, premissions: [{ type: 'ALL_PERMISSIONS' }] },
        { firstName: 'Youssef', lastName: 'Chaabane', email: 'youssef.chaabane@eduinsight.com', password: hashedPassword, premissions: [{ type: 'MANAGE_REPORTS' }] },
        { firstName: 'Nour', lastName: 'Gharbi', email: 'nour.gharbi@eduinsight.com', password: hashedPassword, premissions: [{ type: 'ALL_PERMISSIONS' }] },
        { firstName: 'Walid', lastName: 'Mabrouk', email: 'walid.mabrouk@eduinsight.com', password: hashedPassword, premissions: [{ type: 'MANAGE_USERS' }] },
        { firstName: 'Hela', lastName: 'Sassi', email: 'hela.sassi@eduinsight.com', password: hashedPassword, premissions: [{ type: 'MANAGE_COURSES' }] },
        { firstName: 'Anis', lastName: 'Jaziri', email: 'anis.jaziri@eduinsight.com', password: hashedPassword, premissions: [{ type: 'ALL_PERMISSIONS' }] },
        { firstName: 'Rania', lastName: 'Khelifi', email: 'rania.khelifi@eduinsight.com', password: hashedPassword, premissions: [{ type: 'MANAGE_REPORTS' }] },
    ]);
    console.log('✅ 10 Admins créés.');
    const d = departments; // raccourci
    const teachers = await Teacher.insertMany([
        { firstName: 'Ibrahim', lastName: 'Dev', email: 'ibrahim.dev@eduinsight.com', password: hashedPassword, speciality: 'MERN Stack & Web Dev', office: 'B-204', department: d[0]._id, hireDate: new Date('2020-09-01') },
        { firstName: 'Salma', lastName: 'Ouerghi', email: 'salma.ouerghi@eduinsight.com', password: hashedPassword, speciality: 'Intelligence Artificielle', office: 'C-101', department: d[5]._id, hireDate: new Date('2019-02-15') },
        { firstName: 'Fares', lastName: 'Guesmi', email: 'fares.guesmi@eduinsight.com', password: hashedPassword, speciality: 'Réseaux', office: 'A-310', department: d[4]._id, hireDate: new Date('2021-01-10') },
        { firstName: 'Emna', lastName: 'Boukadi', email: 'emna.boukadi@eduinsight.com', password: hashedPassword, speciality: 'Cybersécurité', office: 'B-102', department: d[4]._id, hireDate: new Date('2018-11-20') },
        { firstName: 'Nabil', lastName: 'Zarrouk', email: 'nabil.zarrouk@eduinsight.com', password: hashedPassword, speciality: 'Bases de données', office: 'D-207', department: d[0]._id, hireDate: new Date('2022-03-05') },
        { firstName: 'Mariem', lastName: 'Hammami', email: 'mariem.hammami@eduinsight.com', password: hashedPassword, speciality: 'DevOps & Cloud', office: 'C-215', department: d[0]._id, hireDate: new Date('2020-06-12') },
        { firstName: 'Oussama', lastName: 'Belhaj', email: 'oussama.belhaj@eduinsight.com', password: hashedPassword, speciality: 'Mobile Dev', office: 'A-118', department: d[0]._id, hireDate: new Date('2021-09-01') },
        { firstName: 'Yasmine', lastName: 'Rekik', email: 'yasmine.rekik@eduinsight.com', password: hashedPassword, speciality: 'Data Science', office: 'B-320', department: d[5]._id, hireDate: new Date('2019-10-01') },
        { firstName: 'Bilel', lastName: 'Mejri', email: 'bilel.mejri@eduinsight.com', password: hashedPassword, speciality: 'Systèmes embarqués', office: 'D-101', department: d[6]._id, hireDate: new Date('2017-04-18') },
        { firstName: 'Ines', lastName: 'Cherif', email: 'ines.cherif@eduinsight.com', password: hashedPassword, speciality: 'UI/UX Design', office: 'C-305', department: d[9]._id, hireDate: new Date('2023-01-09') },
    ]);
    console.log('✅ 10 Teachers créés.');
    const students = await Student.insertMany([
        { firstName: 'Sami', lastName: 'Ben Ali', email: 'sami.benali@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026001', level: 'L2', group: 'G1', departement: d[0]._id },
        { firstName: 'Aya', lastName: 'Mansouri', email: 'aya.mansouri@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026002', level: 'L3', group: 'G2', departement: d[0]._id },
        { firstName: 'Hamza', lastName: 'Jendoubi', email: 'hamza.jendoubi@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026003', level: 'L1', group: 'G1', departement: d[4]._id },
        { firstName: 'Nesrine', lastName: 'Aouadi', email: 'nesrine.aouadi@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026004', level: 'M1', group: 'G3', departement: d[5]._id },
        { firstName: 'Adem', lastName: 'Kammoun', email: 'adem.kammoun@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026005', level: 'L2', group: 'G2', departement: d[0]._id },
        { firstName: 'Rim', lastName: 'Sfaxi', email: 'rim.sfaxi@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026006', level: 'M2', group: 'G1', departement: d[5]._id },
        { firstName: 'Iyed', lastName: 'Chtioui', email: 'iyed.chtioui@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026007', level: 'L3', group: 'G3', departement: d[6]._id },
        { firstName: 'Wafa', lastName: 'Naili', email: 'wafa.naili@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026008', level: 'L1', group: 'G2', departement: d[9]._id },
        { firstName: 'Skander', lastName: 'Bahri', email: 'skander.bahri@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026009', level: 'L2', group: 'G1', departement: d[0]._id },
        { firstName: 'Lina', lastName: 'Toumi', email: 'lina.toumi@eduinsight.com', password: hashedPassword, studentCode: 'ETU2026010', level: 'M1', group: 'G3', departement: d[4]._id },
    ]);
    console.log('✅ 10 Students créés.');
    const t = teachers;
    const courses = await Course.insertMany([
        { title: 'Développement Web avec la Stack MERN', description: 'React, Express, MongoDB, Node.js', departement: d[0]._id, teacher: t[0]._id, duration: 30, level: 'Intermédiaire', image: '/images/mern.jpg' },
        { title: 'Introduction à l\'Intelligence Artificielle', description: 'Concepts fondamentaux de l\'IA', departement: d[5]._id, teacher: t[1]._id, duration: 25, level: 'Débutant', image: '/images/ia.jpg' },
        { title: 'Sécurité des Réseaux', description: 'Firewalls, VPN, cryptographie', departement: d[4]._id, teacher: t[3]._id, duration: 20, level: 'Avancé', image: '/images/secu.jpg' },
        { title: 'Bases de Données Relationnelles', description: 'SQL, modélisation, optimisation', departement: d[0]._id, teacher: t[4]._id, duration: 18, level: 'Intermédiaire', image: '/images/sql.jpg' },
        { title: 'DevOps et Déploiement Cloud', description: 'Docker, CI/CD, AWS', departement: d[0]._id, teacher: t[5]._id, duration: 22, level: 'Avancé', image: '/images/devops.jpg' },
        { title: 'Développement Mobile avec React Native', description: 'Applications iOS et Android', departement: d[0]._id, teacher: t[6]._id, duration: 24, level: 'Intermédiaire', image: '/images/mobile.jpg' },
        { title: 'Machine Learning appliqué', description: 'Scikit-learn, TensorFlow', departement: d[5]._id, teacher: t[7]._id, duration: 28, level: 'Avancé', image: '/images/ml.jpg' },
        { title: 'Systèmes Embarqués', description: 'Microcontrôleurs et IoT', departement: d[6]._id, teacher: t[8]._id, duration: 26, level: 'Intermédiaire', image: '/images/embarque.jpg' },
        { title: 'Design UI/UX pour le Web', description: 'Figma, prototypage, ergonomie', departement: d[9]._id, teacher: t[9]._id, duration: 15, level: 'Débutant', image: '/images/uiux.jpg' },
        { title: 'Réseaux Informatiques', description: 'TCP/IP, routage, switching', departement: d[4]._id, teacher: t[2]._id, duration: 20, level: 'Débutant', image: '/images/reseaux.jpg' },
    ]);
    console.log('✅ 10 Courses créés.');
    const modules = await Module.insertMany([
        { title: 'Module 1 : Introduction à Node.js & Express', description: 'Bases du serveur backend', order: 1, course: courses[0]._id },
        { title: 'Module 2 : React & Composants', description: 'Frontend avec React', order: 2, course: courses[0]._id },
        { title: 'Module 1 : Fondements de l\'IA', description: 'Historique et concepts clés', order: 1, course: courses[1]._id },
        { title: 'Module 1 : Cryptographie de base', description: 'Chiffrement symétrique/asymétrique', order: 1, course: courses[2]._id },
        { title: 'Module 1 : Modélisation de données', description: 'MCD, MLD, normalisation', order: 1, course: courses[3]._id },
        { title: 'Module 1 : Conteneurisation avec Docker', description: 'Images et conteneurs', order: 1, course: courses[4]._id },
        { title: 'Module 1 : Bases de React Native', description: 'Composants natifs', order: 1, course: courses[5]._id },
        { title: 'Module 1 : Régression et Classification', description: 'Algorithmes supervisés', order: 1, course: courses[6]._id },
        { title: 'Module 1 : Introduction aux microcontrôleurs', description: 'Arduino et capteurs', order: 1, course: courses[7]._id },
        { title: 'Module 1 : Principes du Design UI', description: 'Couleurs, typographie, grille', order: 1, course: courses[8]._id },
    ]);
    console.log('✅ 10 Modules créés.');
    const lessons = await Lesson.insertMany([
        { title: 'Leçon 1 : Création du serveur Express', content: '<h1>Bienvenue dans Express</h1><p>Routes et contrôleurs...</p>', videoUrl: '/videos/l1.mp4', pdfUrl: '/pdfs/l1.pdf', order: 1, module: modules[0]._id },
        { title: 'Leçon 2 : Les composants React', content: '<h1>React</h1><p>Props et state...</p>', videoUrl: '/videos/l2.mp4', pdfUrl: '/pdfs/l2.pdf', order: 1, module: modules[1]._id },
        { title: 'Leçon 1 : Qu\'est-ce que l\'IA ?', content: '<h1>Introduction</h1><p>Définitions et histoire...</p>', videoUrl: '/videos/l3.mp4', pdfUrl: '/pdfs/l3.pdf', order: 1, module: modules[2]._id },
        { title: 'Leçon 1 : Chiffrement AES', content: '<h1>AES</h1><p>Fonctionnement du chiffrement symétrique...</p>', videoUrl: '/videos/l4.mp4', pdfUrl: '/pdfs/l4.pdf', order: 1, module: modules[3]._id },
        { title: 'Leçon 1 : Normalisation 3NF', content: '<h1>Normalisation</h1><p>1NF, 2NF, 3NF...</p>', videoUrl: '/videos/l5.mp4', pdfUrl: '/pdfs/l5.pdf', order: 1, module: modules[4]._id },
        { title: 'Leçon 1 : Dockerfile et images', content: '<h1>Docker</h1><p>Créer une image...</p>', videoUrl: '/videos/l6.mp4', pdfUrl: '/pdfs/l6.pdf', order: 1, module: modules[5]._id },
        { title: 'Leçon 1 : Premiers pas avec Expo', content: '<h1>React Native</h1><p>Installation et setup...</p>', videoUrl: '/videos/l7.mp4', pdfUrl: '/pdfs/l7.pdf', order: 1, module: modules[6]._id },
        { title: 'Leçon 1 : Régression linéaire', content: '<h1>ML</h1><p>Principe de la régression...</p>', videoUrl: '/videos/l8.mp4', pdfUrl: '/pdfs/l8.pdf', order: 1, module: modules[7]._id },
        { title: 'Leçon 1 : Programmer une carte Arduino', content: '<h1>Arduino</h1><p>Premier programme...</p>', videoUrl: '/videos/l9.mp4', pdfUrl: '/pdfs/l9.pdf', order: 1, module: modules[8]._id },
        { title: 'Leçon 1 : Théorie des couleurs', content: '<h1>Design</h1><p>Harmonies chromatiques...</p>', videoUrl: '/videos/l10.mp4', pdfUrl: '/pdfs/l10.pdf', order: 1, module: modules[9]._id },
    ]);
    console.log('✅ 10 Lessons créées.');
    const quizzes = await Quiz.insertMany([
        { course: courses[0]._id, title: 'Quiz 1 : Notions de base Express.js', description: 'Test sur les middlewares et le routage', duration: 15, passingScore: 60, isPublished: true, createdBy: t[0]._id },
        { course: courses[0]._id, title: 'Quiz 2 : React fondamentaux', description: 'Props, state, hooks', duration: 15, passingScore: 60, isPublished: true, createdBy: t[0]._id },
        { course: courses[1]._id, title: 'Quiz 1 : Bases de l\'IA', description: 'Concepts fondamentaux', duration: 10, passingScore: 50, isPublished: true, createdBy: t[1]._id },
        { course: courses[2]._id, title: 'Quiz 1 : Cryptographie', description: 'Chiffrement et sécurité', duration: 20, passingScore: 70, isPublished: false, createdBy: t[3]._id },
        { course: courses[3]._id, title: 'Quiz 1 : SQL avancé', description: 'Jointures et sous-requêtes', duration: 15, passingScore: 60, isPublished: true, createdBy: t[4]._id },
        { course: courses[4]._id, title: 'Quiz 1 : Docker & CI/CD', description: 'Conteneurisation', duration: 12, passingScore: 55, isPublished: true, createdBy: t[5]._id },
        { course: courses[5]._id, title: 'Quiz 1 : React Native', description: 'Composants natifs', duration: 15, passingScore: 60, isPublished: false, createdBy: t[6]._id },
        { course: courses[6]._id, title: 'Quiz 1 : Machine Learning', description: 'Algorithmes supervisés', duration: 20, passingScore: 65, isPublished: true, createdBy: t[7]._id },
        { course: courses[7]._id, title: 'Quiz 1 : Arduino & IoT', description: 'Microcontrôleurs', duration: 10, passingScore: 50, isPublished: true, createdBy: t[8]._id },
        { course: courses[8]._id, title: 'Quiz 1 : Design UI', description: 'Bonnes pratiques UX', duration: 10, passingScore: 50, isPublished: true, createdBy: t[9]._id },
    ]);
    console.log('✅ 10 Quizzes créés.');
    const questions = await Question.insertMany([
        { quiz: quizzes[0]._id, statement: 'Quel middleware permet de parser le JSON dans Express ?', type: 'MCQ', points: 2, order: 1 },
        { quiz: quizzes[1]._id, statement: 'Qu\'est-ce qu\'un hook React ?', type: 'ShortAnswer', points: 3, order: 1 },
        { quiz: quizzes[2]._id, statement: 'L\'IA forte existe-t-elle aujourd\'hui ?', type: 'TrueFalse', points: 1, order: 1 },
        { quiz: quizzes[3]._id, statement: 'Quel algorithme est utilisé par AES ?', type: 'MCQ', points: 2, order: 1 },
        { quiz: quizzes[4]._id, statement: 'Quelle clause SQL permet de filtrer après un GROUP BY ?', type: 'MCQ', points: 2, order: 1 },
        { quiz: quizzes[5]._id, statement: 'Quelle commande construit une image Docker ?', type: 'MCQ', points: 2, order: 1 },
        { quiz: quizzes[6]._id, statement: 'React Native compile-t-il en code natif ?', type: 'TrueFalse', points: 1, order: 1 },
        { quiz: quizzes[7]._id, statement: 'Quel est le rôle de la fonction de coût en ML ?', type: 'ShortAnswer', points: 3, order: 1 },
        { quiz: quizzes[8]._id, statement: 'Quel composant lit une valeur analogique sur Arduino ?', type: 'MCQ', points: 2, order: 1 },
        { quiz: quizzes[9]._id, statement: 'Qu\'est-ce que le contraste en design UI ?', type: 'ShortAnswer', points: 2, order: 1 },
    ]);
    console.log('✅ 10 Questions créées.');
    const choices = await Choice.insertMany([
        { question: questions[0]._id, text: 'express.json()', isCorrect: true, order: 1 },
        { question: questions[1]._id, text: 'Une fonction qui permet d\'utiliser l\'état dans un composant fonctionnel', isCorrect: true, order: 1 },
        { question: questions[2]._id, text: 'Faux', isCorrect: true, order: 1 },
        { question: questions[3]._id, text: 'Chiffrement par blocs symétrique', isCorrect: true, order: 1 },
        { question: questions[4]._id, text: 'HAVING', isCorrect: true, order: 1 },
        { question: questions[5]._id, text: 'docker build', isCorrect: true, order: 1 },
        { question: questions[6]._id, text: 'Vrai', isCorrect: true, order: 1 },
        { question: questions[7]._id, text: 'Mesurer l\'erreur entre prédiction et valeur réelle', isCorrect: true, order: 1 },
        { question: questions[8]._id, text: 'analogRead()', isCorrect: true, order: 1 },
        { question: questions[9]._id, text: 'La différence visuelle entre deux éléments', isCorrect: true, order: 1 },
    ]);
    console.log('✅ 10 Choices créées.');
    const quizAttempts = await QuizAttempt.insertMany([
        { student: students[0]._id, quiz: quizzes[0]._id, score: 80, totalQuestions: 5, startedAt: new Date('2026-06-01T10:00:00'), submittedAt: new Date('2026-06-01T10:14:00'), duration: 14 },
        { student: students[1]._id, quiz: quizzes[1]._id, score: 60, totalQuestions: 5, startedAt: new Date('2026-06-02T09:00:00'), submittedAt: new Date('2026-06-02T09:12:00'), duration: 12 },
        { student: students[2]._id, quiz: quizzes[2]._id, score: 40, totalQuestions: 5, startedAt: new Date('2026-06-02T11:00:00'), submittedAt: new Date('2026-06-02T11:09:00'), duration: 9 },
        { student: students[3]._id, quiz: quizzes[3]._id, score: 90, totalQuestions: 5, startedAt: new Date('2026-06-03T14:00:00'), submittedAt: new Date('2026-06-03T14:18:00'), duration: 18 },
        { student: students[4]._id, quiz: quizzes[4]._id, score: 70, totalQuestions: 5, startedAt: new Date('2026-06-03T15:00:00'), submittedAt: new Date('2026-06-03T15:13:00'), duration: 13 },
        { student: students[5]._id, quiz: quizzes[5]._id, score: 55, totalQuestions: 5, startedAt: new Date('2026-06-04T10:00:00'), submittedAt: new Date('2026-06-04T10:11:00'), duration: 11 },
        { student: students[6]._id, quiz: quizzes[6]._id, score: 65, totalQuestions: 5, startedAt: new Date('2026-06-04T16:00:00'), submittedAt: new Date('2026-06-04T16:14:00'), duration: 14 },
        { student: students[7]._id, quiz: quizzes[7]._id, score: 85, totalQuestions: 5, startedAt: new Date('2026-06-05T09:30:00'), submittedAt: new Date('2026-06-05T09:48:00'), duration: 18 },
        { student: students[8]._id, quiz: quizzes[8]._id, score: 50, totalQuestions: 5, startedAt: new Date('2026-06-05T13:00:00'), submittedAt: new Date('2026-06-05T13:09:00'), duration: 9 },
        { student: students[9]._id, quiz: quizzes[9]._id, score: 75, totalQuestions: 5, startedAt: new Date('2026-06-06T10:00:00'), submittedAt: new Date('2026-06-06T10:09:00'), duration: 9 },
    ]);
    console.log('✅ 10 QuizAttempts créés.');
    await Answer.insertMany([
        { attempt: quizAttempts[0]._id, question: questions[0]._id, selectedChoice: choices[0]._id, textAnswer: '', isCorrect: true, pointsEarned: 2 },
        { attempt: quizAttempts[1]._id, question: questions[1]._id, selectedChoice: choices[1]._id, textAnswer: 'useState permet de gérer l\'état', isCorrect: true, pointsEarned: 3 },
        { attempt: quizAttempts[2]._id, question: questions[2]._id, selectedChoice: choices[2]._id, textAnswer: '', isCorrect: false, pointsEarned: 0 },
        { attempt: quizAttempts[3]._id, question: questions[3]._id, selectedChoice: choices[3]._id, textAnswer: '', isCorrect: true, pointsEarned: 2 },
        { attempt: quizAttempts[4]._id, question: questions[4]._id, selectedChoice: choices[4]._id, textAnswer: '', isCorrect: true, pointsEarned: 2 },
        { attempt: quizAttempts[5]._id, question: questions[5]._id, selectedChoice: choices[5]._id, textAnswer: '', isCorrect: false, pointsEarned: 0 },
        { attempt: quizAttempts[6]._id, question: questions[6]._id, selectedChoice: choices[6]._id, textAnswer: '', isCorrect: true, pointsEarned: 1 },
        { attempt: quizAttempts[7]._id, question: questions[7]._id, selectedChoice: choices[7]._id, textAnswer: 'Elle mesure l\'écart entre la prédiction et la réalité', isCorrect: true, pointsEarned: 3 },
        { attempt: quizAttempts[8]._id, question: questions[8]._id, selectedChoice: choices[8]._id, textAnswer: '', isCorrect: true, pointsEarned: 2 },
        { attempt: quizAttempts[9]._id, question: questions[9]._id, selectedChoice: choices[9]._id, textAnswer: 'C\'est la différence de luminosité/couleur entre éléments', isCorrect: true, pointsEarned: 2 },
    ]);
    console.log('✅ 10 Answers créées.');
    await AuditLog.insertMany([
        { user: admins[0]._id, action: 'LOGIN', entity: 'User', entityId: admins[0]._id, ipAddress: '192.168.1.10' },
        { user: t[0]._id, action: 'CREATE_COURSE', entity: 'Course', entityId: courses[0]._id, ipAddress: '192.168.1.11' },
        { user: t[1]._id, action: 'CREATE_COURSE', entity: 'Course', entityId: courses[1]._id, ipAddress: '192.168.1.12' },
        { user: students[0]._id, action: 'SUBMIT_QUIZ', entity: 'QuizAttempt', entityId: quizAttempts[0]._id, ipAddress: '192.168.1.13' },
        { user: students[1]._id, action: 'SUBMIT_QUIZ', entity: 'QuizAttempt', entityId: quizAttempts[1]._id, ipAddress: '192.168.1.14' },
        { user: admins[1]._id, action: 'DELETE_QUIZ', entity: 'Quiz', entityId: quizzes[3]._id, ipAddress: '192.168.1.15' },
        { user: t[2]._id, action: 'UPDATE_PROFILE', entity: 'User', entityId: t[2]._id, ipAddress: '192.168.1.16' },
        { user: students[2]._id, action: 'LOGIN', entity: 'User', entityId: students[2]._id, ipAddress: '192.168.1.17' },
        { user: admins[2]._id, action: 'MANAGE_USERS', entity: 'User', entityId: students[3]._id, ipAddress: '192.168.1.18' },
        { user: students[4]._id, action: 'ENROLL_COURSE', entity: 'Inscription', entityId: courses[4]._id, ipAddress: '192.168.1.19' },
    ]);
    console.log('✅ 10 AuditLogs créés.');
    await DashboardData.insertMany([
        { user: students[0]._id, totalCourses: 3, averageScore: 78, attendanceRate: 90, progress: 60, rank: 1 },
        { user: students[1]._id, totalCourses: 2, averageScore: 65, attendanceRate: 80, progress: 45, rank: 4 },
        { user: students[2]._id, totalCourses: 4, averageScore: 55, attendanceRate: 70, progress: 30, rank: 8 },
        { user: students[3]._id, totalCourses: 5, averageScore: 92, attendanceRate: 95, progress: 85, rank: 1 },
        { user: students[4]._id, totalCourses: 3, averageScore: 70, attendanceRate: 85, progress: 50, rank: 5 },
        { user: students[5]._id, totalCourses: 2, averageScore: 60, attendanceRate: 75, progress: 40, rank: 6 },
        { user: students[6]._id, totalCourses: 3, averageScore: 68, attendanceRate: 82, progress: 55, rank: 3 },
        { user: students[7]._id, totalCourses: 4, averageScore: 88, attendanceRate: 93, progress: 75, rank: 2 },
        { user: students[8]._id, totalCourses: 1, averageScore: 50, attendanceRate: 60, progress: 20, rank: 10 },
        { user: students[9]._id, totalCourses: 3, averageScore: 74, attendanceRate: 88, progress: 65, rank: 3 },
    ]);
    console.log('✅ 10 DashboardData créés.');
    await Inscription.insertMany([
        { student: students[0]._id, course: courses[0]._id, enrolledAt: new Date('2026-02-01'), status: 'active' },
        { student: students[1]._id, course: courses[0]._id, enrolledAt: new Date('2026-02-02'), status: 'active' },
        { student: students[2]._id, course: courses[1]._id, enrolledAt: new Date('2026-02-03'), status: 'completed' },
        { student: students[3]._id, course: courses[2]._id, enrolledAt: new Date('2026-02-04'), status: 'active' },
        { student: students[4]._id, course: courses[3]._id, enrolledAt: new Date('2026-02-05'), status: 'dropped' },
        { student: students[5]._id, course: courses[4]._id, enrolledAt: new Date('2026-02-06'), status: 'active' },
        { student: students[6]._id, course: courses[5]._id, enrolledAt: new Date('2026-02-07'), status: 'active' },
        { student: students[7]._id, course: courses[6]._id, enrolledAt: new Date('2026-02-08'), status: 'completed' },
        { student: students[8]._id, course: courses[7]._id, enrolledAt: new Date('2026-02-09'), status: 'active' },
        { student: students[9]._id, course: courses[8]._id, enrolledAt: new Date('2026-02-10'), status: 'active' },
    ]);
    console.log('✅ 10 Inscriptions créées.');
    await PerformanceMetric.insertMany([
        { student: students[0]._id, course: courses[0]._id, weekName: 'Semaine 1', quizScoreAverage: 75, attendanceRate: 90 },
        { student: students[1]._id, course: courses[0]._id, weekName: 'Semaine 1', quizScoreAverage: 60, attendanceRate: 80 },
        { student: students[2]._id, course: courses[1]._id, weekName: 'Semaine 1', quizScoreAverage: 55, attendanceRate: 70 },
        { student: students[3]._id, course: courses[2]._id, weekName: 'Semaine 2', quizScoreAverage: 90, attendanceRate: 95 },
        { student: students[4]._id, course: courses[3]._id, weekName: 'Semaine 2', quizScoreAverage: 68, attendanceRate: 85 },
        { student: students[5]._id, course: courses[4]._id, weekName: 'Semaine 2', quizScoreAverage: 58, attendanceRate: 75 },
        { student: students[6]._id, course: courses[5]._id, weekName: 'Semaine 3', quizScoreAverage: 65, attendanceRate: 82 },
        { student: students[7]._id, course: courses[6]._id, weekName: 'Semaine 3', quizScoreAverage: 85, attendanceRate: 93 },
        { student: students[8]._id, course: courses[7]._id, weekName: 'Semaine 3', quizScoreAverage: 50, attendanceRate: 60 },
        { student: students[9]._id, course: courses[8]._id, weekName: 'Semaine 4', quizScoreAverage: 72, attendanceRate: 88 },
    ]);
    console.log('✅ 10 PerformanceMetrics créés.');
    await Notification.insertMany([
        { user: students[0]._id, title: 'Nouveau quiz disponible', message: 'Le quiz React fondamentaux est ouvert.', type: 'info', isRead: false, confidenceScore: 0 },
        { user: students[1]._id, title: 'Résultat de quiz', message: 'Vous avez obtenu 60% au Quiz React fondamentaux.', type: 'info', isRead: true, confidenceScore: 0 },
        { user: students[2]._id, title: 'Rappel', message: 'N\'oubliez pas de terminer le module IA.', type: 'rappel', isRead: false, confidenceScore: 0 },
        { user: t[0]._id, title: 'Nouvel étudiant inscrit', message: 'Sami Ben Ali s\'est inscrit à votre cours MERN.', type: 'info', isRead: false, confidenceScore: 0 },
        { user: admins[0]._id, title: 'Nouveau compte enseignant', message: 'Ines Cherif a créé un compte enseignant.', type: 'alerte', isRead: false, confidenceScore: 0 },
        { user: students[3]._id, title: 'Félicitations', message: 'Vous êtes dans le top 3 du classement !', type: 'info', isRead: true, confidenceScore: 0 },
        { user: students[4]._id, title: 'Taux de présence faible', message: 'Votre assiduité a baissé cette semaine.', type: 'alerte', isRead: false, confidenceScore: 0 },
        { user: t[3]._id, title: 'Quiz en attente de correction', message: '3 tentatives à corriger sur Sécurité des Réseaux.', type: 'rappel', isRead: false, confidenceScore: 0 },
        { user: students[6]._id, title: 'Nouveau module publié', message: 'Le module 2 du cours MERN est disponible.', type: 'info', isRead: false, confidenceScore: 0 },
        { user: students[9]._id, title: 'Rappel d\'examen', message: 'Le quiz Design UI se termine bientôt.', type: 'rappel', isRead: false, confidenceScore: 0 },
    ]);
    console.log('✅ 10 Notifications créées.');
    console.log('🎉 Seeding terminé : 190 documents créés (10 par modèle).');
    process.exit(0);
    } catch (error) {
    console.error('❌ Erreur durant le seeding :', error);
    process.exit(1);
    }
};
seedDatabase();
