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

// Dashboards
import DashboardOverview from "./pages/dashboard/DashBoardOverview";
import DashboardPage from "./pages/DashboardPage";

// RBAC Dashboards
import CeoDashboard from "./pages/dashboard/CeoDashboard";
import DevDashboard from "./pages/dashboard/DevDashboard";
import SystemOwnerDashboard from "./pages/dashboard/SystemOwnerDashboard";
import TLDashboard from "./pages/dashboard/TLDashboard";

// Attendance
import AttendancePage from "./pages/AttendancePage";
// Leave module
import LeaveForm from "./pages/LeaveForm";
import LeaveApproval from "./pages/LeaveApproval";

// Management
import UserManagementPage from "./features/management/pages/UserManagementPage.jsx";
// import TeamManagementPage from "./features/management/pages/TeamManagementPage.jsx";
// import TeamHierarchyPage from "./features/management/pages/TeamHierarchyPage.jsx";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";

// Developer pages
import DailyTaskFormPage from "./features/developer/pages/DailyTaskFormPage";
import DailyTaskPage from "./features/developer/pages/DailyTaskPage";
import DeveloperComplaintForm from "./features/developer/pages/ComplaintSubmissionPage";
import DeveloperComplaintDashboard from "./features/developer/pages/ComplaintDashboard";

// Employee Profile (Nested)
import EmployeeProfile from "./features/management/pages/employee-profile/EmployeeProfile";
import PersonalDetails from "./features/management/pages/employee-profile/PersonalDetails";
import ContactDetails from "./features/management/pages/employee-profile/ContactDetails";
import EducationQualification from "./features/management/pages/employee-profile/EducationQualification";
import JobDetails from "./features/management/pages/employee-profile/JobDetails";
//meeting Pages
import MeetingOverview from "./pages/Meeting-Notification-Chat/MeetingOverview";
import CreateMeetings from "./pages/Meeting-Notification-Chat/CreateMeetings";

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
          {/* Default after login */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* ================= DASHBOARD ================= */}
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

          {/* ================= ATTENDANCE ================= */}
          <Route path="/attendance" element={<AttendancePage />} />

          {/* ================= LEAVE ================= */}
          <Route path="/leave-form" element={<LeaveForm />} />
          <Route path="/leave-approval" element={<LeaveApproval />} />

          {/* ================= ROLE BASED DASHBOARDS ================= */}
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

          {/* ================= EMPLOYEE PROFILE (NESTED) ================= */}
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
            <Route
              path="*"
              element={<Navigate to="personal-details" replace />}
            />
          </Route>
          {/* Developer */}
          <Route path="/tasks" element={<DailyTaskPage />} />
          <Route path="/tasks/new" element={<DailyTaskFormPage />} />
          <Route path="/complaints" element={<DeveloperComplaintDashboard />} />
          <Route path="/complaints/new" element={<DeveloperComplaintForm />} />

          {/* Management */}
          <Route path="/tasks/review" element={<DailyTaskReviewPage />} />
          <Route
            path="/complaints/review"
            element={<ComplaintReviewDashboard />}
          />
          <Route
            path="/complaints/new-admin"
            element={<AdminComplaintSubmissionPage />}
          />

          {/* Meetings */}
          <Route path="/meetings" element={<MeetingOverview />} />
          <Route path="/meetings/create" element={<CreateMeetings />} />

          {/* App fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* ================= GLOBAL FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
