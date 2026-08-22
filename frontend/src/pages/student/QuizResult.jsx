export default function QuizResult({ result, quiz, onBackClick }) {
    return (
        <div className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 text-6xl">{result.passed ? '🎉' : '💪'}</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.passed ? 'Félicitations, quiz réussi !' : 'Quiz terminé !'}
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{quiz.title}</p>
            <div className="mt-6 rounded-xl bg-slate-50 p-6 dark:bg-slate-800">
                <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {result.percentage}%
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Score : {result.score} / {result.totalPoints} points</p>
                {typeof quiz.passingScore === 'number' && (
                <p className="mt-1 text-xs text-slate-400">
                    Score minimum requis : {quiz.passingScore}%</p>)}
            </div>
            <button
                onClick={onBackClick}
                className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Retour à Mes Quiz
            </button>
        </div>
        </div>
    );
}