// Main application component that defines all routes and layout for the Employee Management System (EMS).
// It uses React Router for navigation and includes guards for protected routes based on user roles.
// The app also manages attendance check-in state and displays an attendance prompt when necessary.


import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoleRedirect from "./routes/RoleRedirect.jsx";

// Layout & Guards
import PageLayout from "./components/layout/PageLayout";
import AttendancePrompt from "./components/AttendancePrompt";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Auth
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyCode from "./pages/auth/VerifyCode";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetSuccess from "./pages/auth/ResetSuccess";

// Dashboards
import DashboardOverview from "./pages/dashboard/DashBoardOverview";
import DashboardPage from "./pages/DashboardPage";
import CeoDashboard from "./pages/dashboard/CeoDashboard";
import DevDashboard from "./pages/dashboard/DevDashboard";
import SystemOwnerDashboard from "./pages/dashboard/SystemOwnerDashboard";
import TLDashboard from "./pages/dashboard/TLDashboard";

// Common Pages
import AttendancePage from "./pages/AttendancePage";
import LeaveForm from "./pages/LeaveForm";
import LeaveApproval from "./pages/LeaveApproval";

// Management
import UserManagementPage from "./features/management/pages/UserManagementPage";
import DailyTaskReviewPage from "./features/management/pages/DailyTaskReviewPage";
import ComplaintReviewDashboard from "./features/management/pages/ComplaintReviewDashboard";
import AdminComplaintSubmissionPage from "./features/management/pages/AdminComplaintSubmissionPage";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";

// Developer
import DailyTaskFormPage from "./features/developer/pages/DailyTaskFormPage";
import DailyTaskPage from "./features/developer/pages/DailyTaskPage";
import DeveloperComplaintForm from "./features/developer/pages/ComplaintSubmissionPage";
import DeveloperComplaintDashboard from "./features/developer/pages/ComplaintDashboard";
import SelfProfileEditPage from "./features/developer/pages/SelfProfileEditPage";

// Employee Profile
import EmployeeProfile from "./features/management/pages/employee-profile/EmployeeProfile";
import PersonalDetails from "./features/management/pages/employee-profile/PersonalDetails";
import ContactDetails from "./features/management/pages/employee-profile/ContactDetails";
import EducationQualification from "./features/management/pages/employee-profile/EducationQualification";
import JobDetails from "./features/management/pages/employee-profile/JobDetails";

// Meetings
import MeetingOverview from "./pages/Meeting-Notification-Chat/MeetingOverview";
import CreateMeetings from "./pages/Meeting-Notification-Chat/CreateMeetings";
import Notifications from "./pages/Meeting-Notification-Chat/Notifications";
import ChatPage from "./pages/Meeting-Notification-Chat/ChatPage";
import UnassignedDashboard from "./pages/dashboard/UnassignedDashboard.jsx";
import TLPastProjects from "./pages/dashboard/TLPastProjects";

// Kanban
import TaskBoardPage from "./pages/kanban/TaskBoardPage";

