import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getDashboardPath } from './context/AuthContext';
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#111827] text-white">
                Chargement...
            </div>
        );
    }
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }
    return children;
};
export default ProtectedRoute;