// src/App.js
import React, { useState } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage'; 
import AttendancePrompt from './components/AttendancePrompt'; 
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
    const [checkInTime, setCheckInTime] = useState(null); 
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    const handleCheckIn = (time) => {
        setCheckInTime(time);
        setIsCheckedIn(true);
    };

    return (
        <BrowserRouter>
            {!isCheckedIn && <AttendancePrompt onCheckIn={handleCheckIn} />}

            <div className={`flex h-screen bg-gray-50 transition-opacity duration-300 ${!isCheckedIn ? 'opacity-50 pointer-events-none' : ''}`}>
                
                <Sidebar />
                
                <div className="flex flex-col flex-grow">
                    <Header />
                    <div className="flex-grow overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<DashboardPage checkInTime={checkInTime} />} />
                            <Route path="/dashboard" element={<DashboardPage checkInTime={checkInTime} />} />
                            <Route path="/attendance" element={<AttendancePage />} /> {/* <-- Add this */}
                            <Route path="*" element={<div className="p-5"><h2>404 Not Found</h2></div>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
