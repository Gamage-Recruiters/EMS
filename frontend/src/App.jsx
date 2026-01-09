import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";
import AttendancePrompt from "./components/AttendancePrompt";
import PrivateRoute from "./routes/PrivateRoute";

// Auth pages
import LoginPage from "./pages/auth/Login";

// Main pages
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";
// import { getTodayAttendance } from "./services/attendanceService";


export default function App() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  // const [attendanceChecked, setAttendanceChecked] = useState(false);


  const handleCheckIn = (time) => {
    setCheckInTime(time);
    setIsCheckedIn(true);
  };
  
  // useEffect(() => {
  //   const attendanceInitStatus = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       return;
  //     }
      
  //     try {
  //       const response = await getTodayAttendance();
  //       if (response.success && response.data?.checkInTime) {
  //         const checkInDate = new Date(response.data.checkInTime);

  //         const today = new Date();
  //         const isTodayCheckIn = checkInDate.toDateString() === today.toDateString();
          
  //         if (isTodayCheckIn) {
  //           setCheckInTime(checkInDate);
  //           setIsCheckedIn(true);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching today's attendance:", error);
  //     } finally {
  //       setAttendanceChecked(true);
  //     }
  //   };
    
  //   attendanceInitStatus();

  // }, []);

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
              <PageLayout />
            </>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={<DashboardPage checkInTime={checkInTime} />}
          />
          <Route path="/attendance" element={<AttendancePage />} />
        </Route>
      </Route>
    </Routes>
  );
}