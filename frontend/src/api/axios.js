import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const api = axios.create({
    baseURL: BASE,
});
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/login', '/register'];
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const isPublicRoute = PUBLIC_ROUTES.some((route) => config.url?.endsWith(route));
    if (token && !isPublicRoute) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
    return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || '';
        const isPublicRoute = PUBLIC_ROUTES.some((route) => requestUrl.endsWith(route));

        if (status === 401 && !isPublicRoute) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return "Une erreur inattendue s'est produite.";
};
export default api;