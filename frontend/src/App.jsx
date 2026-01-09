import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";
import AttendancePrompt from "./components/AttendancePrompt";
import PrivateRoute from "./routes/PrivateRoute";

// Auth pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";

// Main pages
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";

//Management
import UserManagementPage from "./features/management/pages/UserManagementPage";

// Employee profile
import EmployeeProfile from "./features/management/pages/employee-profile/EmployeeProfile";
import PersonalDetails from "./features/management/pages/employee-profile/PersonalDetails";
import ContactDetails from "./features/management/pages/employee-profile/ContactDetails";
import EducationQualification from "./features/management/pages/employee-profile/EducationQualification";
import JobDetails from "./features/management/pages/employee-profile/JobDetails";

// Other pages
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";

export default function App() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = (time) => {
    setCheckInTime(time);
    setIsCheckedIn(true);
  };

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <>
              {!isCheckedIn && <AttendancePrompt onCheckIn={handleCheckIn} />}

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

          {/* Management */}
          <Route path="/employees" element={<UserManagementPage />} />

          {/* EMPLOYEE PROFILE (NESTED) */}
          <Route path="/profile" element={<EmployeeProfile />}>
            <Route index element={<Navigate to="personal-details" replace />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="contact-details" element={<ContactDetails />} />
            <Route path="education-qualification" element={<EducationQualification />} />
            <Route path="job-details" element={<JobDetails />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="*" element={<Navigate to="personal-details" replace />}/>
          </Route>

          {/* Other */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />

          {/* App fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* ================= GLOBAL FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
