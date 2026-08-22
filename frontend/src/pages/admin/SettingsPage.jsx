import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
export default function SettingsPage() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [userId, setUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
        setForm({
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          email: user.email ?? '',
        });
      } catch (err) {
        console.error('Erreur parsing user localStorage:', err);
      }
    }
  }, []);
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Impossible d'identifier l'utilisateur connecté.");
      return;
    }
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const [firstName, ...rest] = form.name.trim().split(' ');
      const lastName = rest.join(' ');
      const response = await api.put(`/users/${userId}`, {
        firstName,
        lastName,
        email: form.email,
      });
      const updated = {
        id: response.data._id ?? userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
      };
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Profile</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-300">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-600">Profil mis à jour avec succès.</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Theme</h3>
        <button
          onClick={toggleDarkMode}
          className="rounded-full bg-blue-50 px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
        >
          Toggle Dark Mode
        </button>
      </div>
    </div>
  );
}