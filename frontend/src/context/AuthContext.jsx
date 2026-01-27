import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api.js";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const { accessToken, refreshToken, ...userData } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

       console.log("Logged in user:", userData);
    console.log("User role:", userData.role);

      toast.success("Login Successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
      return false;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);

      const { accessToken, refreshToken, ...userInfo } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userInfo));

      setUser(userInfo);
      toast.success("Registration Successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
      return false;
    }
  };

  // Google Login
  const googleLogin = async (credentialResponse) => {
    try {
      const { data } = await api.post("/auth/google", {
        tokenId: credentialResponse.credential,
      });

      const { accessToken, refreshToken, ...userData } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      toast.success("Google Login Successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Login Failed");
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    toast.success("Logged Out");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, googleLogin, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};




export default AuthContext;
