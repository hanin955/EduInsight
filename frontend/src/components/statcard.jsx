import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/axios';
import { getErrorMessage } from '../api/axios';

export function Data({
    courses = false,
    inscriptions = false,
    metrics = false,
    attempts = false,
    users = false,
    quizzes = false,
} = {}) {
    const [data, setData] = useState({
        courses: [],
        inscriptions: [],
        metrics: [],
        attempts: [],
        users: [],
        quizzes: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reload = useCallback(async () => {
    try {
        setLoading(true);
        setError(null);
        const calls = {};
        if (courses) calls.courses = api.get('/courses/list', { params: { limit: 1000 } });
        if (inscriptions) calls.inscriptions = api.get('/inscriptions/lister', { params: { limit: 1000 } });
        if (metrics) calls.metrics = api.get('/performancemetrics/lister', { params: { limit: 1000 } });
        if (attempts) calls.attempts = api.get('/quizattempts/lister', { params: { limit: 1000 } });
        if (users) calls.users = api.get('/users/list', { params: { limit: 1000 } });
        if (quizzes) calls.quizzes = api.get('/quizzes/list', { params: { limit: 1000 } });
        const keys = Object.keys(calls);
        const results = await Promise.all(keys.map((k) => calls[k]));
        const next = { courses: [], inscriptions: [], metrics: [], attempts: [], users: [], quizzes: [] };
        keys.forEach((k, i) => {
            const raw = results[i].data;
            if (Array.isArray(raw)) {
                next[k] = raw;
            } else if (Array.isArray(raw?.[k])) {
                next[k] = raw[k];
            } else {
                next[k] = [];
            }
        });
        setData(next);
    } catch (err) {
        setError(getErrorMessage(err));
    } finally {
        setLoading(false);
    }
    }, [courses, inscriptions, metrics, attempts, users, quizzes]);
    useEffect(() => {
    reload();
    }, [reload]);
    return { ...data, loading, error, reload };
}

export default function StatCard({ label, value, subtext, subtextColor = "text-emerald-500" }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subtext && (
            <p className={`mt-1 text-xs font-medium ${subtextColor}`}>{subtext}</p>
        )}
    </div>
    );
}