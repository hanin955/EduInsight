import { useLocation, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import DashboardLayout from '../../../layouts/DashboardLayout';
import UsersPage from './UsersPage';
import CoursesPage from './CoursesPage';
import QuizzesPage from './QuizzesPage';
import StudentsPage from './StudentsPage';
import SettingsPage from './SettingsPage';
import AnalyticsPage from './AnalyticsPage';
import DepartementsPage from './DepartementsPage';
import ModulesPage from './ModulesPage';
import LessonsPage from './LessonsPage';
import DocsPage from './DocsPage';
import StatCard, { Data } from '../../components/statcard';
import PlatformGrowthChart from '../../components/dashboard/PlatformGrowthChart';
import UserByRoleChart from '../../components/dashboard/UserByRoleChart';
import { PieChart, Users, BookOpen, Puzzle, GraduationCap, BarChart2, FileText, Settings, Building2, Layers, PlaySquare } from 'lucide-react';
const adminMenus = [
  { label: 'Dashboard', link: '/Admin', icon: PieChart },
  { label: 'Users', link: '/Admin/Users', icon: Users },
  { label: 'Courses', link: '/Admin/Courses', icon: BookOpen },
  { label: 'Modules', link: '/Admin/Modules', icon: Layers },
  { label: 'Lessons', link: '/Admin/Lessons', icon: PlaySquare },
  { label: 'Quizzes', link: '/Admin/Quizzes', icon: Puzzle },
  { label: 'Students', link: '/Admin/Students', icon: GraduationCap },
  { label: 'Departements', link: '/Admin/Departements', icon: Building2 },
  { label: 'Analytics', link: '/Admin/Analytics', icon: BarChart2 },
  { label: 'Docs', link: '/Admin/Docs', icon: FileText },
  { label: 'Settings', link: '/Admin/Settings', icon: Settings },
];
const pageInfo = {
  '/Admin': { title: 'Admin Dashboard', subtitle: 'Overview' },
  '/Admin/Users': { title: 'User Management', subtitle: 'Manage users' },
  '/Admin/Courses': { title: 'Courses', subtitle: 'Manage courses' },
  '/Admin/Modules': { title: 'Modules', subtitle: 'Manage modules' },
  '/Admin/Lessons': { title: 'Lessons', subtitle: 'Manage lessons' },
  '/Admin/Quizzes': { title: 'Quizzes', subtitle: 'Manage quizzes' },
  '/Admin/Students': { title: 'Students', subtitle: 'Manage students' },
  '/Admin/Departements': { title: 'Departements', subtitle: 'Manage departements' },
  '/Admin/Analytics': { title: 'Analytics', subtitle: 'Platform EduInsights' },
  '/Admin/Docs': { title: 'Docs', subtitle: 'Documentation' },
  '/Admin/Settings': { title: 'Settings', subtitle: 'Platform settings' },
};
function DashboardOverview() {
  const { courses, users, metrics, attempts, loading } = Data({
    courses: true,
    users: true,
    metrics: true,
    attempts: true,
  });
  const [growthData, setGrowthData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      api.get('/statistics/platform-growth'),
      api.get('/statistics/users-by-role')
    ])
      .then(([growthRes, roleRes]) => {
        setGrowthData(growthRes.data.data);
        setRoleData(roleRes.data.data);
      })
      .catch((err) => console.error("Erreur chargement dashboard:", err))
      .finally(() => setChartsLoading(false));
  }, []);
  const avgGrade =
    metrics.length > 0
      ? metrics.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0) / metrics.length
      : 0;
  const completedAttempts = attempts.filter((a) => a.submittedAt).length;
  const quizCompletion = attempts.length > 0 ? (completedAttempts / attempts.length) * 100 : 0;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={loading ? '...' : users.length.toLocaleString()}
          subtext="+12% this month"
        />
        <StatCard
          label="Active Courses"
          value={loading ? '...' : courses.length}
        />
        <StatCard
          label="Quiz Completion"
          value={loading ? '...' : `${quizCompletion.toFixed(1)}%`}
        />
        <StatCard
          label="Avg Grade"
          value={loading ? '...' : `${avgGrade.toFixed(1)}%`}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Platform Growth</h3>
          {chartsLoading ? <p>Chargement...</p> : <PlatformGrowthChart data={growthData} />}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">User Distribution</h3>
          {chartsLoading ? <p>Chargement...</p> : <UserByRoleChart data={roleData} />}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mt-4">
        <h3 className="font-semibold text-lg mb-3">Recent Alerts</h3>
        <ul className="space-y-2 text-sm">
          <li> 2 courses have low completion rates</li>
          <li> Server health: Optimal</li>
        </ul>
      </div>
    </>
  );
}
export default function AdminDashboard() {
  const location = useLocation();
  const current = pageInfo[location.pathname] || pageInfo['/Admin'];
  return (
    <DashboardLayout title={current.title} subtitle={current.subtitle} menus={adminMenus}>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/Users" element={<UsersPage />} />
        <Route path="/Quizzes" element={<QuizzesPage />} />
        <Route path="/Courses" element={<CoursesPage />} />
        <Route path="/Modules" element={<ModulesPage />} />
        <Route path="/Lessons" element={<LessonsPage />} />
        <Route path="/Students" element={<StudentsPage />} />
        <Route path="/Departements" element={<DepartementsPage />} />
        <Route path="/Analytics" element={<AnalyticsPage />} />
        <Route path="/Docs" element={<DocsPage />} />
        <Route path="/Settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}