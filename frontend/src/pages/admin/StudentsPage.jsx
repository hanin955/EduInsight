import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import StudentsTable from './StudentsTable';
export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const loadData = async (targetPage = page) => {
    try {
      setLoading(true);
      const [usersRes, inscriptionsRes, metricsRes] = await Promise.all([
        api.get('/users/list', { params: { page: targetPage, limit, role: 'student' } }),
        api.get('/inscriptions/lister'),
        api.get('/performancemetrics/lister'),
      ]);
      const allUsers = Array.isArray(usersRes.data.users) ? usersRes.data.users : [];
      setStudents(allUsers);
      setTotalPages(usersRes.data.totalPages || 1);
      setPage(usersRes.data.page || 1);
      setInscriptions(Array.isArray(inscriptionsRes.data) ? inscriptionsRes.data : []);
      setMetrics(Array.isArray(metricsRes.data) ? metricsRes.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData(page);
  }, [page]);
  const countEnrolled = (studentId) =>
    inscriptions.filter((ins) => ins.student === studentId || ins.student?._id === studentId).length;
  const getAvgGrade = (studentId) => {
    const studentMetrics = metrics.filter(
      (m) => m.student === studentId || m.student?._id === studentId
    );
    if (studentMetrics.length === 0) return null;
    const sum = studentMetrics.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0);
    return (sum / studentMetrics.length).toFixed(1);
  };
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstName ?? ''} ${s.lastName ?? ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
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
      <StudentsTable
        students={filteredStudents}
        loading={loading}
        error={error}
        countEnrolled={countEnrolled}
        getAvgGrade={getAvgGrade}
      />
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