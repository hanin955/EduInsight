import { useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';

export default function AddDepartementModal({ onClose, onCreated, onUpdated, departement }) {
  const isEditMode = Boolean(departement);
  const [form, setForm] = useState(
    isEditMode
      ? { name: departement.name || '', description: departement.description || '' }
      : { name: '', description: '' }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEditMode) {
        const response = await api.put(`/departements/${departement._id}`, form);
        onUpdated(response.data);
      } else {
        const response = await api.post('/departements/ajouter', form);
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
            {isEditMode ? 'Edit Departement' : 'New Departement'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form id="departement-form" onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleChange('name')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={handleChange('description')}
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
            form="departement-form"
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