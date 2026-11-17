import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "@/pages/LoadingScreen";

function ProtectedRoute() {
  const location = useLocation();

  const { isAuthenticated, isInitialized } = useSelector((state) => state.user);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
