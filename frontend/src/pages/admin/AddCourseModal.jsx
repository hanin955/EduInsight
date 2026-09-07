import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
const Form = {
  title: '',
  description: '',
  departement: '',
  teacher: '',
  duration: '',
  level: 'beginner',
  image: null,
  pdf: null,
};
export default function AddCourseModal({ onClose, onCreated, onUpdated, course }) {
  const isEditMode = Boolean(course);
  const [form, setForm] = useState(
    isEditMode
      ? {
          title: course.title || '',
          description: course.description || '',
          departement: course.departement?._id || course.departement || '',
          teacher: course.teacher?._id || course.teacher || '',
          duration: course.duration || '',
          level: course.level || 'beginner',
          image: null,
          pdf: null,
        }
      : Form
  );
  const [departements, setDepartements] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadOptions = async () => {
      const [depResult, usersResult] = await Promise.allSettled([
        api.get('/departements/lister'),
        api.get('/users/list?role=teacher&limit=1000'),
      ]);
      if (depResult.status === 'fulfilled') {
        const data = depResult.value.data;
        setDepartements(Array.isArray(data?.departements) ? data.departements : []);
      } else {
        console.error('Erreur chargement départements:', depResult.reason);
      }
      if (usersResult.status === 'fulfilled') {
        const data = usersResult.value.data;
        setTeachers(Array.isArray(data?.users) ? data.users : []);
      } else {
        console.error('Erreur chargement teachers:', usersResult.reason);
      }
    };
    loadOptions();
  }, []);
  const handleChange = (field) => (e) => {
    const value = field === 'image' || field === 'pdf' ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('departement', form.departement);
      if (form.teacher) formData.append('teacher', form.teacher);
      formData.append('duration', form.duration);
      formData.append('level', form.level);
      if (form.image) formData.append('image', form.image);
      if (form.pdf) formData.append('pdf', form.pdf);
      if (isEditMode) {
        const response = await api.put(`/courses/${course._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onUpdated(response.data.course || response.data);
      } else {
        const response = await api.post('/courses/ajouter', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onCreated(response.data.course);
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Course' : 'New Course'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleChange('title')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={handleChange('description')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Departement
            </label>
            <select
              required
              value={form.departement}
              onChange={handleChange('departement')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">-- Choisir --</option>
              {departements.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Teacher (optionnel — toi si vide)
            </label>
            <select
              value={form.teacher}
              onChange={handleChange('teacher')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option value="">-- Assigné à moi --</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Duration (heures)
              </label>
              <input
                type="number"
                min="0"
                value={form.duration}
                onChange={handleChange('duration')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Level
              </label>
              <select
                value={form.level}
                onChange={handleChange('level')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Image {isEditMode && <span className="font-normal">(laisser vide pour ne pas changer)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange('image')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              PDF du cours {isEditMode && <span className="font-normal">(laisser vide pour ne pas changer)</span>}
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleChange('pdf')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
            {isEditMode && course.pdf && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                PDF actuel disponible — choisissez un fichier pour le remplacer.
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}