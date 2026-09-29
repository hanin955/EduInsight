import { useEffect, useState, useCallback } from 'react';
import { api, getErrorMessage } from '../../api/axios';
import AddQuizModal from '../admin/AddQuizModal';
<<<<<<< HEAD
=======

>>>>>>> e6fd4e4 (les fichiers modifies)
function StatusBadge({ isPublished }) {
  return isPublished ? (
    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
      Published
    </span>
  ) : (
    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      Draft
    </span>
  );
}
<<<<<<< HEAD
=======

>>>>>>> e6fd4e4 (les fichiers modifies)
function StateBox({ tone = 'default', children }) {
  const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
      {children}
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> e6fd4e4 (les fichiers modifies)
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
  const getTeacherId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id || user?._id || null;
    } catch {
      return null;
    }
  };
  const loadData = useCallback(async (targetPage = 1) => {
    const teacherId = getTeacherId();
    if (!teacherId) {
      setError('Session expirée ou utilisateur non identifié.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [quizzesRes, coursesRes, questionsRes] = await Promise.all([
        api.get('/quizzes/list', { 
          params: { 
            page: targetPage, 
            limit, 
            createdBy: teacherId,
            search: searchTerm || undefined
          } 
        }),
        api.get('/courses/list', { params: { limit: 1000 } }),
        api.get('/questions/lister'),
      ]);
      const fetchedQuizzes = Array.isArray(quizzesRes.data?.quizzes) ? quizzesRes.data.quizzes : [];
      setQuizzes(fetchedQuizzes);
      setTotalPages(quizzesRes.data?.totalPages || 1);
      setCourses(Array.isArray(coursesRes.data?.courses) ? coursesRes.data.courses : []);
      setQuestions(Array.isArray(questionsRes.data) ? questionsRes.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);
  useEffect(() => {
    loadData(page);
  }, [page, loadData]);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleQuizCreated = () => {
    loadData(page);
  };
  const handleQuizUpdated = (updatedQuiz) => {
    setQuizzes((prev) => prev.map((q) => (q._id === updatedQuiz._id ? { ...q, ...updatedQuiz } : q)));
  };
  const handlePublish = async (quizId) => {
    try {
      await api.patch(`/quizzes/${quizId}/publish`);
      setQuizzes((prev) =>
        prev.map((q) => (q._id === quizId ? { ...q, isPublished: true } : q))
      );
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };
  const getCourseTitle = (courseId) => {
    const id = courseId?._id || courseId;
    const course = courses.find((c) => c._id === id);
    return course?.title || '—';
  };
  const countQuestions = (quizId) =>
    questions.filter((q) => q.quiz === quizId || q.quiz?._id === quizId).length;
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Rechercher un quiz..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Create Quiz
        </button>
      </div>
<<<<<<< HEAD
=======

>>>>>>> e6fd4e4 (les fichiers modifies)
      {loading ? (
        <StateBox>Chargement...</StateBox>
      ) : error ? (
        <StateBox tone="error">{error}</StateBox>
<<<<<<< HEAD
      ) : quizzes.length === 0 ? (
        <StateBox>Aucun quiz trouvé.</StateBox>
      ) : (
        <>
=======
      ) : filteredQuizzes.length === 0 ? (
        <StateBox>Vous n'avez créé aucun quiz pour le moment.</StateBox>
      ) : (
        <>
          {/* Table view - tablette & PC */}
>>>>>>> e6fd4e4 (les fichiers modifies)
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Quiz</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Questions</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
<<<<<<< HEAD
                {quizzes.map((quiz) => (
=======
                {filteredQuizzes.map((quiz) => (
>>>>>>> e6fd4e4 (les fichiers modifies)
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
<<<<<<< HEAD
                      {quiz.questionsCount ?? countQuestions(quiz._id)}
=======
                      {countQuestions(quiz._id)}
>>>>>>> e6fd4e4 (les fichiers modifies)
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isPublished={quiz.isPublished} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!quiz.isPublished && (
                          <button
<<<<<<< HEAD
                            type="button"
=======
>>>>>>> e6fd4e4 (les fichiers modifies)
                            onClick={() => handlePublish(quiz._id)}
                            className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-600 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                          >
                            Publish
                          </button>
                        )}
                        <button
<<<<<<< HEAD
                          type="button"
=======
>>>>>>> e6fd4e4 (les fichiers modifies)
                          onClick={() => setEditingQuiz(quiz)}
                          className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

<<<<<<< HEAD
          {/* Card view - Mobile */}
          <div className="space-y-3 md:hidden">
            {quizzes.map((quiz) => (
=======
          {/* Card view - mobile */}
          <div className="space-y-3 md:hidden">
            {filteredQuizzes.map((quiz) => (
>>>>>>> e6fd4e4 (les fichiers modifies)
              <div
                key={quiz._id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{quiz.title}</p>
                  <StatusBadge isPublished={quiz.isPublished} />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
<<<<<<< HEAD
                  {getCourseTitle(quiz.course)} · {quiz.questionsCount ?? countQuestions(quiz._id)} questions
=======
                  {getCourseTitle(quiz.course)} · {countQuestions(quiz._id)} questions
>>>>>>> e6fd4e4 (les fichiers modifies)
                </p>
                <div className="mt-3 flex justify-end gap-2 border-t border-slate-50 pt-3 dark:border-slate-800/60">
                  {!quiz.isPublished && (
                    <button
<<<<<<< HEAD
                      type="button"
=======
>>>>>>> e6fd4e4 (les fichiers modifies)
                      onClick={() => handlePublish(quiz._id)}
                      className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-600 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                    >
                      Publish
                    </button>
                  )}
                  <button
<<<<<<< HEAD
                    type="button"
=======
>>>>>>> e6fd4e4 (les fichiers modifies)
                    onClick={() => setEditingQuiz(quiz)}
                    className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
<<<<<<< HEAD
      {!loading && !error && quizzes.length > 0 && (
=======

      {!loading && !error && (
>>>>>>> e6fd4e4 (les fichiers modifies)
        <div className="mt-4 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Next
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