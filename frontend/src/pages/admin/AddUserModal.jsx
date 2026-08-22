import { useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
const Form = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student',
  isActive: true,
  avatar: null,
  speciality: '',
  level: 'L1',
};
export default function AddUserModal({ onClose, onCreated, onUpdated, user }) {
  const isEditMode = Boolean(user);
  const [form, setForm] = useState(
    isEditMode
      ? {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          password: '',
          role: user.role || 'student',
          isActive: user.isActive ?? true,
          avatar: null,
          speciality: user.speciality || '',
          level: user.level || 'L1',
        }
      : Form
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (field) => (e) => {
    let value;
    if (field === 'isActive') value = e.target.checked;
    else if (field === 'avatar') value = e.target.files[0];
    else value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.speciality.trim()) {
      setError('La spécialité est requise');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('role', form.role);
      formData.append('isActive', form.isActive);
      formData.append('speciality', form.speciality);
      if (form.role === 'student') {
        formData.append('level', form.level);
      }
      if (form.avatar) formData.append('avatar', form.avatar);
      if (isEditMode) {
        if (form.password) formData.append('password', form.password);
        const response = await api.put(`/users/${user._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onUpdated(response.data);
      } else {
        formData.append('password', form.password);
        const response = await api.post('/users/ajouter', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onCreated(response.data.User);
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
            {isEditMode ? 'Edit User' : 'Add User'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                First Name
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={handleChange('firstName')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Last Name
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={handleChange('lastName')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Password {isEditMode && <span className="font-normal">(laisser vide pour ne pas changer)</span>}
            </label>
            <input
              type="password"
              required={!isEditMode}
              minLength={6}
              value={form.password}
              onChange={handleChange('password')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Role
            </label>
            <select
              value={form.role}
              onChange={handleChange('role')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role !== 'admin' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Speciality
              </label>
              <input
                type="text"
                value={form.speciality}
                onChange={handleChange('speciality')}
                placeholder="Enter speciality"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}
          {form.role === 'student' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Level
              </label>
              <select
                value={form.level}
                onChange={handleChange('level')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Avatar {isEditMode && <span className="font-normal">(laisser vide pour ne pas changer)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange('avatar')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange('isActive')}
              className="h-4 w-4 rounded border-slate-300"
            />
            Active
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}