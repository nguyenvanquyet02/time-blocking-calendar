import type React from "react";
import type { UserRole } from "../types/auth";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                    403 - Không có quyền truy cập
                </h2>
                <p className="text-gray-600">
                    Bạn cần quyền quản trị viên ({allowedRoles.join(", ")}) để
                    truy cập trang này.
                </p>
            </div>
        );
    }

    return <>{children}</>;
};
