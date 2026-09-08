import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';

const fileBaseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');

export default function StudentLessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!lesson) return <p className="text-sm text-slate-400">Leçon introuvable.</p>;

  return (
    <div>
      <button
        onClick={() => navigate(`/Student/My_Courses/${courseId}`)}
        className="mb-4 text-sm font-medium text-blue-600 hover:underline"
      >
        ← Retour au cours
      </button>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
        {lesson.videoUrl && (
          <div className="mt-4">
            <video controls className="w-full max-h-80">
              <source src={lesson.videoUrl} />
            </video>
          </div>
        )}
        <div className="mt-4 text-sm text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
        {lesson.pdfUrl && (
          <a
            href={`${fileBaseUrl}/uploads/${lesson.pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            ⬇ Télécharger le PDF
          </a>
        )}
      </div>
    </div>
  );
}