export default function App() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = (time) => {
    setCheckInTime(time);
    setIsCheckedIn(true);
  };

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* ================= PRIVATE ================= */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <>
              {!isCheckedIn && <AttendancePrompt onCheckIn={handleCheckIn} />}
              <div
                className={`min-h-screen bg-gray-50 ${
                  !isCheckedIn ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <PageLayout />
              </div>
            </>
          }
        >
          {/* Entry */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* ================= COMMON ================= */}
          <Route path="/dashboard/home" element={<DashboardPage checkInTime={checkInTime} />} />
          <Route path="/dashboard/overview" element={<DashboardOverview />} />
          <Route path="/dashboard/attendance" element={<AttendancePage />} />
          <Route path="/dashboard/meetings" element={<MeetingOverview />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route path="/dashboard/unassigned" element={<UnassignedDashboard />} />
          <Route path="/dashboard/leave-form" element={<LeaveForm />} />

          {/* ================= CEO ================= */}
          <Route
            path="/dashboard/ceo"
            element={
              <ProtectedRoute allowedRoles={["CEO"]}>
                <CeoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ceo/leave"
            element={
              <ProtectedRoute allowedRoles={["CEO"]}>
                <LeaveApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ceo/daily-task-sheet"
            element={
              <ProtectedRoute allowedRoles={["CEO", "SystemAdmin", "TL"]}>
                <DailyTaskReviewPage />
              </ProtectedRoute>
            }
          />


          <Route path="/dashboard/meetings/create" element={
            <ProtectedRoute allowedRoles={["CEO", "SystemAdmin", "TL"]}>
            <CreateMeetings />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/meetings/create" element={
              <ProtectedRoute allowedRoles={["CEO", "SystemAdmin", "TL"]}>
            <CreateMeetings />
             </ProtectedRoute>
            }
            />

           {/* ================= Kanban ================= */}
           <Route path="/dashboard/kanban" element={<TaskBoardPage />} />  

          {/* ================= DEVELOPER ================= */}
          <Route
            path="/dashboard/dev"
            element={
              <ProtectedRoute allowedRoles={["Developer"]}>
                <DevDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/dev/daily-task-update"
            element={
              <ProtectedRoute allowedRoles={["Developer"]}>
                <DailyTaskFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/dev/weekly-summary"
            element={
              <ProtectedRoute allowedRoles={["Developer", "TL", "PM", "CEO"]}>
                <DailyTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/dev/task-board"
            element={
              <ProtectedRoute allowedRoles={["Developer", "TL", "CEO"]}>
                <TaskBoardPage />
              </ProtectedRoute>
            }
          />

          {/* ================= COMPLAINTS ================= */}
          <Route
            path="/dashboard/complaints"
            element={<DeveloperComplaintDashboard />}
          />
          <Route
            path="/dashboard/complaints/new"
            element={
              <ProtectedRoute allowedRoles={["Developer"]}>
                <DeveloperComplaintForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/complaints/review"
            element={
              <ProtectedRoute allowedRoles={["CEO", "SystemAdmin", "TL"]}>
                <ComplaintReviewDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/complaints/new-admin"
            element={
              <ProtectedRoute allowedRoles={["CEO", "SystemAdmin"]}>
                <AdminComplaintSubmissionPage />
              </ProtectedRoute>
            }
          />

          {/* ================= MANAGEMENT ================= */}
          <Route
            path="/dashboard/employees"
            element={
              <ProtectedRoute allowedRoles={["CEO", "SystemAdmin", "TL"]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/user-profile/:id" element={<UserProfile />} />

          {/* ================= DEVELOPER SELF PROFILE ================= */}
          <Route
            path="/dashboard/my-profile"
            element={
              <ProtectedRoute allowedRoles={["Developer"]}>
                <SelfProfileEditPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="personal-details?mode=edit" replace />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="contact-details" element={<ContactDetails />} />
            <Route path="education-qualification" element={<EducationQualification />} />
          </Route>

          {/* ================= EMPLOYEE PROFILE MANAGEMENT ================= */}
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["CEO", "SystemAdmin", "TL"]}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="personal-details" replace />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="contact-details" element={<ContactDetails />} />
            <Route path="education-qualification" element={<EducationQualification />} />
            <Route path="job-details" element={<JobDetails />} />
            <Route path="attendance" element={<AttendancePage />} />
          </Route>

          {/* ================= SYSTEM ADMIN & TL ================= */}
          <Route
            path="/dashboard/system-admin"
            element={
              <ProtectedRoute allowedRoles={["SystemAdmin"]}>
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
          <Route
            path="/dashboard/tl/team-formation"
            element={<Navigate to="/dashboard/employees?tab=team-creation" replace />}
          />
          <Route
            path="/dashboard/tl/add-developer"
            element={<Navigate to="/dashboard/employees?tab=teams" replace />}
          />
          <Route
            path="/dashboard/tl/notices"
            element={
              <ProtectedRoute allowedRoles={["TL"]}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tl/dev-progress"
            element={
              <ProtectedRoute allowedRoles={["TL"]}>
                <DailyTaskReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tl/weekly-progress"
            element={
              <ProtectedRoute allowedRoles={["TL"]}>
                <DailyTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tl/past-projects"
            element={
              <ProtectedRoute allowedRoles={["TL"]}>
                <TLPastProjects />
              </ProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* ================= GLOBAL ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
