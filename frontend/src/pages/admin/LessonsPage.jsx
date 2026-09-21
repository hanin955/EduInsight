import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddLessonModal from './AddLessonModal';
import LessonsTable from './LessonsTable';

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const loadData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, modulesRes] = await Promise.all([
        api.get('/lessons/lister', { params: { page, limit } }),
        api.get('/modules/lister', { params: { limit: 1000 } }),
      ]);
      setLessons(Array.isArray(lessonsRes.data.lessons) ? lessonsRes.data.lessons : []);
      setTotalPages(lessonsRes.data.totalPages || 1);
      setModules(Array.isArray(modulesRes.data.modules) ? modulesRes.data.modules : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleLessonCreated = () => {
    loadData();
  };

  const handleLessonUpdated = (updatedLesson) => {
    setLessons((prev) => prev.map((l) => (l._id === updatedLesson._id ? updatedLesson : l)));
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Supprimer cette leçon ?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const getModuleTitle = (moduleId) => {
    const id = moduleId?._id || moduleId;
    return modules.find((m) => m._id === id)?.title || '—';
  };

  const filteredLessons = lessons.filter((l) =>
    l.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Rechercher une leçon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + New Lesson
        </button>
      </div>
      <LessonsTable
        lessons={filteredLessons}
        loading={loading}
        error={error}
        getModuleTitle={getModuleTitle}
        onEditClick={setEditingLesson}
        onDeleteClick={handleDelete}
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
      {showModal && (
        <AddLessonModal
          modules={modules}
          onClose={() => setShowModal(false)}
          onCreated={handleLessonCreated}
        />
      )}
      {editingLesson && (
        <AddLessonModal
          lesson={editingLesson}
          modules={modules}
          onClose={() => setEditingLesson(null)}
          onUpdated={handleLessonUpdated}
        />
      )}
    </div>
  );
}