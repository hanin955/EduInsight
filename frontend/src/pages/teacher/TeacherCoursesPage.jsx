import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddCourseModal from '../admin/AddCourseModal';
import TeacherCoursesTable from "./TeacherCoursesTable";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

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
      const [coursesRes, inscriptionsRes] = await Promise.all([
        api.get('/courses/list', { params: { page: targetPage, limit, teacher: teacherId } }),
        api.get('/inscriptions/lister'),
      ]);
      setCourses(Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : []);
      setTotalPages(coursesRes.data.totalPages || 1);
      setPage(coursesRes.data.page || 1);
      setInscriptions(Array.isArray(inscriptionsRes.data) ? inscriptionsRes.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleCourseCreated = () => {
    loadData(page);
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses((prev) => prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c)));
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Supprimer ce cours ?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      loadData(page);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const countStudents = (courseId) =>
    inscriptions.filter((ins) => ins.course === courseId || ins.course?._id === courseId).length;

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h2>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            onClick={() => setShowModal(true)}
            className="whitespace-nowrap rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + New Course
          </button>
        </div>
      </div>
      <TeacherCoursesTable
        courses={filteredCourses}
        loading={loading}
        error={error}
        countStudents={countStudents}
        onEditClick={setEditingCourse}
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
        <AddCourseModal
          onClose={() => setShowModal(false)}
          onCreated={handleCourseCreated}
        />
      )}
      {editingCourse && (
        <AddCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onUpdated={handleCourseUpdated}
        />
      )}
    </div>
  );
}