import { Check, RefreshCw, Star } from 'lucide-react';

export default function RecommendationDropdown({
    recommendations,
    loading,
    error,
    regenerating,
    onRead,
    onReadAll,
    onGenerate,
}) {
    return (
        <div className="absolute right-0 top-12 z-30 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
                <h2 className="font-semibold text-ink">Recommandations</h2>
                <button
                    className="grid h-8 w-8 place-items-center rounded-full text-ink/50 transition hover:bg-mist disabled:opacity-50"
                    title="Régénérer les recommandations"
                    onClick={onGenerate}
                    disabled={regenerating}
                >
                    <RefreshCw size={16} className={regenerating ? 'animate-spin' : ''} />
                </button>
            </div>

            {regenerating && (
                <p className="px-4 py-3 text-center text-xs text-ink/50">
                    Régénération en cours...
                </p>
            )}

            {loading && (
                <p className="px-4 py-8 text-center text-sm text-ink/50">
                    Chargement des recommandations...
                </p>
            )}

            {error && (
                <p className="px-4 py-5 text-sm text-red-700">
                    Impossible de charger les recommandations.
                </p>
            )}

            {!loading && !error && !recommendations.length && (
                <div className="px-5 py-8 text-center">
                    <p className="text-sm text-ink/70">
                        Aucune recommandation pour le moment.
                    </p>
                    <p className="mt-1 text-sm text-ink/50">
                        Complétez des évaluations pour recevoir des suggestions.
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                recommendations.map((recommendation) => (
                    <button
                        key={recommendation._id}
                        className="flex w-full items-start gap-3 border-b border-ink/5 px-4 py-3 text-left transition hover:bg-mist"
                        onClick={() => onRead(recommendation)}
                    >
                        <div className="flex items-start gap-3">
                            <Star size={17} className="mt-0.5 shrink-0 text-teal" />
                            <div>
                                <p className="text-sm font-medium text-ink">
                                    {recommendation.course?.title}
                                </p>
                                <p className="mt-0.5 text-xs text-ink/60">
                                    {recommendation.reason}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}

            {!loading && !error && recommendations.length > 0 && (
                <button
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm text-ink/60 transition hover:bg-mist"
                    onClick={onReadAll}
                >
                    <Check size={14} /> Tout marquer comme lu
                </button>
            )}
        </div>
    );
}