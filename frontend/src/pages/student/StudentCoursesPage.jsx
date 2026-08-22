import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import StatCard, { Data} from '../../components/statcard';

const BACKEND_URL = 'http://localhost:5000';

function CourseThumbnail({ image, title }) {
  if (!image) {
    return (
      <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-800">
        —
      </div>
    );
  }
  return (
    <img
      src={`${BACKEND_URL}/uploads/${image}`}
      alt={title}
      className="h-10 w-14 shrink-0 rounded-lg object-cover"
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
}

function StatusBadge({ status }) {
 const styles = {
    enrolled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    available: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  };
  const labels = { enrolled: 'Enrolled', completed: 'Completed', available: 'Available' };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function StudentCoursesPage() {
  const { courses, inscriptions, metrics, loading, error, reload } = Data({
    courses: true,
    inscriptions: true,
    metrics: true,
  });
  const [enrollingId, setEnrollingId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

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

  const getInscription = (courseId) =>
    myInscriptions.find((ins) => (ins.course?._id || ins.course) === courseId);

  const getStatus = (courseId) => {
    const ins = getInscription(courseId);
    if (!ins) return 'available';
    return ins.status === 'completed' ? 'completed' : 'enrolled';
  };

  const enrolledCount = myInscriptions.filter((i) => i.status !== 'dropped').length;
  const completedCount = myInscriptions.filter((i) => i.status === 'completed').length;

  const myMetrics = metrics.filter(
    (m) => m.student === studentId || m.student?._id === studentId
  );
  const avgGrade =
    myMetrics.length > 0
      ? (myMetrics.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0) / myMetrics.length).toFixed(1)
      : 0;

  const totalPages = Math.max(1, Math.ceil(courses.length / limit));
  const paginatedCourses = courses.slice((page - 1) * limit, page * limit);

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setEnrollingId(null);
    }
  };

  const handleContinue = (courseId) => {
    navigate(`/Student/My_Courses/${courseId}`);
  };

  const handleReview = (courseId) => {
    navigate(`/Student/My_Courses/${courseId}`);
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled" value={loading ? '...' : enrolledCount} />
        <StatCard label="Completed" value={loading ? '...' : completedCount} />
        <StatCard label="Avg Grade" value={loading ? '...' : `${avgGrade}%`} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Instructor</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                  Chargement...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && paginatedCourses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                  Aucun cours disponible.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              paginatedCourses.map((course) => {
                const status = getStatus(course._id);
                return (
                  <tr
                    key={course._id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      <CourseThumbnail image={course.image} title={course.title} />
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {course.teacher
                        ? `${course.teacher.firstName ?? ''} ${course.teacher.lastName ?? ''}`.trim()
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-4">
                      {status === 'available' && (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingId === course._id}
                          className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          {enrollingId === course._id ? '...' : 'Enroll'}
                        </button>
                      )}
                      {status === 'enrolled' && (
                        <button
                          onClick={() => handleContinue(course._id)}
                          className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          Continue
                        </button>
                      )}
                      {status === 'completed' && (
                        <button
                          onClick={() => handleReview(course._id)}
                          className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {!loading && !error && (
        <div className="mt-4 flex items-center justify-between px-2">
          <button
            onClick={handlePrevious}
            disabled={page <= 1}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Précédent
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}