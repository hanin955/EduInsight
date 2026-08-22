import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { Data } from '../../components/statcard';
import StatCard from '../../components/statcard';
import StudentsByGradeChart from '../../components/dashboard/StudentsByGradeChart';
import CourseCompletionChart from '../../components/dashboard/CourseCompletionChart';
export default function AnalyticsPage() {
    const { courses, users, loading } = Data({ courses: true, users: true });
    const [gradeData, setGradeData] = useState([]);
    const [completionData, setCompletionData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({ averageScore: 0, averageProgress: 0 });
    const [chartsLoading, setChartsLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            api.get('/statistics/students-by-grade'),
            api.get('/statistics/course-completion'),
            api.get('/statistics/dashboard')
        ])
        .then(([gradeRes, completionRes, dashRes]) => {
            setGradeData(gradeRes.data.data);
            setCompletionData(completionRes.data.data);
            setDashboardStats(dashRes.data.data);
        })
        .catch((err) => console.error("Erreur chargement analytics:", err))
        .finally(() => setChartsLoading(false));
    }, []);
    const activeStudents = users.filter((u) => u.role === "student").length;
    return (
    <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Completion Rate" value={chartsLoading ? '...' : `${dashboardStats.averageProgress}%`} />
            <StatCard label="Avg Quiz Score" value={chartsLoading ? '...' : `${dashboardStats.averageScore}%`} />
            <StatCard label="Active Students" value={loading ? '...' : activeStudents.toLocaleString()} />
            <StatCard label="Courses" value={loading ? '...' : courses.length} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Grade Distribution</h3>
                {chartsLoading ? <p>Chargement...</p> : <StudentsByGradeChart data={gradeData} />}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Course Completion</h3>
                {chartsLoading ? <p>Chargement...</p> : <CourseCompletionChart data={completionData} />}
            </div>
        </div>
    </>
    );
}