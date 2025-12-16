import { Routes, Route, Navigate } from "react-router-dom";

import LeaveForm from "./pages/LeaveForm";
import LeaveApproval from "./pages/LeaveApproval";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/leave-form" />} />

      {/* Pages */}
      <Route path="/leave-form" element={<LeaveForm />} />
      <Route path="/leave-approval" element={<LeaveApproval />} />

      {/* 404 fallback */}
      <Route path="*" element={<div className="p-10 text-red-500">Page not found</div>} />
    </Routes>
  );
}

export default App;
