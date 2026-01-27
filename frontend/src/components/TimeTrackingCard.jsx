import React, { useEffect, useState } from "react";
import { checkOut , getTodayAttendance} from "../services/attendanceService";

const TimeTrackingCard = ({ checkInTime }) => {
  const [todayAttendance, setTodayAttendance] = useState(null);

  useEffect(()=> {
    const fetchTodayAttendance = async () => {
      const result = await getTodayAttendance();
      if(result.success) {
        setTodayAttendance(result.data.data);
      }
    };
    fetchTodayAttendance();
  },[])
  const formatTime = (time) => {
    if (!time) return "- - -";
    const date = new Date(time)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  const checkOutTime = todayAttendance?.checkOutTime;
  console.log("checkouttime",checkOutTime)
  const formattedCheckInTime = formatTime(checkInTime);
  const formattedCheckOutTime = formatTime(checkOutTime);

  const handleCheckOut = async () => {
    // Call check-out API here
    const result = await checkOut();
    if (result.success) {
    setTodayAttendance((prev) => ({
      ...prev,
      checkOutTime: result.data.data.checkOutTime, // backend response
    }));
    } else {
      alert(result.error || "Failed to check out. Please try again.");
      console.error("Check-out error:", result.error);
    }
  };

  const isClockedIn = !!checkInTime && !checkOutTime;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
      <div className="flex justify-between items-center my-2">
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Check-in Time
          </div>

          <div className="text-4xl font-black text-blue-600">
            {formattedCheckInTime}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Check-out Time
          </div>

          <div
            className={`text-4xl font-black ${
              checkOutTime ? "text-blue-600" : "text-gray-300"
            }`}
          >
            {formattedCheckOutTime}
          </div>
        </div>

        <div className="pl-4">
          {isClockedIn && (
            <button
              onClick={handleCheckOut}
              className="px-6 py-2 text-base font-bold rounded-lg border-none bg-red-600 text-white shadow-md hover:bg-red-700 transition duration-200"
            >
              Check Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingCard;
