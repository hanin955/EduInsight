import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddModuleModal from './AddModuleModal';
import ModulesTable from './ModulesTable';

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  const loadData = async (targetPage = page) => {
    try {
      setLoading(true);
      const [modulesRes, coursesRes] = await Promise.all([
        api.get('/modules/lister', { params: { page: targetPage, limit } }),
        api.get('/courses/list', { params: { limit: 1000 } }),
      ]);
      setModules(Array.isArray(modulesRes.data.modules) ? modulesRes.data.modules : []);
      setTotalPages(modulesRes.data.totalPages || 1);
      setPage(modulesRes.data.page || 1);
      setCourses(Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleModuleCreated = () => {
    loadData(page);
  };

  const handleModuleUpdated = (updatedModule) => {
    setModules((prev) => prev.map((m) => (m._id === updatedModule._id ? updatedModule : m)));
  };

  const handleDelete = async (moduleId) => {
    if (!window.confirm('Supprimer ce module et toutes ses leçons ?')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      loadData(page);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const getCourseTitle = (courseId) => {
    const id = courseId?._id || courseId;
    return courses.find((c) => c._id === id)?.title || '—';
  };

  const filteredModules = modules.filter((m) =>
    m.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Rechercher un module..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + New Module
        </button>
      </div>

      <ModulesTable
        modules={filteredModules}
        loading={loading}
        error={error}
        getCourseTitle={getCourseTitle}
        onEditClick={setEditingModule}
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
        <AddModuleModal
          courses={courses}
          onClose={() => setShowModal(false)}
          onCreated={handleModuleCreated}
        />
      )}
      {editingModule && (
        <AddModuleModal
          module={editingModule}
          courses={courses}
          onClose={() => setEditingModule(null)}
          onUpdated={handleModuleUpdated}
        />
      )}
    </div>
  );
}