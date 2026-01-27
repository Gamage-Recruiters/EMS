import React, { useState, useEffect } from "react";
import { checkIn, getTodayAttendance } from "../services/attendanceService";

const AttendancePrompt = ({ onCheckIn }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    isLoading: true,
    error: null,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user profile FIRST
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userRole = user?.role?.toUpperCase() || "";

        setProfile({
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User",
          role: userRole,
          isLoading: false,
          error: null,
        });

        // If CEO, auto check-in
        if (userRole === "CEO") {
          onCheckIn(new Date());
          setHasCheckedInToday(true);
          setAttendanceLoading(false);
        }
      } catch (err) {
        setProfile({
          name: "User",
          role: "",
          isLoading: false,
          error: "Failed to load profile",
        });
      }
    };

    fetchUserProfile();
  }, [onCheckIn]);

  // Check today's attendance (only if not CEO)
  useEffect(() => {
    if (profile.role === "CEO") return;

    const checkAttendanceStatus = async () => {
      const result = await getTodayAttendance();

      if (result.success && result.data.hasCheckedIn) {
        setHasCheckedInToday(true);
        onCheckIn(new Date());
      }

      setAttendanceLoading(false);
    };

    if (!profile.isLoading) {
      checkAttendanceStatus();
    }
  }, [profile.isLoading, profile.role, onCheckIn]);

  // Do not show popup if:
  if (
    attendanceLoading || 
    hasCheckedInToday || 
    profile.role === "CEO"
  ) {
    return null;
  }

  const handleCheckInClick = async () => {
    const result = await checkIn();
    if (result.success) {
      onCheckIn(currentTime);
    } else {
      alert(result.error || "Failed to check in. Please try again.");
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {getGreeting()},
        </h2>
        <h3 className="text-2xl font-extrabold text-blue-600 mb-6">
          {profile.isLoading ? "..." : profile.name}!
        </h3>

        <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500 font-semibold mb-1">
            Current Local Time
          </p>
          <p className="text-5xl font-black text-gray-800 mt-1">
            {formattedTime}
          </p>
          <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
        </div>

        <button
          onClick={handleCheckInClick}
          disabled={profile.isLoading || profile.error}
          className={`w-full py-3 text-white text-lg font-bold rounded-lg ${
            profile.isLoading || profile.error
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Check In Now
        </button>
      </div>
    </div>
  );
};

export default AttendancePrompt;