import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import RecommendationDropdown from './RecommendationDropdown';
import * as service from '../hooks/recommendationService';

export default function RecommendationBell({ studentId }) {
    const [open, setOpen] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const containerRef = useRef(null);

    const load = () => {
        if (!studentId) return;
        setLoading(true);
        setError(false);
        service.getRecommendations(studentId)
            .then((result) => setRecommendations(result.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, [studentId]);

    useEffect(() => {
        const close = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const unreadCount = recommendations.filter(
        (recommendation) => recommendation.status === 'unread'
    ).length;

    const read = (recommendation) => {
        if (recommendation.status === 'unread') {
            service.markRecommendationAsRead(recommendation._id).then(() =>
                setRecommendations((items) =>
                    items.map((item) =>
                        item._id === recommendation._id ? { ...item, status: 'read' } : item
                    )
                )
            );
        }
    };

    const readAll = () => {
        service.markAllRecommendationsAsRead(studentId).then(() =>
            setRecommendations((items) => items.map((item) => ({ ...item, status: 'read' })))
        );
    };

    const generate = () => {
        setRegenerating(true);
        service.generateRecommendations(studentId)
            .then((res) => setRecommendations(res.data))
            .catch(() => setError(true))
            .finally(() => setRegenerating(false));
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                className="relative grid h-10 w-10 place-items-center rounded-full text-ink/65 transition hover:bg-ink/5 hover:text-teal"
                title="Course recommendations"
                aria-label="Ouvrir les recommandations"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
            >
                <Bell size={19} />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <RecommendationDropdown
                    recommendations={recommendations}
                    loading={loading}
                    error={error}
                    regenerating={regenerating}
                    onRead={read}
                    onReadAll={readAll}
                    onGenerate={generate}
                />
            )}
        </div>
    );
}