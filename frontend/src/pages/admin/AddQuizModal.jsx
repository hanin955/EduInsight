import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';

const Form = {
  title: '',
  course: '',
  description: '',
  duration: '',
  passingScore: 50,
  questionsJson: '[{"type":"mcq","q":"Question?","options":["A","B","C","D"],"correct":0}]',
};

const mapType = (type) => {
  if (type === 'mcq') return 'MCQ';
  if (type === 'tf') return 'TrueFalse';
  return 'ShortAnswer';
};

export default function AddQuizModal({ onClose, onCreated, onUpdated, quiz }) {
  const isEditMode = Boolean(quiz);
  const [form, setForm] = useState(
    isEditMode
      ? {
          title: quiz.title || '',
          course: quiz.course?._id || quiz.course || '',
          description: quiz.description || '',
          duration: quiz.duration || '',
          passingScore: quiz.passingScore ?? 50,
          questionsJson: Form.questionsJson,
        }
      : Form
  );
  const [courses, setCourses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get('/courses/list');
        setCourses(Array.isArray(res.data?.courses) ? res.data.courses : []);
      } catch (err) {
        console.error('Erreur chargement cours:', err);
      }
    };
    loadCourses();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isEditMode) {
      setSaving(true);
      try {
        const response = await api.put(`/quizzes/${quiz._id}`, {
          title: form.title,
          course: form.course,
          description: form.description,
          duration: form.duration || undefined,
          passingScore: form.passingScore,
        });
        onUpdated(response.data);
        onClose();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setSaving(false);
      }
      return;
    }
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(form.questionsJson);
      if (!Array.isArray(parsedQuestions)) throw new Error('Doit être un tableau');
    } catch (err) {
      setError('JSON invalide pour les questions : ' + err.message);
      return;
    }
    setSaving(true);
    try {
      const quizRes = await api.post('/quizzes/ajouter', {
        title: form.title,
        course: form.course,
        description: form.description,
        duration: form.duration || undefined,
        passingScore: form.passingScore,
        createdBy: currentUser?.id,
      });
      const newQuiz = quizRes.data;
      for (let i = 0; i < parsedQuestions.length; i++) {
        const q = parsedQuestions[i];
        const questionRes = await api.post('/questions/ajouter', {
          quiz: newQuiz._id,
          statement: q.q,
          type: mapType(q.type),
          points: q.points || 1,
          order: i,
        });
        const newQuestion = questionRes.data;
        if (Array.isArray(q.options)) {
          for (let j = 0; j < q.options.length; j++) {
            await api.post('/choices/ajouter', {
              question: newQuestion._id,
              text: q.options[j],
              isCorrect: j === q.correct,
              order: j,
            });
          }
        }
      }
      onCreated(newQuiz);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-lg dark:bg-slate-900 sm:max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800 sm:p-6 sm:pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {isEditMode ? 'Edit Quiz' : 'New Quiz'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form id="quiz-form" onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleChange('title')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Course
            </label>
            <select
              required
              value={form.course}
              onChange={handleChange('course')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
            >
              <option value="">-- Choisir --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Duration (min)
              </label>
              <input
                type="number"
                min="0"
                value={form.duration}
                onChange={handleChange('duration')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.passingScore}
                onChange={handleChange('passingScore')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
              />
            </div>
          </div>
          {!isEditMode && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Questions (JSON with type: mcq/tf)
              </label>
              <textarea
                rows={5}
                value={form.questionsJson}
                onChange={handleChange('questionsJson')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:py-2"
              />
            </div>
          )}
          {isEditMode && (
            <p className="text-xs text-slate-400">
              Les questions ne sont pas modifiables ici pour le moment.
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:justify-end sm:p-6 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="quiz-form"
            disabled={saving}
            className="w-full rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}