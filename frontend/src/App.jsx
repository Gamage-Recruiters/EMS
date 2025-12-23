import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";
import LeaveForm from "./pages/LeaveForm";
import LeaveApproval from "./pages/LeaveApproval";

import AttendancePrompt from "./components/AttendancePrompt";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = (time) => {
    setCheckInTime(time);
    setIsCheckedIn(true);
  };

  return (
    <BrowserRouter>
      {isCheckedIn && <AttendancePrompt onCheckIn={handleCheckIn} />}

      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex flex-col flex-grow">
          <Header />

          <div className="flex-grow overflow-y-auto">
            <Routes>
              {/* Default */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* Core pages */}
              <Route
                path="/dashboard"
                element={<DashboardPage checkInTime={checkInTime} />}
              />
              <Route path="/attendance" element={<AttendancePage />} />

              {/* Leave module */}
              <Route path="/leave-form" element={<LeaveForm />} />
              <Route path="/leave-approval" element={<LeaveApproval />} />

              {/* 404 */}
              <Route
                path="*"
                element={<div className="p-6 text-red-500">Page not found</div>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
