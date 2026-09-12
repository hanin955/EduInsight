function StateBox({ tone = 'default', children }) {
    const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
            {children}
        </div>
    );
}

export default function LessonsTable({
    lessons,
    loading,
    error,
    getModuleTitle,
    onEditClick,
    onDeleteClick,
}) {
    if (loading) return <StateBox>Chargement...</StateBox>;
    if (error) return <StateBox tone="error">{error}</StateBox>;
    if (lessons.length === 0) return <StateBox>Aucune leçon trouvée.</StateBox>;

    return (
        <>
            {/* Table view - tablette & PC */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
                <table className="w-full min-w-[600px] text-left">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Title</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Module</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Order</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map((lesson) => (
                            <tr
                                key={lesson._id}
                                className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                            >
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                    {lesson.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {getModuleTitle(lesson.module)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {lesson.order ?? 0}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditClick(lesson)}
                                            className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDeleteClick(lesson._id)}
                                            className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                        >
                                            Del
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card view - mobile */}
            <div className="space-y-3 md:hidden">
                {lessons.map((lesson) => (
                    <div
                        key={lesson._id}
                        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{lesson.title}</p>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                #{lesson.order ?? 0}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {getModuleTitle(lesson.module)}
                        </p>
                        <div className="mt-3 flex justify-end gap-2 border-t border-slate-50 pt-3 dark:border-slate-800/60">
                            <button
                                onClick={() => onEditClick(lesson)}
                                className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDeleteClick(lesson._id)}
                                className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                            >
                                Del
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}