import { useAuth } from "../context/AuthContext";

export const useAuthCheck = () => {
  const { user, loading } = useAuth();

  const isAuthenticated = () => {
    return !!user;
  };

  return {
    user,
    loading,
    isAuthenticated,
  };
};
