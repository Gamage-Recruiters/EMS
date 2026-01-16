import React, { useState, useEffect } from "react";
import {
  setAvailability,
  getMyAvailability,
} from "../../services/availabilityService";

const Header = () => {
  /* ================= DATE ================= */
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ================= USER ================= */
  const storedUser = localStorage.getItem("ems_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "User";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  /* ================= STATE ================= */
  const [status, setStatus] = useState("APPEAR_AWAY");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "AVAILABLE", displayName: "Available", color: "bg-green-500" },
    { label: "BUSY", displayName: "Busy", color: "bg-red-500" },
    {
      label: "BE_RIGHT_BACK",
      displayName: "Be right back",
      color: "bg-yellow-500",
    },
    { label: "APPEAR_AWAY", displayName: "Appear away", color: "bg-gray-400" },
  ];

  /* ================= FETCH AVAILABILITY ================= */
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const data = await getMyAvailability();

        if (data?.status) {
          setStatus(data.status);
        } else {
          // Auto-set AVAILABLE on first login
          await setAvailability("AVAILABLE");
          setStatus("AVAILABLE");
        }
      } catch (err) {
        console.log("Not authenticated or unable to fetch availability", err);
      }
    };

    fetchAvailability();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (newStatus) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in first to update your availability status.");
      return;
    }

    setLoading(true);
    try {
      await setAvailability(newStatus);
      setStatus(newStatus);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert(
        typeof error === "string"
          ? error
          : "Failed to update status. Make sure you are checked in."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = statuses.find((s) => s.label === status);

  /* ================= UI ================= */
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      <div className="text-sm font-normal text-gray-500">{today}</div>

      <div className="flex items-center space-x-4 relative">
        <div
          className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition duration-150"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="font-semibold text-gray-800 text-sm hidden sm:inline">
            {userName}
          </span>

          <div className="relative w-8 h-8 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold text-xs shadow-sm">
            {userInitials || "U"}
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                currentStatus?.color || "bg-gray-400"
              }`}
            />
          </div>
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
            {statuses.map((s) => (
              <button
                key={s.label}
                onClick={() => handleStatusChange(s.label)}
                disabled={loading}
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  status === s.label ? "bg-blue-50" : ""
                }`}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${s.color}`} />
                {s.displayName}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;