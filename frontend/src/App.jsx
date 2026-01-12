import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Guards
import PageLayout from "./components/layout/PageLayout";
import AttendancePrompt from "./components/AttendancePrompt";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyCode from "./pages/auth/VerifyCode";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetSuccess from "./pages/auth/ResetSuccess";

// Dashboards (RBAC)
import DashboardOverview from "./pages/dashboard/DashBoardOverview";
import CeoDashboard from "./pages/dashboard/CeoDashboard";
import DevDashboard from "./pages/dashboard/DevDashboard";
import SystemOwnerDashboard from "./pages/dashboard/SystemOwnerDashboard";
import TLDashboard from "./pages/dashboard/TLDashboard";

// Attendance & Core
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";

// Management
import UserManagementPage from "./features/management/pages/UserManagementPage";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";

// Employee profile (nested)
import EmployeeProfile from "./features/management/pages/employee-profile/EmployeeProfile";
import PersonalDetails from "./features/management/pages/employee-profile/PersonalDetails";
import ContactDetails from "./features/management/pages/employee-profile/ContactDetails";
import EducationQualification from "./features/management/pages/employee-profile/EducationQualification";
import JobDetails from "./features/management/pages/employee-profile/JobDetails";

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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

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

          {/* ================= CORE DASHBOARD ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/home"
            element={<DashboardPage checkInTime={checkInTime} />}
          />

          <Route path="/attendance" element={<AttendancePage />} />

          {/* ================= RBAC DASHBOARDS ================= */}
          <Route
            path="/dashboard/ceo"
            element={
              <ProtectedRoute allowedRoles={["CEO"]}>
                <CeoDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/dev"
            element={
              <ProtectedRoute allowedRoles={["DEVELOPER"]}>
                <DevDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/system-owner"
            element={
              <ProtectedRoute allowedRoles={["SYSTEM_OWNER"]}>
                <SystemOwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/tl"
            element={
              <ProtectedRoute allowedRoles={["TL"]}>
                <TLDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= MANAGEMENT ================= */}
          <Route path="/employees" element={<UserManagementPage />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />

          {/* ================= EMPLOYEE PROFILE ================= */}
          <Route path="/profile" element={<EmployeeProfile />}>
            <Route index element={<Navigate to="personal-details" replace />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="contact-details" element={<ContactDetails />} />
            <Route
              path="education-qualification"
              element={<EducationQualification />}
            />
            <Route path="job-details" element={<JobDetails />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="*" element={<Navigate to="personal-details" replace />} />
          </Route>

          {/* App fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* ================= GLOBAL FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
