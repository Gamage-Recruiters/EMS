import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout";
import UserManagementPage from "./features/management/pages/UserManagementPage";

import TeamManagementPage from "./features/management/pages/TeamManagementPage";
import TeamHierarchyPage from "./features/management/pages/TeamHierarchyPage";

import EmployeeProfile from "./employee profile/EmployeeProfile";
import PersonalDetails from "./employee profile/PersonalDetails";
import ContactDetails from "./employee profile/ContactDetails";
import EducationQualification from "./employee profile/EducationQualification";
import JobDetails from "./employee profile/JobDetails";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          {/* Default landing */}
          <Route index element={<Navigate to="/employees" replace />} />

          {/* Existing */}
          <Route path="/employees" element={<UserManagementPage />} />

          {/* Kavya: team features as proper routes */}
          <Route path="/team-management" element={<TeamManagementPage />} />
          <Route path="/team-hierarchy" element={<TeamHierarchyPage />} />

          {/* Optional convenience redirect if someone visits /teams */}
          <Route path="/teams" element={<Navigate to="/team-management" replace />} />

          {/* Kanchana: employee profile */}
          <Route path="/profile" element={<EmployeeProfile />}>
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="contact-details" element={<ContactDetails />} />
            <Route path="education-qualification" element={<EducationQualification />} />
            <Route path="job-details" element={<JobDetails />} />
          </Route>

          {/* Other pages */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />

          {/* Fallback (optional): send unknown routes to employees */}
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
