import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../../api/axios';

const AuthContext = createContext(null);

export const getDashboardPath = (role = '') => {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'student':
            return '/student';
        case 'teacher':
            return '/teacher';
        default:
            return '/login';
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) };
        }
    };

    const login = async (data) => {
        try {
            const response = await api.post('/auth/login', data);
            const token = response.data?.token;
            const loggedUser = response.data?.user;
            if (!token || !loggedUser) {
                return { success: false, message: 'La réponse du serveur est invalide.' };
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(loggedUser));
            setUser(loggedUser);
            const destination = getDashboardPath(loggedUser?.role);
            navigate(destination, { replace: true });
            return { success: true, user: loggedUser };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login', { replace: true });
    };

    // Met à jour l'utilisateur (state + localStorage) sans nouvelle connexion,
    // utile après un changement d'avatar, de profil, etc.
    const updateUser = (updatedUser) => {
        setUser((prev) => {
            const merged = { ...prev, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(merged));
            return merged;
        });
    };

    const value = useMemo(() => ({
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: Boolean(user),
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
}