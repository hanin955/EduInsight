import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Department from './models/Department.js';
import User from './models/User.js';
import Admin from './models/admin.js';
import Teacher from './models/Teacher.js';
import Student from './models/Student.js';
import Course from './models/Course.js';
import Module from './models/Module.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';
import Question from './models/Question.js';
import Choice from './models/Choice.js';
import QuizAttempt from './models/QuizAttempt.js';
import Answer from './models/Answer.js';
import AuditLog from './models/AuditLog.js';
import DashboardData from './models/DashboardData.js';
import Inscription from './models/Inscription.js';
import PerformanceMetric from './models/PerformanceMetric.js';
import Recommendation from './models/Recommendation.js';
import Notification from './models/Notification.js';
dotenv.config();
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
    console.log(' Base nettoyée.');
    const hashedPassword = await bcrypt.hash('Password123', 10);
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
    console.log('10 Departments créés.');
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
    console.log('10 Admins créés.');
    const d = departments; 
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
    console.log('10 Teachers créés.');
    const students = await Student.insertMany([
        { firstName: 'Sami', lastName: 'Ben Ali', email: 'sami.benali@eduinsight.com', password: hashedPassword, level: 'L2', group: 'G1', departement: d[0]._id,speciality: 'Informatique', studentCode: 'STU001' },
        { firstName: 'Aya', lastName: 'Mansouri', email: 'aya.mansouri@eduinsight.com', password: hashedPassword, level: 'L3', group: 'G2', departement: d[0]._id,speciality: 'Mathématiques', studentCode: 'STU002' },
        { firstName: 'Hamza', lastName: 'Jendoubi', email: 'hamza.jendoubi@eduinsight.com', password: hashedPassword, level: 'L1', group: 'G1', departement: d[4]._id,speciality: 'Physique', studentCode: 'STU003' },
        { firstName: 'Nesrine', lastName: 'Aouadi', email: 'nesrine.aouadi@eduinsight.com', password: hashedPassword, level: 'M1', group: 'G3', departement: d[5]._id,speciality: 'Chimie', studentCode: 'STU004' },
        { firstName: 'Adem', lastName: 'Kammoun', email: 'adem.kammoun@eduinsight.com', password: hashedPassword, level: 'L2', group: 'G2', departement: d[0]._id,speciality: 'Biologie', studentCode: 'STU005' },
        { firstName: 'Rim', lastName: 'Sfaxi', email: 'rim.sfaxi@eduinsight.com', password: hashedPassword, level: 'M2', group: 'G1', departement: d[5]._id,speciality: 'Histoire', studentCode: 'STU006' },
        { firstName: 'Iyed', lastName: 'Chtioui', email: 'iyed.chtioui@eduinsight.com', password: hashedPassword, level: 'L3', group: 'G3', departement: d[6]._id,speciality: 'Informatique', studentCode: 'STU007' },
        { firstName: 'Wafa', lastName: 'Naili', email: 'wafa.naili@eduinsight.com', password: hashedPassword, level: 'L1', group: 'G2', departement: d[9]._id,speciality: 'Mathématiques', studentCode: 'STU008' },
        { firstName: 'Skander', lastName: 'Bahri', email: 'skander.bahri@eduinsight.com', password: hashedPassword, level: 'L2', group: 'G1', departement: d[0]._id,speciality: 'Informatique', studentCode: 'STU009' },
        { firstName: 'Lina', lastName: 'Toumi', email: 'lina.toumi@eduinsight.com', password: hashedPassword, level: 'M1', group:'G3', departement: d[4]._id,speciality: 'Physique', studentCode: 'STU010' },
    ]);
    console.log('10 Students créés.');
    const t = teachers;
    const courses = await Course.insertMany([
        { title: 'Développement Web avec la Stack MERN', description: 'React, Express, MongoDB, Node.js', departement: d[0]._id, teacher: t[0]._id, duration: 30, level: 'Intermédiaire', image: 'cours.jpg' },
        { title: 'Introduction à l\'Intelligence Artificielle', description: 'Concepts fondamentaux de l\'IA', departement: d[5]._id, teacher: t[1]._id, duration: 25, level: 'Débutant', image: 'cours.jpg' },
        { title: 'Sécurité des Réseaux', description: 'Firewalls, VPN, cryptographie', departement: d[4]._id, teacher: t[3]._id, duration: 20, level: 'Avancé', image: 'cours.jpg' },
        { title: 'Bases de Données Relationnelles', description: 'SQL, modélisation, optimisation', departement: d[0]._id, teacher: t[4]._id, duration: 18, level: 'Intermédiaire', image: 'cours.jpg' },
        { title: 'DevOps et Déploiement Cloud', description: 'Docker, CI/CD, AWS', departement: d[0]._id, teacher: t[5]._id, duration: 22, level: 'Avancé', image: 'cours.jpg' },
        { title: 'Développement Mobile avec React Native', description: 'Applications iOS et Android', departement: d[0]._id, teacher: t[6]._id, duration: 24, level: 'Intermédiaire', image: 'cours.jpg' },
        { title: 'Machine Learning appliqué', description: 'Scikit-learn, TensorFlow', departement: d[5]._id, teacher: t[7]._id, duration: 28, level: 'Avancé', image: 'cours.jpg' },
        { title: 'Systèmes Embarqués', description: 'Microcontrôleurs et IoT', departement: d[6]._id, teacher: t[8]._id, duration: 26, level: 'Intermédiaire', image: 'cours.jpg' },
        { title: 'Design UI/UX pour le Web', description: 'Figma, prototypage, ergonomie', departement: d[9]._id, teacher: t[9]._id, duration: 15, level: 'Débutant', image: 'cours.jpg' },
        { title: 'Réseaux Informatiques', description: 'TCP/IP, routage, switching', departement: d[4]._id, teacher: t[2]._id, duration: 20, level: 'Débutant', image: 'cours.jpg' },
]);
    console.log('10 Courses créés.');
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
    console.log('10 Modules créés.');
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
    console.log('10 Lessons créées.');
    const quizzes = await Quiz.insertMany([
        { course: courses[0]._id, title: 'Quiz 1 : Notions de base Express.js', description: 'Test sur les middlewares et le routage', duration: 15, passingScore: 60, isPublished: true, createdBy: t[0]._id },
        { course: courses[0]._id, title: 'Quiz 2 : React fondamentaux', description: 'Props, state, hooks', duration: 2, passingScore: 60, isPublished: true, createdBy: t[0]._id },
        { course: courses[1]._id, title: 'Quiz 1 : Bases de l\'IA', description: 'Concepts fondamentaux', duration: 2, passingScore: 50, isPublished: true, createdBy: t[1]._id },
        { course: courses[2]._id, title: 'Quiz 1 : Cryptographie', description: 'Chiffrement et sécurité', duration: 2, passingScore: 70, isPublished: false, createdBy: t[3]._id },
        { course: courses[3]._id, title: 'Quiz 1 : SQL avancé', description: 'Jointures et sous-requêtes', duration: 2, passingScore: 60, isPublished: true, createdBy: t[4]._id },
        { course: courses[4]._id, title: 'Quiz 1 : Docker & CI/CD', description: 'Conteneurisation', duration: 2, passingScore: 55, isPublished: true, createdBy: t[5]._id },
        { course: courses[5]._id, title: 'Quiz 1 : React Native', description: 'Composants natifs', duration: 2, passingScore: 60, isPublished: false, createdBy: t[6]._id },
        { course: courses[6]._id, title: 'Quiz 1 : Machine Learning', description: 'Algorithmes supervisés', duration: 2, passingScore: 65, isPublished: true, createdBy: t[7]._id },
        { course: courses[7]._id, title: 'Quiz 1 : Arduino & IoT', description: 'Microcontrôleurs', duration: 2, passingScore: 50, isPublished: true, createdBy: t[8]._id },
        { course: courses[8]._id, title: 'Quiz 1 : Design UI', description: 'Bonnes pratiques UX', duration: 2, passingScore: 50, isPublished: true, createdBy: t[9]._id },
    ]);
    console.log('10 Quizzes créés.');
    const quizQuestionsData = [
        { 
            questions: [
                { statement: 'Quel middleware permet de parser le JSON dans Express ?', type: 'MCQ', points: 2,
                    choices: ['express.json()', 'body-parser.raw()', 'cors()', 'morgan()'], correctIndex: 0 },
                { statement: 'Quelle méthode HTTP est utilisée pour créer une ressource ?', type: 'MCQ', points: 2,
                    choices: ['GET', 'POST', 'DELETE', 'PATCH'], correctIndex: 1 },
                { statement: 'Quel objet contient les paramètres de route dans Express ?', type: 'MCQ', points: 2,
                    choices: ['req.query', 'req.body', 'req.params', 'req.headers'], correctIndex: 2 },
            ]
        },
        { 
            questions: [
                { statement: 'Qu\'est-ce qu\'un hook React ?', type: 'MCQ', points: 3,
                    choices: ['Une fonction pour utiliser l\'état et d\'autres fonctionnalités React dans un composant fonctionnel', 'Un composant de classe', 'Une balise HTML spéciale', 'Un fichier de configuration'], correctIndex: 0 },
                { statement: 'Quel hook permet de gérer l\'état local d\'un composant ?', type: 'MCQ', points: 2,
                    choices: ['useEffect', 'useState', 'useContext', 'useRef'], correctIndex: 1 },
                { statement: 'Quel hook s\'exécute après le rendu du composant ?', type: 'MCQ', points: 2,
                    choices: ['useMemo', 'useState', 'useEffect', 'useCallback'], correctIndex: 2 },
            ]
        },
        { 
            questions: [
                { statement: 'L\'IA forte existe-t-elle aujourd\'hui ?', type: 'TrueFalse', points: 1,
                    choices: ['Vrai', 'Faux'], correctIndex: 1 },
                { statement: 'Qui est considéré comme le père de l\'IA moderne ?', type: 'MCQ', points: 2,
                    choices: ['Alan Turing', 'Isaac Newton', 'Charles Darwin', 'Nikola Tesla'], correctIndex: 0 },
                { statement: 'Le Machine Learning est un sous-domaine de...', type: 'MCQ', points: 2,
                    choices: ['L\'intelligence artificielle', 'La physique quantique', 'Le design graphique', 'La chimie organique'], correctIndex: 0 },
            ]
        },
        { 
            questions: [
                { statement: 'Quel type de chiffrement est utilisé par AES ?', type: 'MCQ', points: 2,
                    choices: ['Chiffrement par blocs symétrique', 'Chiffrement asymétrique RSA', 'Fonction de hachage', 'Signature numérique'], correctIndex: 0 },
                { statement: 'Que permet une clé publique en cryptographie asymétrique ?', type: 'MCQ', points: 2,
                    choices: ['Déchiffrer uniquement', 'Chiffrer des messages destinés au propriétaire de la paire de clés', 'Signer un mot de passe', 'Créer un certificat SSL'], correctIndex: 1 },
                { statement: 'Quel protocole sécurise les échanges HTTP ?', type: 'MCQ', points: 2,
                    choices: ['FTP', 'HTTP', 'HTTPS', 'SMTP'], correctIndex: 2 },
            ]
        },
        { 
            questions: [
                { statement: 'Quelle clause SQL permet de filtrer après un GROUP BY ?', type: 'MCQ', points: 2,
                    choices: ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'], correctIndex: 0 },
                { statement: 'Quelle jointure retourne toutes les lignes des deux tables ?', type: 'MCQ', points: 2,
                    choices: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correctIndex: 3 },
                { statement: 'Quelle commande crée une nouvelle table ?', type: 'MCQ', points: 2,
                    choices: ['CREATE TABLE', 'ALTER TABLE', 'INSERT INTO', 'UPDATE TABLE'], correctIndex: 0 },
            ]
        },
        { 
            questions: [
                { statement: 'Quelle commande construit une image Docker ?', type: 'MCQ', points: 2,
                    choices: ['docker build', 'docker run', 'docker pull', 'docker exec'], correctIndex: 0 },
                { statement: 'Quel fichier définit la construction d\'une image Docker ?', type: 'MCQ', points: 2,
                    choices: ['docker-compose.yml', 'Dockerfile', 'package.json', '.dockerignore'], correctIndex: 1 },
                { statement: 'Que signifie CI/CD ?', type: 'MCQ', points: 2,
                    choices: ['Continuous Integration / Continuous Deployment', 'Code Inspection / Code Delivery', 'Cloud Infra / Cloud Deploy', 'Container Image / Container Deploy'], correctIndex: 0 },
            ]
        },
        { 
            questions: [
                { statement: 'React Native compile-t-il en composants natifs ?', type: 'TrueFalse', points: 1,
                    choices: ['Vrai', 'Faux'], correctIndex: 0 },
                { statement: 'Quel composant affiche du texte en React Native ?', type: 'MCQ', points: 2,
                    choices: ['<Text>', '<p>', '<div>', '<span>'], correctIndex: 0 },
                { statement: 'Quelle commande lance un projet Expo ?', type: 'MCQ', points: 2,
                    choices: ['npm run build', 'expo start', 'react-native init', 'npm test'], correctIndex: 1 },
            ]
        },
        { 
            questions: [
                { statement: 'Quel est le rôle de la fonction de coût en ML ?', type: 'MCQ', points: 3,
                    choices: ['Mesurer l\'erreur entre prédiction et valeur réelle', 'Générer des données aléatoires', 'Afficher un graphique', 'Compiler le code'], correctIndex: 0 },
                { statement: 'Qu\'est-ce que le sur-apprentissage (overfitting) ?', type: 'MCQ', points: 2,
                    choices: ['Le modèle apprend trop bien les données d\'entraînement mais généralise mal', 'Le modèle est trop simple', 'Le modèle manque de données', 'Le modèle converge trop vite'], correctIndex: 0 },
                { statement: 'Quel algorithme est utilisé pour une classification binaire ?', type: 'MCQ', points: 2,
                    choices: ['Régression linéaire', 'Régression logistique', 'K-means', 'PCA'], correctIndex: 1 },
            ]
        },
        { 
            questions: [
                { statement: 'Quelle fonction lit une valeur analogique sur Arduino ?', type: 'MCQ', points: 2,
                    choices: ['analogRead()', 'digitalWrite()', 'pinMode()', 'delay()'], correctIndex: 0 },
                { statement: 'Quelle est la tension de fonctionnement typique d\'un Arduino Uno ?', type: 'MCQ', points: 2,
                    choices: ['3.3V', '5V', '9V', '12V'], correctIndex: 1 },
                { statement: 'Quel protocole est couramment utilisé en IoT ?', type: 'MCQ', points: 2,
                    choices: ['MQTT', 'FTP', 'SMTP', 'RDP'], correctIndex: 0 },
            ]
        },
        { 
            questions: [
                { statement: 'Qu\'est-ce que le contraste en design UI ?', type: 'MCQ', points: 2,
                    choices: ['La différence visuelle entre deux éléments', 'La taille de la police', 'Le nombre de couleurs utilisées', 'L\'alignement des éléments'], correctIndex: 0 },
                { statement: 'Quel outil est couramment utilisé pour le prototypage UI ?', type: 'MCQ', points: 2,
                    choices: ['Figma', 'Excel', 'Word', 'Notepad'], correctIndex: 0 },
                { statement: 'Que signifie UX ?', type: 'MCQ', points: 2,
                    choices: ['User Experience', 'User Exchange', 'Universal Experience', 'User Extension'], correctIndex: 0 },
            ]
        },
    ];

    const questionDocs = [];
    quizQuestionsData.forEach((quizData, quizIndex) => {
        quizData.questions.forEach((q, order) => {
            questionDocs.push({
                quiz: quizzes[quizIndex]._id,
                statement: q.statement,
                type: q.type,
                points: q.points,
                order: order + 1,
            });
        });
    });
    const insertedQuestions = await Question.insertMany(questionDocs);
    console.log(`${insertedQuestions.length} Questions créées.`);
    const choiceDocs = [];
    let qCursor = 0;
    quizQuestionsData.forEach((quizData) => {
        quizData.questions.forEach((q) => {
            const questionId = insertedQuestions[qCursor]._id;
            q.choices.forEach((choiceText, choiceOrder) => {
                choiceDocs.push({
                    question: questionId,
                    text: choiceText,
                    isCorrect: choiceOrder === q.correctIndex,
                    order: choiceOrder + 1,
                });
            });
            qCursor++;
        });
    });
    const insertedChoices = await Choice.insertMany(choiceDocs);
    console.log(`${insertedChoices.length} Choices créées.`);
    const questionChoiceGroups = [];
    let choiceCursor = 0;
    quizQuestionsData.forEach((quizData) => {
        quizData.questions.forEach((q) => {
            const group = insertedChoices.slice(choiceCursor, choiceCursor + q.choices.length);
            questionChoiceGroups.push(group);
            choiceCursor += q.choices.length;
        });
    });
    const firstQuestionIndexByQuiz = quizQuestionsData.map((_, quizIndex) => quizIndex * 3);
    const quizAttempts = await QuizAttempt.insertMany([
        { student: students[0]._id, quiz: quizzes[0]._id, score: 80, totalQuestions: 3, startedAt: new Date('2026-06-01T10:00:00'), submittedAt: new Date('2026-06-01T10:14:00'), duration: 14 },
        { student: students[1]._id, quiz: quizzes[1]._id, score: 60, totalQuestions: 3, startedAt: new Date('2026-06-02T09:00:00'), submittedAt: new Date('2026-06-02T09:12:00'), duration: 12 },
        { student: students[2]._id, quiz: quizzes[2]._id, score: 40, totalQuestions: 3, startedAt: new Date('2026-06-02T11:00:00'), submittedAt: new Date('2026-06-02T11:09:00'), duration: 9 },
        { student: students[3]._id, quiz: quizzes[3]._id, score: 90, totalQuestions: 3, startedAt: new Date('2026-06-03T14:00:00'), submittedAt: new Date('2026-06-03T14:18:00'), duration: 18 },
        { student: students[4]._id, quiz: quizzes[4]._id, score: 70, totalQuestions: 3, startedAt: new Date('2026-06-03T15:00:00'), submittedAt: new Date('2026-06-03T15:13:00'), duration: 13 },
        { student: students[5]._id, quiz: quizzes[5]._id, score: 55, totalQuestions: 3, startedAt: new Date('2026-06-04T10:00:00'), submittedAt: new Date('2026-06-04T10:11:00'), duration: 11 },
        { student: students[6]._id, quiz: quizzes[6]._id, score: 65, totalQuestions: 3, startedAt: new Date('2026-06-04T16:00:00'), submittedAt: new Date('2026-06-04T16:14:00'), duration: 14 },
        { student: students[7]._id, quiz: quizzes[7]._id, score: 85, totalQuestions: 3, startedAt: new Date('2026-06-05T09:30:00'), submittedAt: new Date('2026-06-05T09:48:00'), duration: 18 },
        { student: students[8]._id, quiz: quizzes[8]._id, score: 50, totalQuestions: 3, startedAt: new Date('2026-06-05T13:00:00'), submittedAt: new Date('2026-06-05T13:09:00'), duration: 9 },
        { student: students[9]._id, quiz: quizzes[9]._id, score: 75, totalQuestions: 3, startedAt: new Date('2026-06-06T10:00:00'), submittedAt: new Date('2026-06-06T10:09:00'), duration: 9 },
    ]);
    console.log('10 QuizAttempts créés.');
    const wasCorrectByAttempt = [true, true, false, true, true, false, true, true, true, true];
    const answerDocs = quizAttempts.map((attempt, i) => {
        const qIndex = firstQuestionIndexByQuiz[i];
        const question = insertedQuestions[qIndex];
        const group = questionChoiceGroups[qIndex];
        const wasCorrect = wasCorrectByAttempt[i];
        const chosen = wasCorrect
            ? group.find((c) => c.isCorrect)
            : group.find((c) => !c.isCorrect) || group[0];
        return {
            attempt: attempt._id,
            question: question._id,
            selectedChoice: chosen._id,
            textAnswer: '',
            isCorrect: wasCorrect,
            pointsEarned: wasCorrect ? question.points : 0,
        };
    });
    await Answer.insertMany(answerDocs);
    console.log('10 Answers créées.');

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
    console.log('10 AuditLogs créés.');
    await DashboardData.insertMany([
        { user: students[0]._id, totalCourses: 3, averageScore: 78, attendanceRate: 90, progress: 100, rank: 1 },
        { user: students[1]._id, totalCourses: 2, averageScore: 65, attendanceRate: 80, progress: 45, rank: 4 },
        { user: students[2]._id, totalCourses: 4, averageScore: 55, attendanceRate: 70, progress: 30, rank: 8 },
        { user: students[3]._id, totalCourses: 5, averageScore: 92, attendanceRate: 95, progress: 100, rank: 1 },
        { user: students[4]._id, totalCourses: 3, averageScore: 70, attendanceRate: 85, progress: 50, rank: 5 },
        { user: students[5]._id, totalCourses: 2, averageScore: 60, attendanceRate: 75, progress: 40, rank: 6 },
        { user: students[6]._id, totalCourses: 3, averageScore: 68, attendanceRate: 82, progress: 55, rank: 3 },
        { user: students[7]._id, totalCourses: 4, averageScore: 88, attendanceRate: 93, progress: 75, rank: 2 },
        { user: students[8]._id, totalCourses: 1, averageScore: 50, attendanceRate: 60, progress: 20, rank: 10 },
        { user: students[9]._id, totalCourses: 3, averageScore: 74, attendanceRate: 88, progress: 65, rank: 3 },
    ]);
    console.log('10 DashboardData créés.');
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
    console.log('10 Inscriptions créées.');
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
    console.log('10 PerformanceMetrics créés.');
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
    console.log('10 Notifications créées.');
    console.log('Seeding terminé.');
    process.exit(0);
    } catch (error) {
    console.error(' Erreur durant le seeding :', error);
    process.exit(1);
    }
};
seedDatabase();