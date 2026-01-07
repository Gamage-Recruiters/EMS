import { createContext, useState, useEffect,useContext } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data));
      
      setUser(data);
      toast.success('Login Successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
      return false;
    }
  };

  // Register Function
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data));

      setUser(data);
      toast.success('Registration Successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
      return false;
    }
  };

  // Google Login Function
  const googleLogin = async (credentialResponse) => {
    try {
      const { data } = await api.post('/auth/google', {
        tokenId: credentialResponse.credential,
      });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data));

      setUser(data);
      toast.success('Google Login Successful');
      return true;
    } catch (error) {
      toast.error('Google Login Failed');
      return false;
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged Out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;