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

function StateBox({ tone = 'default', children }) {
  const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
      {children}
    </div>
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
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Grade History</h3>
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : myMetrics.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune donnée de progression pour le moment.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto sm:mx-0">
            <GradeHistoryChart data={myMetrics} />
          </div>
        )}
      </div>

      {loading ? (
        <StateBox>Chargement...</StateBox>
      ) : error ? (
        <StateBox tone="error">{error}</StateBox>
      ) : myInscriptions.length === 0 ? (
        <StateBox>Aucune inscription pour le moment.</StateBox>
      ) : (
        <>
          {/* Table view - tablette & PC */}
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Grade</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {myInscriptions.map((ins) => {
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

          {/* Card view - mobile */}
          <div className="space-y-3 md:hidden">
            {myInscriptions.map((ins) => {
              const courseId = ins.course?._id || ins.course;
              const grade = getCourseGrade(courseId);
              return (
                <div
                  key={ins._id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {getCourseTitle(courseId)}
                    </p>
                    <StatusBadge status={ins.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-900 dark:text-white">
                    Grade : {grade !== null ? `${grade}%` : '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}