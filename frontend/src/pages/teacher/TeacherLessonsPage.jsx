import { useEffect, useState, useCallback } from 'react';
import { api, getErrorMessage } from '../../api/axios';
import AddLessonModal from '../admin/AddLessonModal';
import LessonsTable from '../admin/LessonsTable';
export default function TeacherLessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 5;
    const getCurrentTeacherId = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?.id || user?._id || null;
        } catch {
            return null;
        }
    };
    const loadData = useCallback(async () => {
        const teacherId = getCurrentTeacherId();
        if (!teacherId) {
            setError("Utilisateur non identifié.");
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
            const allModules = Array.isArray(modulesRes.data?.modules) ? modulesRes.data.modules : [];
            const myModules = allModules.filter((m) => 
                myCourseIds.includes(m.course?._id || m.course)
            );
            setModules(myModules);
            const derivedLessons = myModules.flatMap((m) =>
                Array.isArray(m.lessons)
                    ? m.lessons.map((l) => ({ ...l, module: m._id }))
                    : []
            );
            setLessons(derivedLessons);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadData();
    }, [loadData]);
    const handleLessonCreated = () => {
        loadData();
    };
    const handleLessonUpdated = (updatedLesson) => {
        setLessons((prev) =>
            prev.map((l) => (l._id === updatedLesson._id ? { ...l, ...updatedLesson } : l))
        );
    };
    const handleDelete = async (lessonId) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette leçon ?')) return;
        try {
            await api.delete(`/lessons/${lessonId}`);
            setLessons((prev) => prev.filter((l) => l._id !== lessonId));
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
    const totalPages = Math.max(1, Math.ceil(filteredLessons.length / limit));
    const paginatedLessons = filteredLessons.slice((page - 1) * limit, page * limit);
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
                    placeholder="Search a lesson..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    disabled={modules.length === 0}
                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                    + New Lesson
                </button>
            </div>
            {modules.length === 0 && !loading && (
                <p className="mb-4 text-sm text-slate-400">
                    You need at least one module to create a lesson.
                </p>
            )}
            <LessonsTable
                lessons={paginatedLessons}
                loading={loading}
                error={error}
                getModuleTitle={getModuleTitle}
                onEditClick={setEditingLesson}
                onDeleteClick={handleDelete}
            />
            {!loading && !error && filteredLessons.length > 0 && (
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
                        Page {page} of {totalPages}
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