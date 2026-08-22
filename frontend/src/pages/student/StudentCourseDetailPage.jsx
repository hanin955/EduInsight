import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [courseRes, modulesRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get('/modules/lister'),
          api.get('/lessons/lister'),
        ]);
        setCourse(courseRes.data);
        const allModules = Array.isArray(modulesRes.data) ? modulesRes.data : [];
        const courseModules = allModules
          .filter((m) => (m.course?._id || m.course) === courseId)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setModules(courseModules);
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);
  const getLessonsForModule = (moduleId) =>
    lessons
      .filter((l) => (l.module?._id || l.module) === moduleId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  if (loading) {
    return <p className="text-sm text-slate-400">Chargement...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }
  if (!course) {
    return <p className="text-sm text-slate-400">Cours introuvable.</p>;
  }
  return (
    <div>
      <button
        onClick={() => navigate('/Student/My_Courses')}
        className="mb-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        Back to My Courses
      </button>
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
        <p className="mt-2 text-xs text-slate-400">
          {course.teacher
            ? `${course.teacher.firstName ?? ''} ${course.teacher.lastName ?? ''}`.trim()
            : ''}
          {course.duration ? ` - ${course.duration}h` : ''}
        </p>
      </div>
      <div className="space-y-4">
        {modules.length === 0 && (
          <p className="text-sm text-slate-400">Aucun module disponible pour ce cours.</p>
        )}
        {modules.map((module) => {
          const moduleLessons = getLessonsForModule(module._id);
          return (
            <div
              key={module._id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">{module.title}</h3>
                {module.description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
                )}
              </div>
              {moduleLessons.length === 0 ? (
                <p className="px-6 py-4 text-sm text-slate-400">Aucune lecon dans ce module.</p>
              ) : (
                <ul>
                  {moduleLessons.map((lesson) => (
                    <li
                      key={lesson._id}
                      className="flex items-center justify-between border-b border-slate-50 px-6 py-3 last:border-0 dark:border-slate-800/60"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-200">{lesson.title}</span>
                      <div className="flex gap-3 text-xs">
                        {lesson.videoUrl ? (
                          <button
                            type="button"
                            onClick={() => openLink(lesson.videoUrl)}
                            className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            Video
                          </button>
                        ) : null}
                        {lesson.pdfUrl ? (
                          <button
                            type="button"
                            onClick={() => openLink(lesson.pdfUrl)}
                            className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                          >
                            PDF
                          </button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}