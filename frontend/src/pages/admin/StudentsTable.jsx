function StateBox({ tone = 'default', children }) {
    const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
            {children}
        </div>
    );
}

export default function StudentsTable({
  students,
  loading,
  error,
  countEnrolled,
  getAvgGrade,
}) {
  if (loading) return <StateBox>Chargement...</StateBox>;
  if (error) return <StateBox tone="error">{error}</StateBox>;
  if (students.length === 0) return <StateBox>Aucun étudiant trouvé.</StateBox>;

  return (
    <>
      {/* Table view - tablette & PC */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Student</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Enrolled</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Avg Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const avgGrade = getAvgGrade(student._id);
              return (
                <tr
                  key={student._id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {`${student.firstName ?? ''} ${student.lastName ?? ''}`.trim()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {countEnrolled(student._id)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {avgGrade !== null ? `${avgGrade}%` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card view - mobile */}
      <div className="space-y-3 md:hidden">
        {students.map((student) => {
          const avgGrade = getAvgGrade(student._id);
          return (
            <div
              key={student._id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {`${student.firstName ?? ''} ${student.lastName ?? ''}`.trim()}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-400">
                <span>{countEnrolled(student._id)} cours suivis</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {avgGrade !== null ? `${avgGrade}%` : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}