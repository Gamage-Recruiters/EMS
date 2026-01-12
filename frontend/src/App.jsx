// src/App.js
import React, { useState } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage'; 
import AttendancePrompt from './components/AttendancePrompt'; 
import Header from './components/Header';
import Sidebar from './components/Sidebar';

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

          {/* Leave module */}
          <Route path="/leave-form" element={<LeaveForm />} />
          <Route path="/leave-approval" element={<LeaveApproval />} />

          {/* Management */}
          <Route path="/employees" element={<UserManagementPage />} />
          <Route path="/team-management" element={<TeamManagementPage />} />
          <Route path="/team-hierarchy" element={<TeamHierarchyPage />} />
          <Route
            path="/teams"
            element={<Navigate to="/team-management" replace />}
          />

          {/* Employee profile */}
          <Route path="/profile" element={<EmployeeProfile />}>
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="contact-details" element={<ContactDetails />} />
            <Route
              path="education-qualification"
              element={<EducationQualification />}
            />
            <Route path="job-details" element={<JobDetails />} />
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
