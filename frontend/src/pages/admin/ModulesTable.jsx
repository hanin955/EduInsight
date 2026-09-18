function StateBox({ tone = 'default', children }) {
    const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
            {children}
        </div>
    );
}

export default function ModulesTable({
    modules,
    loading,
    error,
    getCourseTitle,
    onEditClick,
    onDeleteClick,
}) {
    if (loading) return <StateBox>Chargement...</StateBox>;
    if (error) return <StateBox tone="error">{error}</StateBox>;
    if (modules.length === 0) return <StateBox>Aucun module trouvé.</StateBox>;

    return (
        <>
            {/* Table view - tablette & PC */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
                <table className="w-full min-w-[640px] text-left">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Title</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Order</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map((mod) => (
                            <tr
                                key={mod._id}
                                className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                            >
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                    {mod.title}
                                    {mod.description && (
                                        <p className="mt-0.5 text-xs font-normal text-slate-400">{mod.description}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {getCourseTitle(mod.course)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {mod.order ?? 0}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditClick(mod)}
                                            className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDeleteClick(mod._id)}
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
                {modules.map((mod) => (
                    <div
                        key={mod._id}
                        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{mod.title}</p>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                #{mod.order ?? 0}
                            </span>
                        </div>
                        {mod.description && (
                            <p className="mt-0.5 text-xs text-slate-400">{mod.description}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {getCourseTitle(mod.course)}
                        </p>
                        <div className="mt-3 flex justify-end gap-2 border-t border-slate-50 pt-3 dark:border-slate-800/60">
                            <button
                                onClick={() => onEditClick(mod)}
                                className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDeleteClick(mod._id)}
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