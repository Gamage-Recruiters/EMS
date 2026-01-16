// frontend/src/pages/dashboard/TLDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import { Link } from "react-router-dom";

const TLDashboard = () => {
  const { user } = useAuth();

  const notifications = [
    {
      title: "3 Overdue Tasks",
      desc: "Project Alpha requires immediate attention.",
      time: "2h ago",
      type: "danger",
    },
    {
      title: "Schedule Conflict",
      desc: "Team Beta has overlapping meeting times.",
      time: "3h ago",
      type: "info",
    },
  ];

  const projects = [
    {
      name: "Project ATS",
      team: "Frontend Team • Due: Dec 1, 2025",
      percent: 78,
      status: "On Track",
      color: "bg-[#4F46E5]", // purple
    },
    {
      name: "Project Beta - Mobile App Redesign",
      team: "Mobile Team • Due: Jan 13, 2025",
      percent: 45,
      status: "At Risk",
      color: "bg-[#F59E0B]", // amber
    },
    {
      name: "Project Gamma - Backend API Migration",
      team: "Backend Team • Due: Dec 05, 2024",
      percent: 62,
      status: "Delayed",
      color: "bg-[#EF4444]", // red
    },
  ];

  const deadlines = [
    {
      day: "20",
      month: "DEC",
      task: "Backend API Migration Deadline",
      detail: "Project Gamma • 2 days remaining",
      bg: "bg-[#FFE4E6]",
    },
    {
      day: "28",
      month: "DEC",
      task: "E-Commerce Platform Launch",
      detail: "Project Alpha • 10 days remaining",
      bg: "bg-[#FEF3C7]",
    },
    {
      day: "05",
      month: "JAN",
      task: "Sprint Review Meeting",
      detail: "All Teams • Q1 Planning",
      bg: "bg-[#E0F2FE]",
    },
    {
      day: "15",
      month: "JAN",
      task: "Mobile App Redesign Completion",
      detail: "Project Beta • Final delivery",
      bg: "bg-[#DCFCE7]",
    },
  ];

  const meetings = [
    {
      day: "MON",
      title: "Daily Standup - Team SE",
      time: "09:00 AM - 09:30 AM",
      color: "bg-[#EEF2FF] text-[#4F46E5]",
    },
    {
      day: "TUE",
      title: "Sprint Planning - Project Beta",
      time: "10:30 AM - 11:30 AM",
      color: "bg-[#ECFDF3] text-[#16A34A]",
    },
    {
      day: "WED",
      title: "Code Review Session",
      time: "03:00 PM - 04:00 PM",
      color: "bg-[#F5F3FF] text-[#7C3AED]",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">
      {/* Left role-based sidebar */}
      <Sidebar />

      {/* Right main area */}
      <main className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              Welcome back, {user?.email ? user.email.split("@")[0] : "Team Lead"}. Here's your team
              status.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search box */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-56 rounded-full border border-gray-300 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1.5 text-gray-400 text-sm">
                🔍
              </span>
            </div>

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

        {/* Main content area */}
        <div className="flex-1 px-6 md:px-8 py-6 flex flex-col gap-6 overflow-y-auto">
          {/* KPI Row */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard
              icon="🧑‍💻"
              iconBg="bg-[#EEF2FF]"
              label="Active Developers"
              value="47"
              badge="+12% vs last week"
              badgeColor="text-green-600"
            />
            <KpiCard
              icon="👥"
              iconBg="bg-[#ECFDF3]"
              label="Active Teams"
              value="8"
              badge="Stable"
              badgeColor="text-emerald-600"
            />
            <KpiCard
              icon="⚠️"
              iconBg="bg-[#FEF3C7]"
              label="Pending Approvals"
              value="3"
              badge="Urgent"
              badgeColor="text-red-600"
            />
            <KpiCard
              icon="📅"
              iconBg="bg-[#EEF2FF]"
              label="Scheduled Meetings"
              value="12"
              badge="This Week"
              badgeColor="text-indigo-600"
            />
          </section>

          {/* Notifications + Quick Actions */}
          <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Notifications card */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Notifications
                </h2>
                <button className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n, i) => (
                  <NotificationItem key={i} notification={n} />
                ))}
              </div>
            </div>

            {/* Quick actions card */}
            <QuickActions />
          </section>

          {/* Project Progress Summary */}
          <section className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Project Progress Summary
              </h2>
              <button className="text-xs text-blue-600 font-medium hover:underline">
                All Projects
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((p, idx) => (
                <ProjectProgress key={idx} project={p} />
              ))}
            </div>
          </section>

          {/* Bottom row: Deadlines + Meetings */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingDeadlines deadlines={deadlines} />
            <MeetingsThisWeek meetings={meetings} />
          </section>
        </div>
      </main>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const KpiCard = ({ icon, iconBg, label, value, badge, badgeColor }) => (
  <div className="bg-white rounded-3xl shadow-sm px-5 py-4 flex flex-col gap-2">
    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center text-lg`}>
      {icon}
    </div>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
    <p className="text-2xl font-semibold text-slate-900 leading-tight">
      {value}
    </p>
    {badge && (
      <p className={`text-[11px] mt-1 ${badgeColor}`}>{badge}</p>
    )}
  </div>
);

const NotificationItem = ({ notification }) => {
  const base =
    notification.type === "danger"
      ? "bg-[#FFE4E6] border-[#FECDD3]"
      : "bg-[#DBEAFE] border-[#BFDBFE]";

  const iconBg =
    notification.type === "danger" ? "bg-[#F97373]" : "bg-[#3B82F6]";

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${base}`}>
      <div
        className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-white text-sm`}
      >
        {notification.type === "danger" ? "!" : "i"}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-900">
          {notification.title}
        </p>
        <p className="text-[11px] text-gray-600">{notification.desc}</p>
      </div>
      <p className="text-[10px] text-gray-500 whitespace-nowrap">
        {notification.time}
      </p>
    </div>
  );
};

const QuickActions = () => (
  <div className="bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] rounded-3xl shadow-sm p-6 text-white flex flex-col gap-4">
    <h2 className="text-sm font-semibold">Quick Actions</h2>

    <QuickActionButton label="Schedule Meeting" icon="🗓" />
    <QuickActionButton label="Post Special Notice" icon="📢" />
    <QuickActionButton label="Add Developer" icon="👨‍💻" />
  </div>
);

const QuickActionButton = ({ label, icon }) => (
  <button className="w-full bg-white text-blue-600 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-50">
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const ProjectProgress = ({ project }) => (
  <div className="rounded-2xl border border-gray-100 bg-[#F9FBFF] px-4 py-3">
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {project.name}
        </p>
        <p className="text-[11px] text-gray-500">{project.team}</p>
      </div>
      <span
        className={`text-[11px] px-2 py-1 rounded-full ${
          project.status === "On Track"
            ? "bg-green-100 text-green-700"
            : project.status === "At Risk"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {project.status}
      </span>
    </div>

    <div className="mt-2 w-full h-2 rounded-full bg-gray-200">
      <div
        className={`h-2 rounded-full ${project.color}`}
        style={{ width: `${project.percent}%` }}
      />
    </div>
  </div>
);

const UpcomingDeadlines = ({ deadlines }) => (
  <div className="bg-white rounded-3xl shadow-sm p-6">
    <h2 className="text-sm font-semibold text-slate-900 mb-3">
      Upcoming Deadlines
    </h2>
    <div className="space-y-3">
      {deadlines.map((d, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-4 rounded-2xl border border-gray-100 px-4 py-3 ${d.bg}`}
        >
          <div className="w-12 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {d.day}
            </p>
            <p className="text-[11px] text-gray-600">{d.month}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{d.task}</p>
            <p className="text-[11px] text-gray-600">{d.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MeetingsThisWeek = ({ meetings }) => (
  <div className="bg-white rounded-3xl shadow-sm p-6">
    <h2 className="text-sm font-semibold text-slate-900 mb-3">
      Meetings This Week
    </h2>
    <div className="space-y-3">
      {meetings.map((m, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 px-4 py-3 bg-[#F9FBFF]"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-semibold ${m.color}`}
          >
            {m.day}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{m.title}</p>
            <p className="text-[11px] text-gray-600">{m.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TLDashboard;
