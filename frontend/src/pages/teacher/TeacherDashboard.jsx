import { useLocation, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { BookOpen, Puzzle, GraduationCap, FileText, Settings, Layers, PlaySquare } from 'lucide-react';
import TeacherCoursesPage from './TeacherCoursesPage';
import TeacherQuizzesPage from './TeacherQuizzesPage';
import TeacherStudentsPage from './TeacherStudentsPage'
import SettingsPage from '../admin/SettingsPage';
import TeacherModulesPage from './TeacherModulesPage';
import TeacherLessonsPage from './TeacherLessonsPage';
import DocsPage from '../admin/DocsPage';
const teacherMenus = [
  { label: 'Courses', link: '/Teacher/Courses', icon: BookOpen },
  { label: 'Modules', link: '/Teacher/Modules', icon: Layers },
  { label: 'Lessons', link: '/Teacher/Lessons', icon: PlaySquare },
  { label: 'Quizzes', link: '/Teacher/Quizzes', icon: Puzzle },
  { label: 'Students', link: '/Teacher/Students', icon: GraduationCap },
  { label: 'Docs', link: '/Teacher/Docs', icon: FileText },
  { label: 'Settings', link: '/Teacher/Settings', icon: Settings },
];
const pageInfo = {
  '/Teacher': { title: 'Teacher Dashboard', subtitle: 'Overview' },
  '/Teacher/Courses': { title: 'Courses', subtitle: 'Manage courses' },
  '/Teacher/Modules': { title: 'Modules', subtitle: 'Manage modules' },
  '/Teacher/Lessons': { title: 'Lessons', subtitle: 'Manage lessons' },
  '/Teacher/Quizzes': { title: 'Quizzes', subtitle: 'Assessments' },
  '/Teacher/Students': { title: 'Students', subtitle: 'Learner management' },
  '/Teacher/Docs': { title: 'Docs', subtitle: 'Documentation' },
  '/Teacher/Settings': { title: 'Settings', subtitle: 'Account settings' },
};
export default function TeacherDashboard() {
  const location = useLocation();
  const current = pageInfo[location.pathname] || pageInfo['/Teacher'];
  return (
    <DashboardLayout title={current.title} subtitle={current.subtitle} menus={teacherMenus}>
      <Routes>
        <Route path="/" element={<TeacherCoursesPage />} />
        <Route path="/Courses" element={<TeacherCoursesPage />} />
        <Route path="/Modules" element={<TeacherModulesPage />} />
        <Route path="/Lessons" element={<TeacherLessonsPage />} />
        <Route path="/Quizzes" element={<TeacherQuizzesPage />} />
        <Route path="/Students" element={<TeacherStudentsPage />} />
        <Route path="/Docs" element={<DocsPage />} />
        <Route path="/Settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}