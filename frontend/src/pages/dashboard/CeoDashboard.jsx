// frontend/src/pages/dashboard/CeoDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import { Link } from "react-router-dom";

const CeoDashboard = () => {
  const { user } = useAuth() || {};

  const ongoingProjects = [
    {
      title: "EMS Wireframes Designs with Figma",
      project: "EMS Project",
      status: "pending",
    },
    {
      title: "Update wireframes in developer module",
      project: "EMS Project",
      status: "pending",
    },
    {
      title: "Discuss team with better practices to more efficient",
      project: "ATS Project",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">
      {/* Shared role-based sidebar */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/60 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              CEO Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome {user?.role === "CEO" ? "CEO" : user?.email || "back"}!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            {/* Avatar placeholder */}
            <Link
              to="/profile/personal"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-semibold text-white hover:opacity-90"
            >
              {user?.email ? user.email[0].toUpperCase() : "C"}
            </Link>
          </div>
        </header>

        {/* Content layout */}
        <div className="flex-1 flex px-8 py-6 gap-6">
          {/* Left main column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard label="Teams" value="12" />
              <KpiCard label="Attendance" value="85%" />
              <KpiCard label="Tasks" value="14" />
            </div>

            {/* Ongoing projects */}
            <section className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Ongoing Projects
                </h2>
                <button className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {ongoingProjects.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {p.project}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column: calendar + meetings */}
          <div className="w-80 flex flex-col gap-6">
            <CalendarCard />
            <UpcomingMeetings />
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Sub-components for CEO dashboard --- */

const KpiCard = ({ label, value }) => (
  <div className="bg-white rounded-3xl shadow-sm px-5 py-6 flex flex-col justify-between">
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-semibold text-slate-900">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
    <button className="mt-4 text-xs text-blue-600 font-medium hover:underline self-start">
      View
    </button>
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

    {/* Simple static calendar */}
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

const UpcomingMeetings = () => (
  <section className="bg-white rounded-3xl shadow-sm p-5">
    <h2 className="text-sm font-semibold text-slate-900 mb-3">
      Upcoming meetings
    </h2>
    <ul className="space-y-2 text-xs">
      <li className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span>Weekly meeting - Dec 12</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span>Team meeting - Dec 8</span>
      </li>
    </ul>
  </section>
);

export default CeoDashboard;
