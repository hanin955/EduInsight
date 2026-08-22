export default function StudentsTable({
  students,
  loading,
  error,
  countEnrolled,
  getAvgGrade,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Student</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Enrolled</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Avg Grade</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                Chargement...
              </td>
            </tr>
          )}
          {!loading && error && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-red-500">
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && students.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                Aucun étudiant trouvé.
              </td>
            </tr>
          )}
          {!loading &&
            !error &&
            students.map((student) => {
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
  );
}