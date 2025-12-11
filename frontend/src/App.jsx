import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Profile Pages
import PersonalDetailsPage from "./pages/profile/PersonalDetails.jsx";
import ContactDetailsPage from "./pages/profile/ContactDetails.jsx";
import EducationPage from "./pages/profile/EducationPage.jsx";
import JobDetailsPage from "./pages/profile/JobDetails.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/profile/personal" replace />} />

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
    </Routes>
  );
}

export default App;