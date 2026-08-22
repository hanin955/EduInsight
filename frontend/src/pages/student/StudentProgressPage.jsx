import StatCard, { Data } from '../../components/statcard';
import GradeHistoryChart from '../../components/dashboard/GradeHistoryChart';
function StatusBadge({ status }) {
  const styles = {
    'in progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  };
  const labels = { 'in progress': 'In Progress', completed: 'Completed' };
  const key = status === 'completed' ? 'completed' : 'in progress';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[key]}`}>
      {labels[key]}
    </span>
  );
}
export default function StudentProgressPage() {
  const { courses, inscriptions, metrics, loading, error } = Data({
    courses: true,
    inscriptions: true,
    metrics: true,
  });
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();
  const studentId = currentUser?.id;
  const myInscriptions = inscriptions.filter(
    (ins) => ins.student === studentId || ins.student?._id === studentId
  );
  const coursesCompleted = myInscriptions.filter((ins) => ins.status === 'completed').length;
  const myMetrics = metrics.filter(
    (m) => m.student === studentId || m.student?._id === studentId
  );
  const averageGrade =
    myMetrics.length > 0
      ? (myMetrics.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0) / myMetrics.length).toFixed(1)
      : 0;
  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === (courseId?._id || courseId));
    return course?.title || '—';
  };
  const getCourseGrade = (courseId) => {
    const relevant = myMetrics.filter((m) => (m.course?._id || m.course) === courseId);
    if (relevant.length === 0) return null;
    const avg = relevant.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0) / relevant.length;
    return avg.toFixed(0);
  };
  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Courses Completed" value={loading ? '...' : coursesCompleted} />
        <StatCard label="Average Grade" value={loading ? '...' : `${averageGrade}%`} />
      </div>
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Grade History</h3>
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : myMetrics.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune donnée de progression pour le moment.</p>
        ) : (
          <GradeHistoryChart data={myMetrics} />
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Grade</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400">
                  Chargement...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && myInscriptions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400">
                  Aucune inscription pour le moment.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              myInscriptions.map((ins) => {
                const courseId = ins.course?._id || ins.course;
                const grade = getCourseGrade(courseId);
                return (
                  <tr
                    key={ins._id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {getCourseTitle(courseId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                      {grade !== null ? `${grade}%` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ins.status} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}