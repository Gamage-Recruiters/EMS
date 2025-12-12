import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeProfile from "./employee profile/EmployeeProfile";
import PersonalDetails from "./employee profile/PersonaDetails";
import ContactDetails from "./employee profile/ContactDetails";
import EducationQualification from "./employee profile/EducationQualification";
import JobDetails from "./employee profile/JobDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent layout */}
        <Route path="/profile" element={<EmployeeProfile />}>
          <Route path="personal-details" element={<PersonalDetails />} />
          <Route path="contact-details" element={<ContactDetails />} />
          <Route path="education-qualification" element={<EducationQualification />} />
          <Route path="job-details" element={<JobDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
