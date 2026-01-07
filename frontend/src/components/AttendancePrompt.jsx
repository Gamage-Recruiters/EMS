import React, { useState, useEffect } from "react";

import { checkIn } from "../services/attendanceService";

// Replace this with the actual backend endpoint later
const USER_INFO_ENDPOINT = "/api/user/profile";

const AttendancePrompt = ({ onCheckIn }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState({
    name: "",
    isLoading: true,
    error: null,
  });



  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user profile (mock for now, replace with real API later)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // MOCK: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = { firstName: "John", lastName: "Smith" };

        // LATER: replace above with actual API call
        // const response = await fetch(USER_INFO_ENDPOINT);
        // const data = await response.json();

        setProfile({
          name: `${data.firstName} ${data.lastName}`,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setProfile({
          name: "User",
          isLoading: false,
          error: "Failed to load profile",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleCheckInClick = async () => {
    const result = await checkIn();
    if (result.success) {
      onCheckIn(currentTime);
       console.log("Check-in result:", result);
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
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center transform transition-all duration-300">
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
          <p className="text-5xl font-black text-gray-800 mt-1 leading-tight">
            {formattedTime}
          </p>
          <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
        </div>

        <button
          onClick={handleCheckInClick}
          disabled={profile.isLoading || profile.error}
          className={`w-full py-3 text-white text-lg font-bold rounded-lg shadow-lg transition duration-200 ease-in-out ${
            profile.isLoading || profile.error
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-green-400/30"
          }`}
        >
          {profile.isLoading
            ? "Loading Profile..."
            : profile.error
            ? "Unable to Load"
            : "Check In Now"}
        </button>
      </div>
    </div>
  );
};

export default AttendancePrompt;
