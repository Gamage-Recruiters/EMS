import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles || allowedRoles.includes(user.role)) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;
