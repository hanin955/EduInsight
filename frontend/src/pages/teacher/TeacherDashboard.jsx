import { useLocation, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { BookOpen, Puzzle, GraduationCap, FileText, Settings } from 'lucide-react';
import TeacherCoursesPage from './TeacherCoursesPage';
import TeacherQuizzesPage from './TeacherQuizzesPage';
import TeacherStudentsPage from './TeacherStudentsPage'
import SettingsPage from '../admin/SettingsPage';
const teacherMenus = [
  { label: 'Courses', link: '/Teacher/Courses', icon: BookOpen },
  { label: 'Quizzes', link: '/Teacher/Quizzes', icon: Puzzle },
  { label: 'Students', link: '/Teacher/Students', icon: GraduationCap },
  { label: 'Docs', link: '/Teacher/Docs', icon: FileText },
  { label: 'Settings', link: '/Teacher/Settings', icon: Settings },
];
const pageInfo = {
  '/Teacher': { title: 'Teacher Dashboard', subtitle: 'Overview' },
  '/Teacher/Courses': { title: 'Courses', subtitle: 'Manage courses' },
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
        <Route path="/Quizzes" element={<TeacherQuizzesPage />} />
        <Route path="/Students" element={<TeacherStudentsPage />} />
        <Route path="/Docs" element={<div>Page Docs</div>} />
        <Route path="/Settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}