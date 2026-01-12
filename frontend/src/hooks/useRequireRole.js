import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useRequireRole = (allowedRoles = []) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Not logged in
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Logged in but role not allowed
    if (!allowedRoles.includes(user.role)) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, loading, allowedRoles, navigate]);

  return {
    user,
    loading,
    isAuthorized: !!user && allowedRoles.includes(user.role),
  };
};
