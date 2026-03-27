// frontend/src/pages/dashboard/DevDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import { Link } from "react-router-dom";
import {
  checkIn,
  getTodayAttendance,
  checkOut,
} from "../../services/attendanceService";
import { getMyDailyTasks } from "../../services/dailyTaskService";
import { useNavigate } from "react-router-dom";

const DevDashboard = () => {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskStats, setTaskStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    if (user) {
      fetchTodayAttendance();
      fetchRecentTasks();
    }
  }, [user]);

  const fetchTodayAttendance = async () => {
    const result = await getTodayAttendance();
    if (result.success) {
      setTodayAttendance(result.data.data);
    }
  };

  const fetchRecentTasks = async () => {
    try {
      setTasksLoading(true);
      const res = await getMyDailyTasks();
      if (res.data && res.data.data) {
        const fetchedTasks = res.data.data;
        setAllTasks(fetchedTasks);
        const stats = {
          pending: fetchedTasks.filter(
            (t) => t.status === "Not Started" || t.status === "Blocked",
          ).length,
          inProgress: fetchedTasks.filter((t) => t.status === "In Progress").length,
          completed: fetchedTasks.filter((t) => t.status === "Completed").length,
        };
        setTaskStats(stats);
      }
    } catch (error) {
      console.error("Failed to fetch recent tasks:", error);
    } finally {
      setTasksLoading(false);
    }
  };

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
        navigate("/dashboard/dev/daily-task-update");
      }, 100);
    } else {
      alert(result.error || "Failed to check out. Please try again.");
    }
    setLoading(false);
  };

  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  const isCheckedOut = todayAttendance?.checkInTime && todayAttendance?.checkOutTime;
  const notCheckedIn = !todayAttendance?.checkInTime;

  const displayedTasks = allTasks
    .filter(
      (t) =>
        searchQuery === "" ||
        t.task.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/60 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Developer Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome Developer{user?.email ? ` – ${user.email}` : ""}!
            </p>
          </div>
          <div className="flex items-center gap-4">
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
                <span>Checked Out</span>
              </div>
            )}
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span className="text-lg">🔔</span>
            </button>
          </div>
        </header>
        <div className="flex-1 flex px-8 py-6 gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <div className="bg-white rounded-3xl shadow-sm px-5 py-3 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-600 focus:outline-none"
                />
                <button className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DevKpiCard
                  label="Pending Tasks"
                  value={taskStats.pending}
                  subtitle={`+${Math.max(0, taskStats.pending - 0)} pending`}
                  accent="text-emerald-500"
                />
                <DevKpiCard
                  label="In Progress"
                  value={taskStats.inProgress}
                  subtitle={`${taskStats.inProgress} active`}
                  accent="text-emerald-500"
                />
                <DevKpiCard
                  label="Completed"
                  value={taskStats.completed}
                  subtitle={`${taskStats.completed} done`}
                />
              </div>
            </section>
            <section className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Recent Tasks</h2>
                <Link
                  to="/dashboard/dev/task-board"
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {tasksLoading ? (
                  <p className="text-sm text-gray-500 py-4">Loading tasks...</p>
                ) : displayedTasks.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">No tasks yet. Create one to get started!</p>
                ) : (
                  displayedTasks.map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{t.task}</p>
                        {t.project && (
                          <p className="text-xs text-gray-500 mt-1">Project: {t.project}</p>
                        )}
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
          <div className="w-80 flex flex-col gap-6">
            <CalendarCard />
            <QuickActionsCard navigate={navigate} pendingCount={taskStats.pending} />
          </div>
        </div>
      </main>
    </div>
  );
};

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
        isCompleted ? "bg-[#E6FFEC] text-[#1E9C4D]" : "bg-[#FFF3D6] text-[#D98A00]"
      }`}
    >
      {isCompleted ? "Completed" : "pending"}
    </span>
  );
};

const CalendarCard = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(null);
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  return (
    <section className="bg-white rounded-3xl shadow-sm p-5">
      <div className="mb-4 text-center">
        <p className="text-2xl font-semibold text-slate-900">{timeString}</p>
        <p className="text-xs text-gray-500">{monthNames[month]} {year}</p>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white"
          >
            {monthNames.map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white"
          >
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 text-gray-400 text-xs">
          <button onClick={handlePrevMonth} className="hover:text-gray-600">{"<"}</button>
          <button onClick={handleNextMonth} className="hover:text-gray-600">{">"}</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-[11px] text-center text-gray-400 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-[11px] text-center">
        {days.map((day, idx) => (
          <button
            key={idx}
            disabled={!day}
            onClick={() => day && setSelectedDate(day)}
            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center ${
              !day ? "text-gray-300 cursor-default" : day === (selectedDate || today) ? "bg-blue-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </section>
  );
};

const QuickActionsCard = ({ navigate, pendingCount }) => (
  <section className="bg-white rounded-3xl shadow-sm p-5 space-y-3">
    <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
    <button
      onClick={() => navigate("/dashboard/dev/daily-task-update")}
      className="w-full rounded-md bg-blue-600 text-white text-xs font-semibold py-2.5 hover:bg-blue-700"
    >
      Create Daily New Task
    </button>
    <button
      onClick={() => navigate("/dashboard/dev/daily-task-update")}
      className="w-full rounded-md bg-white border border-blue-600 text-blue-600 text-xs font-semibold py-2.5 hover:bg-blue-50"
    >
      Update Daily Task
    </button>
    <div className="mt-2 rounded-md bg-[#FFF5E5] border border-[#FFE0A3] px-3 py-2 text-[11px] text-[#B06000] flex items-center gap-2">
      <span>⚠️</span>
      <span>Pending Actions – {pendingCount} Tasks are pending.</span>
    </div>
  </section>
);

export default DevDashboard;