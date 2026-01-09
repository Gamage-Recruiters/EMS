import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";
import AttendancePrompt from "./components/AttendancePrompt";
import PrivateRoute from "./routes/PrivateRoute";

// Auth pages
import LoginPage from "./pages/auth/Login";

// Main pages
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";

export default function App() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoadingCheckIn, setIsLoadingCheckIn] = useState(true);

  // Load check-in status when app mounts
  useEffect(() => {
    const savedCheckInTime = sessionStorage.getItem('checkInTime');
    const savedIsCheckedIn = sessionStorage.getItem('isCheckedIn');
    
    if (savedIsCheckedIn === 'true' && savedCheckInTime) {
      setCheckInTime(savedCheckInTime);
      setIsCheckedIn(true);
    }
    
    setIsLoadingCheckIn(false);
  }, []);

  const handleCheckIn = (time) => {
    setCheckInTime(time);
    setIsCheckedIn(true);
    
    // Save to sessionStorage so it persists during the session
    sessionStorage.setItem('checkInTime', time);
    sessionStorage.setItem('isCheckedIn', 'true');
  };

  // Show loading while checking status
  if (isLoadingCheckIn) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<LoginPage />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <>
              {!isCheckedIn && (
                <AttendancePrompt onCheckIn={handleCheckIn} />
              )}

              <div
                className={`min-h-screen bg-gray-50 transition-opacity duration-300 ${
                  !isCheckedIn ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <PageLayout />
              </div>
            </>
          }
        >
          {/* Default */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Core */}
          <Route
            path="/dashboard"
            element={<DashboardPage checkInTime={checkInTime} />}
          />
          <Route path="/attendance" element={<AttendancePage />} />

          {/* App fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* ================= GLOBAL FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}