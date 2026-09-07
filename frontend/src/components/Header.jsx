import RecommendationBell from './recommendations/RecommendationBell';
import { Bell } from 'lucide-react';
export default function Header({ title, subtitle, user }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
        <span className="text-slate-400 dark:text-slate-600">·</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</span>
      </div>
      {user?.role === 'student' ? (
        <RecommendationBell studentId={user.id} />
      ) : (
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700">
          <Bell size={18} className="text-slate-600 dark:text-slate-300" />
        </button>
      )}
    </header>
  );
}