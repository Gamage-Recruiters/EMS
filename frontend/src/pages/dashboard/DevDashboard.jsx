// frontend/src/pages/dashboard/DevDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import { Link } from "react-router-dom";
import { checkIn, getTodayAttendance, checkOut } from "../../services/attendanceService";
import { useNavigate } from "react-router-dom";

const DevDashboard = () => {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);


  const recentTasks = [
    {
      title: "EMS Wire frames",
      description: "Designs with figma",
      status: "pending",
    },
    {
      title: "Update wireframes in developer module",
      description: "daily task path",
      status: "pending",
    },
    {
      title:
        "Discuss team with better practices to more efficient EMS development",
      description: "",
      status: "completed",
    },
  ];

  useEffect(() => {
    if(user) {
      fetchTodayAttendance(); // if user is available fetch attendance
    }
  }, [user]);

  const fetchTodayAttendance = async () => {
    const result = await getTodayAttendance();
    if (result.success) {
      setTodayAttendance(result.data.data);
    }
  };
  // handle Check-In
  const handleCheckIn = async () => {
    setLoading(true);
    const result = await checkIn();
    if (result.success) {
      setTodayAttendance(result.data.data);
      alert("Successfully checked in!");
    } else {
      alert(result.error || "Failed to check in. Please try again.");
    }
    setLoading(false);
  };

 // handle Check-Out
  const handleCheckOut = async () => {
    setLoading(true);
    const result = await checkOut();
    if (result.success) {
      setTodayAttendance((prev) => ({
        ...prev,
        checkOutTime: result.data.data.checkOutTime,
      }));
      alert("Successfully checked out!");
      setTimeout(() => {
      navigate("/dashboard/dev/daily-task-update");  // navigate daily task update page
    }, 100);
    } else {
      alert(result.error || "Failed to check out. Please try again.");
    }
    setLoading(false);
  };

  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime; // user checked in but not yet checked out
  const isCheckedOut = todayAttendance?.checkInTime && todayAttendance?.checkOutTime; // user checked in and checked out
  const notCheckedIn = !todayAttendance?.checkInTime; // user has not checked in yet

  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">


      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/60 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Developer Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome Developer{user?.email ? ` – ${user.email}` : ""}!
            </p>
          </div>

           <div className="flex items-center gap-4">
            {/* Check-in/out button - Dynamic based on attendance status */}
            {notCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="rounded-md bg-green-600 text-white text-xs font-medium px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-green-700 transition disabled:opacity-50"
              >
                <span>✓</span>
                <span>{loading ? "Checking In..." : "Check In"}</span>
              </button>
            )}

            {isCheckedIn && (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="rounded-md bg-red-600 text-white text-xs font-medium px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-red-700 transition disabled:opacity-50"
              >
                <span>⏰</span>
                <span>{loading ? "Checking Out..." : "Check Out"}</span>
              </button>
            )}

            {isCheckedOut && (
              <div className="rounded-md bg-gray-200 text-gray-600 text-xs font-medium px-4 py-2 flex items-center gap-2">
                <span>✓</span>
                <span>checkin/checkout</span>
              </div>
            )}

            {/* Notification & avatar */}
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span className="text-lg">🔔</span>
            </button>
          </div>
        </header>

        {/* Content layout */}
        <div className="flex-1 flex px-8 py-6 gap-6">
          {/* Left main column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Search + KPI row */}
            <section className="flex flex-col gap-4">
              {/* Search bar */}
              <div className="bg-white rounded-3xl shadow-sm px-5 py-3 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search teams by name, lead, or department..."
                  className="flex-1 bg-transparent text-sm text-gray-600 focus:outline-none"
                />
                <button className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </button>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DevKpiCard
                  label="Pending Tasks"
                  value="12"
                  subtitle="+2 this month"
                  accent="text-emerald-500"
                />
                <DevKpiCard
                  label="In Progress"
                  value="48"
                  subtitle="+5 this month"
                  accent="text-emerald-500"
                />
                <DevKpiCard label="Completed" value="4" subtitle="" />
              </div>
            </section>

            {/* Recent tasks */}
            <section className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Recent Tasks
                </h2>
                <button className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {t.title}
                      </p>
                      {t.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column: calendar + quick actions */}
          <div className="w-80 flex flex-col gap-6">
            <CalendarCard />
            <QuickActionsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Sub-components --- */

const DevKpiCard = ({ label, value, subtitle, accent }) => (
  <div className="bg-white rounded-3xl shadow-sm px-5 py-6 flex flex-col justify-between">
    <div>
      <span className="text-3xl font-semibold text-slate-900">{value}</span>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
      {subtitle && (
        <p className={`mt-1 text-xs font-medium ${accent || "text-emerald-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isCompleted = status === "completed";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isCompleted
          ? "bg-[#E6FFEC] text-[#1E9C4D]"
          : "bg-[#FFF3D6] text-[#D98A00]"
      }`}
    >
      {isCompleted ? "Completed" : "pending"}
    </span>
  );
};

const CalendarCard = () => (
  <section className="bg-white rounded-3xl shadow-sm p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-2">
        <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white">
          <option>Sep</option>
        </select>
        <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white">
          <option>2025</option>
        </select>
      </div>
      <div className="flex gap-2 text-gray-400 text-xs">
        <button>{"<"}</button>
        <button>{">"}</button>
      </div>
    </div>

    <div className="grid grid-cols-7 text-[11px] text-center text-gray-400 mb-2">
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
        <span key={d}>{d}</span>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-y-1 text-[11px] text-center">
      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
        const isSelected = [9, 10, 11, 12, 13].includes(day);
        return (
          <button
            key={day}
            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center ${
              isSelected
                ? "bg-slate-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  </section>
);

const QuickActionsCard = () => (
  <section className="bg-white rounded-3xl shadow-sm p-5 space-y-3">
    <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>

    <button className="w-full rounded-md bg-blue-600 text-white text-xs font-semibold py-2.5 hover:bg-blue-700">
      Create Daily New Task
    </button>

    <button className="w-full rounded-md bg-white border border-blue-600 text-blue-600 text-xs font-semibold py-2.5 hover:bg-blue-50">
      Update Daily Task
    </button>

    <div className="mt-2 rounded-md bg-[#FFF5E5] border border-[#FFE0A3] px-3 py-2 text-[11px] text-[#B06000] flex items-center gap-2">
      <span>⚠️</span>
      <span>Pending Actions – 2 Tasks are pending.</span>
    </div>
  </section>
);

export default DevDashboard;
