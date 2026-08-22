const BACKEND_URL = 'http://localhost:5000';
function CourseThumbnail({ image, title }) {
    if (!image) {
        return (
            <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-800"> —</div>);}
    return (
        <img
            src={`${BACKEND_URL}/uploads/${image}`}
            alt={title}
            className="h-10 w-14 shrink-0 rounded-lg object-cover"
            onError={(e) => {
            e.target.style.display = 'none';
        }}/>
    );
}
function LevelBadge({ level }) {
    const label = level ? level.charAt(0).toUpperCase() + level.slice(1) : 'N/A';
    return (
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
        {label}
        </span>
    );
}
export default function TeacherCoursesTable({
    courses,
    loading,
    error,
    countStudents,
    onEditClick,
    onDeleteClick,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
            <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Course</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Instructor</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Students</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Level</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">Chargement...</td>
                </tr>
            )}
            {!loading && error && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">
                        {error}
                    </td>
                </tr>
            )}
            {!loading && !error && courses.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">Vous n'avez aucun cours pour le moment.</td>
                </tr>
            )}
            {!loading &&!error &&courses.map((course) => (
                <tr
                    key={course._id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/60">
                    <td className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        <CourseThumbnail image={course.image} title={course.title} />
                        {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {course.teacher? `${course.teacher.firstName ?? ''} ${course.teacher.lastName ?? ''}`.trim(): '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {countStudents(course._id)}
                    </td>
                    <td className="px-6 py-4">
                        <LevelBadge level={course.level} />
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-2">
                        <button
                            onClick={() => onEditClick(course)}
                            className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                            Edit
                        </button>
                        <button
                            onClick={() => onDeleteClick(course._id)}
                            className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50">
                            Delete
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