import { useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
export default function AddDepartementModal({ onClose, onCreated, onUpdated, departement }) {
    const isEditMode = Boolean(departement);
    const [form, setForm] = useState(
        isEditMode? {name: departement.name || '',description: departement.description || '',}: { name: '', description: '' });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {isEditMode ? 'Edit Departement' : 'New Departement'}
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
                Name
                </label>
                <input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange('name')}
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