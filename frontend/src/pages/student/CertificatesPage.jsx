import { Data} from '../../components/statcard';
function CertificateCard({ studentName, courseTitle, grade, date }) {
  return (
    <div className="mb-6 rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-10 text-center shadow-sm dark:border-amber-700 dark:from-amber-950/30 dark:to-slate-900">
      <div className="mb-4 flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl dark:bg-amber-900/40">
          🏅
        </span>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-amber-700 dark:text-amber-400">
        Certificate of Completion
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">This certifies that</p>
      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{studentName}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">has successfully completed</p>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{courseTitle}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Grade: {grade}%</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">Date: {date}</p>
      <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
        ⬇ Download
      </button>
    </div>
  );
}
export default function CertificatesPage() {
  const { courses, inscriptions, metrics, loading, error } = Data({
    courses: true,
    inscriptions: true,
    metrics: true,
  });
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();
  const studentId = currentUser?.id;
  const studentName = currentUser? `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim(): '';
  const myCompletedInscriptions = inscriptions.filter(
    (ins) =>
      (ins.student === studentId || ins.student?._id === studentId) &&
      ins.status === 'completed'
  );
  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === (courseId?._id || courseId));
    return course?.title || '—';
  };
  const getCourseGrade = (courseId) => {
    const relevant = metrics.filter(
      (m) =>
        (m.student === studentId || m.student?._id === studentId) &&
        (m.course?._id || m.course) === courseId
    );
    if (relevant.length === 0) return '—';
    const avg = relevant.reduce((acc, m) => acc + (m.quizScoreAverage || 0), 0) / relevant.length;
    return avg.toFixed(0);
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  };
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Your Certificates</h2>
      {loading && <p className="text-sm text-slate-400">Chargement...</p>}
      {!loading && error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && myCompletedInscriptions.length === 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          Vous n'avez pas encore de certificat. Terminez un cours pour en obtenir un !
        </div>
      )}
      {!loading &&
        !error &&
        myCompletedInscriptions.map((ins) => {
          const courseId = ins.course?._id || ins.course;
          return (
            <CertificateCard
              key={ins._id}
              studentName={studentName}
              courseTitle={getCourseTitle(courseId)}
              grade={getCourseGrade(courseId)}
              date={formatDate(ins.enrolledAt)}
            />
          );
        })}
    </div>
  );
}