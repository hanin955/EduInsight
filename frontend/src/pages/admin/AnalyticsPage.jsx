import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { Data } from '../../components/statcard';
import StatCard from '../../components/statcard';
import StudentsByGradeChart from '../../components/Dashboard/StudentsByGradeChart';
import CourseCompletionChart from '../../components/Dashboard/CourseCompletionChart';

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

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                        Grade Distribution
                    </h3>
                    {chartsLoading ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">Chargement...</p>
                    ) : (
                        <StudentsByGradeChart data={gradeData} />
                    )}
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                        Course Completion
                    </h3>
                    {chartsLoading ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">Chargement...</p>
                    ) : (
                        <CourseCompletionChart data={completionData} />
                    )}
                </div>
            </div>
        </>
    );
}