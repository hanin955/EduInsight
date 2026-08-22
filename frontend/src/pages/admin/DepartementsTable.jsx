export default function DepartementsTable({
    departements,
    loading,
    error,
    onEditClick,
    onDeleteClick,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Description</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400">
                                Chargement...
                            </td>
                        </tr>
                    )}
                    {!loading && error && (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-red-500">
                                {error}
                            </td>
                        </tr>
                    )}
                    {!loading && !error && departements.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400">
                                Aucun département trouvé.
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        !error &&
                        departements.map((dep) => (
                            <tr
                                key={dep._id}
                                className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                            >
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                    {dep.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {dep.description || '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditClick(dep)}
                                            className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDeleteClick(dep._id)}
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
    );
}