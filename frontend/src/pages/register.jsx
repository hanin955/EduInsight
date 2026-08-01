import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuth, getDashboardPath } from '../components/context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
    }, [isAuthenticated, user, navigate]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { firstName, lastName, email, password, confirmPassword, role } = form;
        if (!firstName.trim()) {
            setError('Le prénom est requis');
            return;
        }
        if (!lastName.trim()) {
            setError('Le nom est requis');
            return;
        }
        if (!email.trim()) {
            setError("L'email est requis");
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Adresse email invalide');
            return;
        }
        if (!password) {
            setError('Le mot de passe est requis');
            return;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/register', {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
                role,
            });
            navigate('/login', { 
            state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." } 
        });
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Erreur lors de l'inscription.");
        }
    };
    return (
        <div className='flex items-center bg-white min-h-screen'>
            <div className='container mx-auto px-6 py-6'>
                <div className='flex flex-col lg:flex-row rounded-xl shadow-xl overflow-hidden bg-[#111827]'>
                    <div className='w-full lg:w-1/2 relative overflow-hidden bg-[#111827] p-12 flex flex-col justify-center border-r border-gray-800'>
                        <div className='pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl'></div>
                        <div className='pointer-events-none absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl'></div>

                        <div className='relative z-10'>
                            <div className='flex items-center justify-between mb-10'>
                                <div className='bg-[#0d1424] border border-blue-900/60 w-11 h-11 rounded-lg flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-cyan-400' fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.66 2.524 1 1 0 01-1.09.001z" />
                                    </svg>
                                </div>
                                <span className='text-xs font-semibold tracking-widest text-cyan-400 border border-cyan-400/40 bg-cyan-400/10 rounded-full px-4 py-2 uppercase'>
                                    Smart Education
                                </span>
                            </div>

                            <h2 className='text-4xl font-semibold !text-white leading-tight' style={{ color: '#ffffff' }}>
                                Empower every learner
                                <br />
                                with actionable insights.
                            </h2>
                            <p className='text-gray-400 text-sm mt-4 leading-relaxed'>
                                Monitor course engagement, quiz outcomes, and student progress
                                in a single polished workspace.
                            </p>
                            <div className='mt-8 bg-[#131b34] border border-blue-900/40 rounded-xl p-6'>
                                <p className='flex items-center gap-2 text-sm font-semibold text-white mb-4'>
                                    <span className='text-cyan-400'>✦</span>
                                    Why teams love EduInsight
                                </p>
                                <ul className='flex flex-col gap-3'>
                                    {[
                                        'Real-time teaching analytics',
                                        'Beautiful dashboards for instructors and students',
                                        'Secure authentication and modern UI',
                                    ].map((feature) => (
                                        <li key={feature} className='flex items-start gap-3 text-sm text-gray-300'>
                                            <span className='mt-0.5 w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-cyan-400'></span>
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 bg-[#111827] p-12'>
                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-gray-400 text-xs font-semibold tracking-widest uppercase'>
                                        Join EduInsight
                                    </p>
                                    <h3 className='text-3xl text-white font-bold'>
                                        Create account
                                    </h3>
                                </div>
                                <div className='bg-[#0d1424] w-10 h-10 rounded-lg flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-white' fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                            <form className='mt-8 flex flex-col gap-4' onSubmit={handleSubmit}>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-gray-300 text-sm mb-2 text-left'>Prénom</label>
                                        <input
                                            name="firstName"
                                            type="text"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className='w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white placeholder-gray-500'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-gray-300 text-sm mb-2 text-left'>Nom</label>
                                        <input
                                            name="lastName"
                                            type="text"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className='w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white placeholder-gray-500'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-gray-300 text-sm mb-2 text-left'>Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className='w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white placeholder-gray-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-gray-300 text-sm mb-2 text-left'>Rôle</label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white'
                                    >
                                        <option value="student">student</option>
                                        <option value="teacher">teacher</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-gray-300 text-sm mb-2 text-left'>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className='w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white placeholder-gray-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-gray-300 text-sm mb-2 text-left'>Confirm password</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className='w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white placeholder-gray-500'
                                    />
                                </div>
                                {error && (
                                    <p className='text-red-400 text-sm text-center'>{error}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className='w-full bg-cyan-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-cyan-600 mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    {loading ? 'Création...' : 'Create account'}
                                </button>
                                <p className='text-gray-400 text-sm text-center mt-2'>
                                    Already have an account?{' '}
                                    <Link to="/login" className='text-cyan-400 hover:underline'>
                                        Sign in
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
export default Register;
