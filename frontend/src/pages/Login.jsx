import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../components/context/AuthContext';
const Login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    useEffect(() => {
        emailRef.current?.focus();
    }, []);
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
    }, [isAuthenticated, user, navigate]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value;
        if (!email) {
            setError("L'email est requis");
            emailRef.current.focus();
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Adresse email invalide');
            emailRef.current.focus();
            return;
        }
        if (!password) {
            setError('Le mot de passe est requis');
            passwordRef.current.focus();
            return;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            passwordRef.current.focus();
            return;
        }
        setLoading(true);
        const result = await login({ email, password });
        setLoading(false);
        if (!result.success) {
            setError(result.message || 'Identifiants invalides.');
        }
    };
    return (
        <div className='flex items-center bg-white min-h-screen'>
            <div className='container mx-auto px-6 py-6'>
                <div className='flex flex-col lg:flex-row rounded-xl shadow-xl overflow-hidden bg-white border border-slate-200'>
                    <div className='w-full lg:w-1/2 relative overflow-hidden bg-white p-12 flex flex-col justify-center border-r border-slate-200'>
                        <div className='pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl'></div>
                        <div className='pointer-events-none absolute bottom-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl'></div>
                        <div className='relative z-10'>
                            <div className='flex items-center justify-between mb-10'>
                                <div className='bg-blue-50 border border-blue-200 w-11 h-11 rounded-lg flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-blue-600' fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.66 2.524 1 1 0 01-1.09.001z" />
                                    </svg>
                                </div>
                                <span className='text-xs font-semibold tracking-widest text-blue-600 border border-blue-300 bg-blue-50 rounded-full px-4 py-2 uppercase'>
                                    Smart Education
                                </span>
                            </div>
                            <h2 className='text-4xl font-semibold leading-tight text-blue-900'>
                                Empower every learner
                                <br />
                                with actionable insights.
                            </h2>
                            <p className='text-slate-500 text-sm mt-4 leading-relaxed'>
                                Monitor course engagement, quiz outcomes, and student progress
                                in a single polished workspace.
                            </p>
                            <div className='mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6'>
                                <p className='flex items-center gap-2 text-sm font-semibold text-blue-900 mb-4'>
                                    <span className='text-blue-600'>✦</span>
                                    Why teams love EduInsight
                                </p>
                                <ul className='flex flex-col gap-3'>
                                    {[
                                        'Real-time teaching analytics',
                                        'Beautiful dashboards for instructors and students',
                                        'Secure authentication and modern UI',
                                    ].map((feature) => (
                                        <li key={feature} className='flex items-start gap-3 text-sm text-slate-600'>
                                            <span className='mt-0.5 w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center shrink-0'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-blue-600'></span>
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 bg-white p-12'>
                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-blue-500 text-xs font-semibold tracking-widest uppercase'>
                                        Access Portal
                                    </p>
                                    <h3 className='text-3xl text-blue-900 font-bold'>
                                        Welcome back
                                    </h3>
                                </div>
                                <div className='bg-blue-50 border border-blue-200 w-10 h-10 rounded-lg flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-blue-600' fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                            <form className='mt-8 flex flex-col gap-4' onSubmit={handleSubmit}>
                                <div>
                                    <label className='block text-blue-900 text-sm mb-2 text-left font-medium'>Email</label>
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        placeholder="you@example.com"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                passwordRef.current?.focus();
                                            }
                                        }}
                                        className='w-full px-4 py-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-blue-900 placeholder-slate-400'
                                    />
                                </div>
                                <div>
                                    <label className='block text-blue-900 text-sm mb-2 text-left font-medium'>Password</label>
                                    <input
                                        ref={passwordRef}
                                        type="password"
                                        placeholder="••••••••"
                                        className='w-full px-4 py-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-blue-900 placeholder-slate-400'
                                    />
                                </div>
                                {error && (
                                    <p className='text-red-600 text-sm text-center'>{error}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className='w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    {loading ? 'Connexion...' : 'Login'}
                                </button>
                                <p className='text-slate-500 text-sm text-center mt-2'>
                                    Don't have an account?{' '}
                                    <Link to="/register" className='text-blue-600 hover:underline font-medium'>
                                        Create now
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;