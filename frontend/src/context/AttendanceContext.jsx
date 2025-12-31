import { createContext, useContext, useState} from 'react';
import api from '../api/api';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check-in
  const checkIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/attendance/checkIn');
      setTodayAttendance(data.data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to check in';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getTodayAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/attendance/todayAttendance');
      setTodayAttendance(data.data);
      return data;
    }catch (err) {
      setError(err.message || 'Failed to fetch today\'s attendance');
      throw err;
    }finally {
      setLoading(false);
    }
  }

  const getAllAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/attendance');
      return data;
    }catch (err) {
      setError(err.message || 'Failed to fetch attendance records');
      throw err;
    }finally {
      setLoading(false);
    }
  }

  const value = {
    // State
    loading,
    error,
    hasCheckedIn: !!todayAttendance,

    // Actions
    checkIn,
    getTodayAttendance,
    getAllAttendance,
    setError,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};