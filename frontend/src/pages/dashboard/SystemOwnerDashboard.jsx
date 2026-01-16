// frontend/src/pages/dashboard/SystemOwnerDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import { Link } from "react-router-dom";

const SystemOwnerDashboard = () => {
  const { user } = useAuth() || {};

  const teams = [
    {
      name: "Frontend Team Alpha",
      lead: "Sarah Johnson",
      members: 6,
      status: "active",
    },
    {
      name: "Backend Core",
      lead: "Michael Chen",
      members: 8,
      status: "active",
    },
    {
      name: "Mobile Development",
      lead: "Unassigned",
      members: 4,
      status: "pending",
    },
    {
      name: "DevOps Squad",
      lead: "Alex Kumar",
      members: 5,
      status: "active",
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
              System Owner Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage teams, assign leads, and oversee development operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span className="text-lg">🔔</span>
            </button>
            <div className="flex items-center gap-2">
              <Link
                to="/profile/personal"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-semibold text-white hover:opacity-90"
              >
                {user?.email ? user.email[0].toUpperCase() : "C"}
              </Link>
              <div className="hidden md:block text-xs">
                <p className="font-medium text-slate-800">
                  {user?.email || "John"}
                </p>
                <p className="text-gray-400">System Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 px-8 py-6 flex flex-col gap-6">
          {/* Top row: KPI cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard
              icon="👥"
              label="Total Teams"
              value="12"
              change="+2 this month"
            />
            <KpiCard
              icon="🧑‍💻"
              label="Total Developers"
              value="48"
              change="+5 this month"
            />
            <KpiCard
              icon="📈"
              label="Active Projects"
              value="23"
              change="+3 this week"
            />
            <KpiCard
              icon="⚠️"
              label="Pending Assignments"
              value="4"
              change="Needs attention"
              changeColor="text-emerald-500"
            />
          </section>

          {/* Middle row: Recent teams + Quick actions */}
          <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Recent Teams */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Recent Teams
                </h2>
                <button className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {teams.map((team, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-100 bg-[#F9FBFF] px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {team.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Lead: {team.lead} • {team.members} members
                      </p>
                    </div>
                    <TeamStatusBadge status={team.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </section>

          {/* Bottom row: Performance overview */}
          <section className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Team Performance Overview
            </h2>
            <div className="mt-4 h-56 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
              Chart visualization would go here
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

/* --- Sub components --- */

const KpiCard = ({ icon, label, value, change, changeColor }) => (
  <div className="bg-white rounded-3xl shadow-sm px-5 py-5 flex flex-col gap-2">
    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center text-lg">
      {icon}
    </div>
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-2xl font-semibold text-slate-900">{value}</span>
    {change && (
      <span
        className={`text-xs font-medium ${
          changeColor || "text-emerald-500"
        }`}
      >
        {change}
      </span>
    )}
  </div>
);

const TeamStatusBadge = ({ status }) => {
  if (status === "active") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6FFEC] text-[#1E9C4D]">
        active
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFF3D6] text-[#D98A00]">
      pending
    </span>
  );
};

const QuickActions = () => (
  <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-3">
    <h2 className="text-sm font-semibold text-slate-900 mb-1">
      Quick Actions
    </h2>

    <button className="w-full rounded-md bg-blue-600 text-white text-xs font-semibold py-2.5 hover:bg-blue-700 flex items-center justify-center gap-2">
      <span>🔗</span>
      <span>Create New Team</span>
    </button>

    <button className="w-full rounded-md bg-white border border-blue-600 text-blue-600 text-xs font-semibold py-2.5 hover:bg-blue-50 flex items-center justify-center gap-2">
      <span>👤</span>
      <span>Add Developer</span>
    </button>

    <button className="w-full rounded-md bg-white border border-blue-600 text-blue-600 text-xs font-semibold py-2.5 hover:bg-blue-50 flex items-center justify-center gap-2">
      <span>🧑‍💼</span>
      <span>Assign Team Lead</span>
    </button>

    <div className="mt-2 rounded-md bg-[#FFF5E5] border border-[#FFE0A3] px-3 py-2 text-[11px] text-[#B06000] flex items-center gap-2">
      <span>⚠️</span>
      <span>Pending Actions – 3 teams need team leads assigned.</span>
    </div>
  </div>
);

export default SystemOwnerDashboard;
