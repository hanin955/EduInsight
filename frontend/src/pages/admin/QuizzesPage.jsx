import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddQuizModal from './AddQuizModal';
import QuizzesTable from './Quizzeztable';
export default function QuizzesPage() {
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
  const loadData = async (targetPage = page) => {
    try {
      setLoading(true);
      const [quizzesRes, coursesRes, questionsRes] = await Promise.all([
        api.get('/quizzes/list', { params: { page: targetPage, limit } }),
        api.get('/courses/list', { params: { limit: 1000 } }), // toutes les courses, pour résoudre les titres
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
  const handlePublish = async (quizId) => {
    try {
      await api.patch(`/quizzes/${quizId}/publish`);
      setQuizzes((prev) =>
        prev.map((q) => (q._id === quizId ? { ...q, isPublished: true } : q))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
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
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Create Quiz
        </button>
      </div>
      <QuizzesTable
        quizzes={filteredQuizzes}
        loading={loading}
        error={error}
        getCourseTitle={getCourseTitle}
        countQuestions={countQuestions}
        onEditClick={setEditingQuiz}
        onPublishClick={handlePublish}
      />
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