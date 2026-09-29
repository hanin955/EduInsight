import { useEffect, useState, useCallback } from 'react';
import { api, getErrorMessage } from '../../api/axios';
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
  const getTeacherId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id || user?._id || null;
    } catch {
      return null;
    }
  };
  const loadData = useCallback(async () => {
    const teacherId = getTeacherId();
    if (!teacherId) {
      setError("Session expirée ou utilisateur non identifié.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [modulesRes, coursesRes] = await Promise.all([
        api.get('/modules/lister', { params: { limit: 1000 } }),
        api.get('/courses/list', { params: { limit: 1000, teacher: teacherId } }),
      ]);
      const myCourses = Array.isArray(coursesRes.data?.courses) ? coursesRes.data.courses : [];
      const myCourseIds = myCourses.map((c) => c._id);
      setCourses(myCourses);
      const allModules = Array.isArray(modulesRes.data?.modules) ? modulesRes.data.modules : [];
      setModules(
        allModules.filter((m) => myCourseIds.includes(m.course?._id || m.course))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const handleModuleCreated = () => {
    loadData();
  };
  const handleModuleUpdated = (updatedModule) => {
    setModules((prev) =>
      prev.map((m) => (m._id === updatedModule._id ? { ...m, ...updatedModule } : m))
    );
  };
  const handleDelete = async (moduleId) => {
    if (!window.confirm('Supprimer ce module et toutes ses leçons ?')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      setModules((prev) => prev.filter((m) => m._id !== moduleId));
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
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);
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
          type="button"
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
      {!loading && !error && filteredModules.length > 0 && (
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