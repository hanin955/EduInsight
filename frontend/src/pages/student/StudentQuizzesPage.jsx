import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import { Data } from '../../components/statcard';

export default function StudentQuizzesPage() {
  const navigate = useNavigate();
  const { courses, inscriptions, quizzes, attempts, loading, error, reload } = Data({
    courses: true,
    inscriptions: true,
    quizzes: true,
    attempts: true,
  });

  const [page, setPage] = useState(1);
  const limit = 5;

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
  const myCourseIds = myInscriptions.map((ins) => ins.course?._id || ins.course);

  const myQuizzes = quizzes.filter((q) => {
    const courseId = q.course?._id || q.course;
    return myCourseIds.includes(courseId) && q.isPublished;
  });

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === (courseId?._id || courseId));
    return course?.title || '—';
  };

  const getBestScore = (quizId) => {
    const myAttempts = attempts.filter((a) => {
      const aStudentId = a.student?._id || a.student;
      const aQuizId = a.quiz?._id || a.quiz;
      return aStudentId === studentId && aQuizId === quizId && a.submittedAt;
    });
    if (myAttempts.length === 0) return null;
    return Math.max(...myAttempts.map((a) => a.percentage ?? 0));
  };

  const totalPages = Math.max(1, Math.ceil(myQuizzes.length / limit));
  const paginatedQuizzes = myQuizzes.slice((page - 1) * limit, page * limit);

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleStart = async (quizId) => {
    try {
      const res = await api.post(`/quizattempts/start/${quizId}`);
      const attempt = res.data.data;
      navigate(`/Student/My_Quizzes/attempt/${attempt._id}`);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Quiz</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Questions</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Best Score</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                  Chargement...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && paginatedQuizzes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                  Aucun quiz disponible pour vos cours.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              paginatedQuizzes.map((quiz) => {
                const bestScore = getBestScore(quiz._id);
                return (
                  <tr
                    key={quiz._id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                      {getCourseTitle(quiz.course)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {quiz.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      —
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {bestScore !== null ? `${bestScore}%` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStart(quiz._id)}
                        className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      >
                        Start
                      </button>
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