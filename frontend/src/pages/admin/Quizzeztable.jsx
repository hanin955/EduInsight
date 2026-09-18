function StateBox({ tone = 'default', children }) {
    const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
            {children}
        </div>
    );
}

function StatusBadge({ isPublished }) {
    return isPublished ? (
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Published
        </span>
    ) : (
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Draft
        </span>
    );
}

export default function QuizzesTable({
    quizzes,
    loading,
    error,
    getCourseTitle,
    countQuestions,
    onEditClick,
    onPublishClick,
}) {
    if (loading) return <StateBox>Chargement...</StateBox>;
    if (error) return <StateBox tone="error">{error}</StateBox>;
    if (quizzes.length === 0) return <StateBox>Aucun quiz trouvé.</StateBox>;

    return (
        <>
            {/* Table view - tablette & PC */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
                <table className="w-full min-w-[720px] text-left">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Quiz</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Questions</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr
                                key={quiz._id}
                                className="border-b border-slate-50 last:border-0 dark:border-slate-800/60">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                {quiz.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                {getCourseTitle(quiz.course)}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                {countQuestions(quiz._id)}
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge isPublished={quiz.isPublished} />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {!quiz.isPublished && (
                                        <button
                                            onClick={() => onPublishClick(quiz._id)}
                                            className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-600 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                                        >
                                        Publish
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEditClick(quiz)}
                                        className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                    >
                                    Edit
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
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{quiz.title}</p>
                            <StatusBadge isPublished={quiz.isPublished} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {getCourseTitle(quiz.course)} · {countQuestions(quiz._id)} questions
                        </p>
                        <div className="mt-3 flex justify-end gap-2 border-t border-slate-50 pt-3 dark:border-slate-800/60">
                            {!quiz.isPublished && (
                                <button
                                    onClick={() => onPublishClick(quiz._id)}
                                    className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-600 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                                >
                                    Publish
                                </button>
                            )}
                            <button
                                onClick={() => onEditClick(quiz)}
                                className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}