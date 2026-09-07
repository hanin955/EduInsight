import { useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Moon, Sun, LogOut, Camera } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { updateUserAvatar } from './hooks/userService';
import { getAvatarUrl } from '../../utils/avatar';

const roleTabs = [
    { label: 'Admin', path: '/Admin' },
    { label: 'Teacher', path: '/Teacher' },
    { label: 'Student', path: '/Student' },
];

export default function Sidebar({ menus, user, onLogout, onUserUpdate }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const userId = user?._id || user?.id;
    const avatarUrl = getAvatarUrl(user);

    const handleAvatarClick = () => {
        if (!userId) {
            console.error("Impossible de changer l'avatar : identifiant utilisateur introuvable", user);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        try {
            setUploading(true);
            const updatedUser = await updateUserAvatar(userId, file);
            onUserUpdate?.(updatedUser);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message || "Erreur lors de l'upload de l'avatar");
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <aside className="flex h-full w-full flex-col overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:w-72">
            <div className="flex-shrink-0 p-5 pb-0">
                <div className="mb-1 flex items-center gap-2">
                    <GraduationCap className="h-7 w-7 text-indigo-500" strokeWidth={2.2} />
                    <span className="text-xl font-bold text-slate-900 dark:text-white">EduInsight</span>
                </div>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Complete Learning Platform</p>
                <div className="mb-4 border-b border-slate-200 dark:border-slate-800" />
                <div className="mb-4 flex items-center rounded-full bg-slate-100 p-1 text-sm font-medium dark:bg-slate-800">
                    {roleTabs.map((tab) => {
                        const isActive = location.pathname.toLowerCase().startsWith(tab.path.toLowerCase());
                        return (
                            <button
                                key={tab.path}
                                onClick={() => navigate(tab.path)}
                                className={`flex-1 rounded-full px-3 py-1.5 transition ${
                                    isActive
                                        ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4">
                {menus.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.link}
                            to={item.link}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                                        : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            <Icon size={19} strokeWidth={2.2} />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="flex-shrink-0 border-t border-slate-200 p-5 pt-4 dark:border-slate-800">
                <div className="mb-3 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="group relative h-9 w-9 flex-shrink-0 rounded-full"
                        title="Changer la photo de profil"
                    >
                        <img
                            src={avatarUrl}
                            alt={user?.firstName || 'Utilisateur'}
                            className="h-9 w-9 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    `${user?.firstName || 'U'} ${user?.lastName || ''}`
                                )}&background=e0e7ff&color=4338ca&bold=true`;
                            }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <Camera size={14} className="text-white" />
                        </span>
                        {uploading && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            </span>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div>
                        <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                            {user?.firstName || 'Utilisateur'} {user?.lastName || ''}
                        </p>
                        <p className="text-xs leading-tight text-slate-500 capitalize dark:text-slate-400">{user?.role || ''}</p>
                    </div>
                </div>
                <button
                    onClick={toggleTheme}
                    className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {isDark ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <LogOut size={17} strokeWidth={2.2} />
                    Logout
                </button>
            </div>
        </aside>
    );
}