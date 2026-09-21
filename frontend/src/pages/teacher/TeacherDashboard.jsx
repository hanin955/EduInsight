import { useLocation, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { BookOpen, Puzzle, GraduationCap, FileText, Settings, Layers, PlaySquare } from 'lucide-react';
import TeacherCoursesPage from './TeacherCoursesPage';
import TeacherQuizzesPage from './TeacherQuizzesPage';
import TeacherStudentsPage from './TeacherStudentsPage';
import SettingsPage from '../admin/SettingsPage';
import TeacherModulesPage from './TeacherModulesPage';
import TeacherLessonsPage from './TeacherLessonsPage';
import DocsPage from '../admin/DocsPage';
const teacherMenus = [
  { label: 'Courses', link: '/teacher/courses', icon: BookOpen },
  { label: 'Modules', link: '/teacher/modules', icon: Layers },
  { label: 'Lessons', link: '/teacher/lessons', icon: PlaySquare },
  { label: 'Quizzes', link: '/teacher/quizzes', icon: Puzzle },
  { label: 'Students', link: '/teacher/students', icon: GraduationCap },
  { label: 'Docs', link: '/teacher/docs', icon: FileText },
  { label: 'Settings', link: '/teacher/settings', icon: Settings },
];
const pageInfo = {
  '/teacher': { title: 'Teacher Dashboard', subtitle: 'Overview' },
  '/teacher/courses': { title: 'Courses', subtitle: 'Manage courses' },
  '/teacher/modules': { title: 'Modules', subtitle: 'Manage modules' },
  '/teacher/lessons': { title: 'Lessons', subtitle: 'Manage lessons' },
  '/teacher/quizzes': { title: 'Quizzes', subtitle: 'Assessments' },
  '/teacher/students': { title: 'Students', subtitle: 'Learner management' },
  '/teacher/docs': { title: 'Docs', subtitle: 'Documentation' },
  '/teacher/settings': { title: 'Settings', subtitle: 'Account settings' },
};
export default function TeacherDashboard() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const current = pageInfo[currentPath] || pageInfo['/teacher'];
  return (
    <DashboardLayout title={current.title} subtitle={current.subtitle} menus={teacherMenus}>
      <Routes>
        <Route index element={<TeacherCoursesPage />} />
        <Route path="courses" element={<TeacherCoursesPage />} />
        <Route path="modules" element={<TeacherModulesPage />} />
        <Route path="lessons" element={<TeacherLessonsPage />} />
        <Route path="quizzes" element={<TeacherQuizzesPage />} />
        <Route path="students" element={<TeacherStudentsPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}