import { Menu, Bell } from 'lucide-react';
import RecommendationBell from './recommendations/recommendationBell';
export default function Header({ title, subtitle, user, onMenuClick }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <h1 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {title}
          </h1>
          <span className="hidden text-slate-400 dark:text-slate-600 sm:inline">·</span>
          <span className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {subtitle}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        {user?.role === 'student' ? (
          <RecommendationBell studentId={user.id} />
        ) : (
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Bell size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
        )}
      </div>
    </header>
  );
}