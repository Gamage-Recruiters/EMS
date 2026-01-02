import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";
import AttendancePrompt from "./components/AttendancePrompt";

// Existing pages (from HEAD)
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";

// Management (from integrate-kanchana-kavya)
import UserManagementPage from "./features/management/pages/UserManagementPage";
import TeamManagementPage from "./features/management/pages/TeamManagementPage";
import TeamHierarchyPage from "./features/management/pages/TeamHierarchyPage";

// Employee profile routes (from integrate-kanchana-kavya)
import EmployeeProfile from "./employee profile/EmployeeProfile";
import PersonalDetails from "./employee profile/PersonalDetails";
import ContactDetails from "./employee profile/ContactDetails";
import EducationQualification from "./employee profile/EducationQualification";
import JobDetails from "./employee profile/JobDetails";

// Other pages (from integrate-kanchana-kavya)
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
    <BrowserRouter>
      {/* Check-in modal/prompt stays clickable even when app UI is disabled */}
      {!isCheckedIn && <AttendancePrompt onCheckIn={handleCheckIn} />}

      {/* Disable the main app until checked-in */}
      <div
        className={`min-h-screen bg-gray-50 transition-opacity duration-300 ${
          !isCheckedIn ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Routes>
          <Route element={<PageLayout />}>
            {/* Default landing */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* HEAD routes */}
            <Route
              path="/dashboard"
              element={<DashboardPage checkInTime={checkInTime} />}
            />
            <Route path="/attendance" element={<AttendancePage />} />

            {/* integrate-kanchana-kavya routes */}
            <Route path="/employees" element={<UserManagementPage />} />
            <Route path="/team-management" element={<TeamManagementPage />} />
            <Route path="/team-hierarchy" element={<TeamHierarchyPage />} />
            <Route path="/teams" element={<Navigate to="/team-management" replace />} />

            {/* Employee profile with nested routes */}
            <Route path="/profile" element={<EmployeeProfile />}>
              <Route path="personal-details" element={<PersonalDetails />} />
              <Route path="contact-details" element={<ContactDetails />} />
              <Route
                path="education-qualification"
                element={<EducationQualification />}
              />
              <Route path="job-details" element={<JobDetails />} />
            </Route>

            {/* Other pages */}
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/user-profile/:id" element={<UserProfile />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
