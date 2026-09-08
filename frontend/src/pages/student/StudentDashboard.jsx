import { useLocation, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import StudentCoursesPage from './StudentCoursesPage';
import StudentCourseDetailPage from './StudentCourseDetailPage';
import StudentLessonPage from './StudentLessonPage';
import StudentQuizzesPage from './StudentQuizzesPage';
import StudentProgressPage from './StudentProgressPage';
import CertificatesPage from './CertificatesPage';
import QuizAttemptPage from './QuizAttemptPage';
import DocsPage from '../admin/DocsPage';
import { BookOpen, Puzzle, BarChart2, Award, FileText } from 'lucide-react';
const studentMenus = [
  { label: 'My Courses', link: '/Student/My_Courses', icon: BookOpen },
  { label: ' My Quizzes', link: '/Student/My_Quizzes', icon: Puzzle },
  { label: 'My Progress', link: '/Student/My_Progress', icon: BarChart2 },
  { label: 'Certificates', link: '/Student/Certificates', icon: Award },
  { label: 'Docs', link: '/student/Docs', icon: FileText },
];
const pageInfo = {
  '/Student': { title: 'My Courses', subtitle: 'Enroll & learn' },
  '/Student/My_Courses': { title: 'My Courses', subtitle: 'Enroll & learn' },
  '/Student/My_Quizzes': { title: 'My Quizzes', subtitle: 'Assessments' },
  '/Student/My_Progress': { title: 'My Progress', subtitle: 'Track your growth' },
  '/Student/Certificates': { title: 'Certificates', subtitle: 'Your achievements' },
  '/student/Docs': { title: 'Docs', subtitle: 'Documentation' },
};
export default function StudentDashboard() {
  const location = useLocation();
  const current = pageInfo[location.pathname] || pageInfo['/Student'];
  return (
    <DashboardLayout title={current.title} subtitle={current.subtitle} menus={studentMenus}>
      <Routes>
        <Route path="/" element={<StudentCoursesPage />} />
        <Route path="/My_Courses" element={<StudentCoursesPage />} />
        <Route path="/My_Courses/:courseId" element={<StudentCourseDetailPage />} />
        <Route path="/My_Courses/:courseId/lesson/:lessonId" element={<StudentLessonPage />} />
        <Route path="/My_Quizzes" element={<StudentQuizzesPage />} />
        <Route path="/My_Progress" element={<StudentProgressPage />} />
        <Route path="/Certificates" element={<CertificatesPage />} />
        <Route path="/My_Quizzes/attempt/:attemptId" element={<QuizAttemptPage />} />
        <Route path="/Docs" element={<DocsPage />} />
      </Routes>
    </DashboardLayout>
  );
}