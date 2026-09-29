import { useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';

export default function AddLessonModal({ onClose, onCreated, onUpdated, lesson, modules }) {
  const isEditMode = Boolean(lesson);
  const [form, setForm] = useState(
    isEditMode
      ? {
          title: lesson.title || '',
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          order: lesson.order || 0,
          module: lesson.module?._id || lesson.module || '',
        }
      : { title: '', content: '', videoUrl: '', order: 0, module: '' }
  );
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    const value = field === 'order' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      if (isEditMode) {
        const response = await api.put(`/lessons/${lesson._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onUpdated(response.data);
      } else {
        const response = await api.post('/lessons/ajouter', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onCreated(response.data);
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-lg dark:bg-slate-900 sm:max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800 sm:p-6 sm:pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {isEditMode ? 'Edit Lesson' : 'New Lesson'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form id="lesson-form" onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Module</label>
            <select
              required
              value={form.module}
              onChange={handleChange('module')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            >
              <option value="">-- Choisir --</option>
              {modules.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleChange('title')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Content</label>
            <textarea
              rows={3}
              value={form.content}
              onChange={handleChange('content')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Video URL</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={handleChange('videoUrl')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              PDF de la leçon {isEditMode && lesson.pdfUrl && '(un nouveau fichier remplacera l\'actuel)'}
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:file:bg-slate-700 sm:py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Order</label>
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={handleChange('order')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:justify-end sm:p-6 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="lesson-form"
            disabled={saving}
            className="w-full rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}