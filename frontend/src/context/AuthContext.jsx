import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      return { success: true, user: response.data.user };
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      return { success: true, user: response.data.user };
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return { success: true, message: response.data.message };
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify Code
  const verifyCode = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/verify-code", { token });
      return { success: true, message: response.data.message };
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (token, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });
      return { success: true, message: response.data.message };
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Get Profile
  const getProfile = async () => {
    try {
      const response = await api.get("/profile");
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Load user on mount if token exists
  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        token,
        login,
        register,
        forgotPassword,
        verifyCode,
        resetPassword,
        getProfile,
        logout,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
