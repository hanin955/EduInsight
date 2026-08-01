import { createContext, useContext, useState } from 'react';
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
            return '/accueil';
        default:
            return '/login';
    }
};
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("Erreur lors de la lecture de l'utilisateur stocké :", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return null;
            }
        }
        return null;
    });
    const [loading] = useState(false);
    const navigate = useNavigate();

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
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
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
    };
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