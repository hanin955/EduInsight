import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddQuizModal from '../admin/AddQuizModal';

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();
  const teacherId = currentUser?.id;

  const loadData = async (targetPage = page) => {
    try {
      setLoading(true);
      const [quizzesRes, coursesRes, questionsRes] = await Promise.all([
        api.get('/quizzes/list', { params: { page: targetPage, limit, createdBy: teacherId } }),
        api.get('/courses/list', { params: { limit: 1000 } }),
        api.get('/questions/lister'),
      ]);
      setQuizzes(Array.isArray(quizzesRes.data.quizzes) ? quizzesRes.data.quizzes : []);
      setTotalPages(quizzesRes.data.totalPages || 1);
      setPage(quizzesRes.data.page || 1);
      setCourses(Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : []);
      setQuestions(Array.isArray(questionsRes.data) ? questionsRes.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleQuizCreated = () => {
    loadData(page);
  };

  const handleQuizUpdated = (updatedQuiz) => {
    setQuizzes((prev) => prev.map((q) => (q._id === updatedQuiz._id ? updatedQuiz : q)));
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === courseId || c._id === courseId?._id);
    return course?.title || '—';
  };

  const countQuestions = (quizId) =>
    questions.filter((q) => q.quiz === quizId || q.quiz?._id === quizId).length;

  const filteredQuizzes = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Rechercher un quiz..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          + Create Quiz
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Quiz</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Questions</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
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
            {!loading && !error && filteredQuizzes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                  Vous n'avez créé aucun quiz pour le moment.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              filteredQuizzes.map((quiz) => (
                <tr
                  key={quiz._id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {quiz.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {getCourseTitle(quiz.course)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {countQuestions(quiz._id)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditingQuiz(quiz)}
                      className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                    >
                      Edit
                    </button>
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
      {showModal && (
        <AddQuizModal onClose={() => setShowModal(false)} onCreated={handleQuizCreated} />
      )}
      {editingQuiz && (
        <AddQuizModal
          quiz={editingQuiz}
          onClose={() => setEditingQuiz(null)}
          onUpdated={handleQuizUpdated}
        />
      )}
    </div>
  );
}