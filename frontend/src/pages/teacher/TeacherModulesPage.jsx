import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddModuleModal from '../admin/AddModuleModal';
import ModulesTable from '../admin/ModulesTable';

export default function TeacherModulesPage() {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 4;

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
      const [modulesRes, coursesRes] = await Promise.all([
        api.get('/modules/lister', { params: { limit: 1000 } }),
        api.get('/courses/list', { params: { limit: 1000, teacher: teacherId } }),
      ]);
      const myCourses = Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : [];
      const myCourseIds = myCourses.map((c) => c._id);
      setCourses(myCourses);

      const allModules = Array.isArray(modulesRes.data.modules) ? modulesRes.data.modules : [];
      setModules(
        allModules.filter((m) => myCourseIds.includes(m.course?._id || m.course))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModuleCreated = () => {
    loadData();
  };

  const handleModuleUpdated = (updatedModule) => {
    setModules((prev) => prev.map((m) => (m._id === updatedModule._id ? updatedModule : m)));
  };

  const handleDelete = async (moduleId) => {
    if (!window.confirm('Supprimer ce module et toutes ses leçons ?')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const getCourseTitle = (courseId) => {
    const id = courseId?._id || courseId;
    return courses.find((c) => c._id === id)?.title || '—';
  };

  const filteredModules = modules.filter((m) =>
    m.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredModules.length / limit));
  const paginatedModules = filteredModules.slice((page - 1) * limit, page * limit);

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
          disabled={courses.length === 0}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          + New Module
        </button>
      </div>
      {courses.length === 0 && !loading && (
        <p className="mb-4 text-sm text-slate-400">
          Vous devez avoir au moins un cours pour créer un module.
        </p>
      )}
      <ModulesTable
        modules={paginatedModules}
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