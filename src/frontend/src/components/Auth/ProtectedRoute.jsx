import { Outlet, Navigate } from "react-router";

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("access_token"); // Your logic

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
