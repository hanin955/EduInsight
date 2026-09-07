import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import { getAvatarUrl } from '../../../utils/avatar';

export default function TeacherStudentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();
  const teacherId = currentUser?.id;

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, inscriptionsRes, metricsRes] = await Promise.all([
        api.get('/courses/list', { params: { teacher: teacherId, limit: 1000 } }),
        api.get('/inscriptions/lister'),
        api.get('/performancemetrics/lister'),
      ]);
      const myCourses = Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : [];
      const myCourseIds = myCourses.map((c) => c._id);
      const allInscriptions = Array.isArray(inscriptionsRes.data) ? inscriptionsRes.data : [];
      const myInscriptions = allInscriptions.filter((ins) => {
        const courseId = ins.course?._id || ins.course;
        return myCourseIds.includes(courseId);
      });
      const allMetrics = Array.isArray(metricsRes.data) ? metricsRes.data : [];
      const byStudent = {};
      myInscriptions.forEach((ins) => {
        const studentId = ins.student?._id || ins.student;
        if (!byStudent[studentId]) {
          byStudent[studentId] = { courseIds: [] };
        }
        byStudent[studentId].courseIds.push(ins.course?._id || ins.course);
      });
      const studentIds = Object.keys(byStudent);
      const studentDetails = await Promise.all(
        studentIds.map(async (id) => {
          try {
            const res = await api.get(`/users/${id}`);
            return res.data;
          } catch {
            return null;
          }
        })
      );
      const result = studentIds.map((id, idx) => {
        const student = studentDetails[idx];
        const courseIds = byStudent[id].courseIds;
        const relevantMetrics = allMetrics.filter((m) => {
          const mStudentId = m.student?._id || m.student;
          const mCourseId = m.course?._id || m.course;
          return mStudentId === id && courseIds.includes(mCourseId);
        });
        const avgGrade =
          relevantMetrics.length > 0
            ? (
                relevantMetrics.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0) /
                relevantMetrics.length
              ).toFixed(1)
            : null;
        return {
          id,
          firstName: student?.firstName || '—',
          lastName: student?.lastName || '',
          email: student?.email || '—',
          avatar: student?.avatar || null,
          enrolledCount: courseIds.length,
          avgGrade,
        };
      });
      setRows(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = rows.filter((r) => {
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / limit));
  const paginatedRows = filteredRows.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Student</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Enrolled</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Avg Grade</th>
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
            {!loading && !error && paginatedRows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                  Aucun étudiant inscrit à vos cours pour le moment.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              paginatedRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(row)}
                        alt={`${row.firstName} ${row.lastName}`.trim()}
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            `${row.firstName} ${row.lastName}`.trim()
                          )}&background=e0e7ff&color=4338ca&bold=true`;
                        }}
                      />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {`${row.firstName} ${row.lastName}`.trim()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.enrolledCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.avgGrade !== null ? `${row.avgGrade}%` : '—'}
                  </td>
                </tr>
              ))}
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
            Previous
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}