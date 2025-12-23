import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import VerifyCode from "./pages/auth/VerifyCode.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ResetSuccess from "./pages/auth/ResetSuccess.jsx";

// Profile Pages
import PersonalDetailsPage from "./pages/profile/PersonalDetails.jsx";
import ContactDetailsPage from "./pages/profile/ContactDetails.jsx";
import EducationPage from "./pages/profile/EducationPage.jsx";
import JobDetailsPage from "./pages/profile/JobDetails.jsx";

// Dashboard
import DashboardOverview from "./pages/dashboard/DashBoardOverview.jsx";
import CeoDashboard from "./pages/dashboard/CeoDashboard.jsx";
import DevDashboard from "./pages/dashboard/DevDashboard.jsx";
import SystemOwnerDashboard from "./pages/dashboard/SystemOwnerDashboard.jsx";
import TLDashboard from "./pages/dashboard/TLDashboard.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Default route - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

       {/* Auth pages route */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* Profile page routes */}
      <Route
        path="/profile/personal"
        element={
          <ProtectedRoute>
            <PersonalDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/contact"
        element={
          <ProtectedRoute>
            <ContactDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/education"
        element={
          <ProtectedRoute>
            <EducationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/job"
        element={
          <ProtectedRoute>
            <JobDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect /profile -> /profile/personal */}
      <Route path="/profile" element={<Navigate to="/profile/personal" replace />} />

      {/* Dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardOverview />
          </ProtectedRoute>
        }
      />

        {/* RBAC dashboards */}
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
    </Routes>
  );
}

export default App;