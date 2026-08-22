import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import QuizResult from './QuizResult';

export default function QuizAttemptPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const answersRef = useRef({});
  const expiredRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const attemptRes = await api.get(`/quizattempts/${attemptId}`);
        const attemptData = attemptRes.data;
        setAttempt(attemptData);
        const quizId = attemptData.quiz?._id || attemptData.quiz;
        const [quizRes, questionsRes, choicesRes] = await Promise.all([
          api.get(`/quizzes/${quizId}`),
          api.get('/questions/lister'),
          api.get('/choices/lister'),
        ]);
        setQuiz(quizRes.data);
        const allQuestions = Array.isArray(questionsRes.data) ? questionsRes.data : [];
        const quizQuestions = allQuestions
          .filter((q) => (q.quiz?._id || q.quiz) === quizId)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setQuestions(quizQuestions);
        setChoices(Array.isArray(choicesRes.data) ? choicesRes.data : []);

        if (quizRes.data.duration) {
          const startedAt = new Date(attemptData.startedAt).getTime();
          const allowedMs = quizRes.data.duration * 60 * 1000;
          const remaining = Math.max(0, Math.floor((startedAt + allowedMs - Date.now()) / 1000));
          setTimeLeft(remaining);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [attemptId]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (timeLeft === null || result || expired) return;
    if (timeLeft <= 0) {
      handleExpire();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleExpire();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result, expired]);

  const handleExpire = async () => {
    if (expiredRef.current) return;
    expiredRef.current = true;
    setExpired(true);
    try {
      await api.post(`/quizattempts/${attemptId}/expire`);
    } catch (err) {
      console.error('Erreur lors du marquage comme expiré:', err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getChoicesForQuestion = (questionId) =>
    choices.filter((c) => (c.question?._id || c.question) === questionId);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const finishQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        questionId: q._id,
        selectedChoiceId: finalAnswers[q._id] || null,
      }));
      const res = await api.post(`/quizattempts/${attemptId}/submit`, {
        answers: answersPayload,
      });
      if (res.data.expired) {
        setExpired(true);
        return;
      }
      const backendScore = res.data?.score ?? 0;
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
      const percentage = totalPoints > 0 ? Math.round((backendScore / totalPoints) * 100) : 0;
      const passed = percentage >= (quiz?.passingScore || 0);
      setResult({ score: backendScore, totalPoints, percentage, passed });
    } catch (err) {
      if (err.response?.data?.expired) {
        setExpired(true);
      } else {
        alert(getErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChoiceClick = (questionId, choiceId) => {
    if (submitting || expired) return;
    setSelectedChoice(choiceId);
    const updatedAnswers = { ...answers, [questionId]: choiceId };
    setAnswers(updatedAnswers);
    setTimeout(() => {
      setSelectedChoice(null);
      if (isLastQuestion) {
        finishQuiz(updatedAnswers);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 300);
  };

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!quiz) return <p className="text-sm text-slate-400">Quiz introuvable.</p>;

  if (expired) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">
          <div className="mb-4 text-6xl">⏱️</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Temps écoulé
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Vous n'avez pas terminé le quiz "{quiz.title}" dans le temps imparti.
            Cette tentative a été marquée comme expirée.
          </p>
          <button
            onClick={() => navigate('/Student/My_Quizzes')}
            className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Retour à Mes Quiz
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResult
        result={result}
        quiz={quiz}
        onBackClick={() => navigate('/Student/My_Quizzes')}
      />
    );
  }
  if (questions.length === 0) {
    return <p className="text-sm text-slate-400">Aucune question dans ce quiz.</p>;
  }
  const questionChoices = getChoicesForQuestion(currentQuestion._id);
  const isTimeLow = timeLeft !== null && timeLeft <= 60;

  return (
    <div>
      <button
        onClick={() => navigate('/Student/My_Quizzes')}
        className="mb-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        Back to My Quizzes
      </button>
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{quiz.title}</h2>
            {quiz.description && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{quiz.description}</p>
            )}
          </div>
          {timeLeft !== null && (
            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                isTimeLow
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
              }`}
            >
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>
              Question {currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div
        key={currentQuestion._id}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <p className="mb-4 font-semibold text-slate-900 dark:text-white">
          {currentIndex + 1}. {currentQuestion.statement}
        </p>
        <div className="space-y-2">
          {questionChoices.map((choice) => {
            const isSelected = selectedChoice === choice._id;
            return (
              <button
                key={choice._id}
                type="button"
                disabled={submitting || selectedChoice !== null}
                onClick={() => handleChoiceClick(currentQuestion._id, choice._id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-slate-700 dark:text-slate-200">{choice.text}</span>
              </button>
            );
          })}
          {questionChoices.length === 0 && (
            <p className="text-sm text-slate-400">Aucun choix disponible pour cette question.</p>
          )}
        </div>
        {submitting && isLastQuestion && (
          <p className="mt-4 text-sm text-slate-400">Envoi des réponses...</p>
        )}
      </div>
    </div>
  );
}