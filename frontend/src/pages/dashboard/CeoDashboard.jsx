import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import { getAllAttendance } from "../../services/attendanceService";
import { getTeamAvailability } from "../../services/availabilityService";
import {
  getDeveloperComplaints,
  getAdminComplaints,
} from "../../services/complaintService";
import { getAllMeetings } from "../../services/meetingService";
import { teamService } from "../../services/teamService";

const CeoDashboard = () => {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [teams, setTeams] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [teamAvailability, setTeamAvailability] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [developerComplaints, setDeveloperComplaints] = useState([]);
  const [adminComplaints, setAdminComplaints] = useState([]);

  const normalizeArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.teams)) return payload.teams;
    if (Array.isArray(payload?.attendance)) return payload.attendance;
    if (Array.isArray(payload?.meetings)) return payload.meetings;
    if (Array.isArray(payload?.complaints)) return payload.complaints;
    if (Array.isArray(payload?.records)) return payload.records;
    return [];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        teamService.list(),
        getAllAttendance(),
        getTeamAvailability(),
        getAllMeetings(),
        getDeveloperComplaints(),
        getAdminComplaints(),
      ]);

      if (results[0].status === "fulfilled") {
        setTeams(normalizeArray(results[0].value?.data));
      } else {
        setTeams([]);
      }

      if (
        results[1].status === "fulfilled" &&
        results[1].value?.success === true
      ) {
        setAttendance(normalizeArray(results[1].value?.data));
      } else {
        setAttendance([]);
      }

      if (results[2].status === "fulfilled") {
        setTeamAvailability(normalizeArray(results[2].value));
      } else {
        setTeamAvailability([]);
      }

      if (results[3].status === "fulfilled") {
        setMeetings(normalizeArray(results[3].value?.data));
      } else {
        setMeetings([]);
      }

      if (results[4].status === "fulfilled") {
        setDeveloperComplaints(normalizeArray(results[4].value?.data));
      } else {
        setDeveloperComplaints([]);
      }

      if (results[5].status === "fulfilled") {
        setAdminComplaints(normalizeArray(results[5].value?.data));
      } else {
        setAdminComplaints([]);
      }
    } catch (error) {
      console.error("CEO dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const now = new Date();

  const todayAttendanceCount = useMemo(() => {
    return attendance.filter((item) => {
      const rawDate =
        item?.date || item?.checkIn || item?.createdAt || item?.updatedAt;
      if (!rawDate) return false;

      const d = new Date(rawDate);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [attendance, now]);

  const availableCount = useMemo(() => {
    return teamAvailability.filter(
      (item) => String(item?.status || "").toUpperCase() === "AVAILABLE",
    ).length;
  }, [teamAvailability]);

  const totalComplaints = useMemo(() => {
    return developerComplaints.length + adminComplaints.length;
  }, [developerComplaints, adminComplaints]);

  const ongoingProjects = useMemo(() => {
    return teams.slice(0, 5).map((team, index) => ({
      id: team?._id || index,
      title: team?.name || team?.teamName || `Team ${index + 1}`,
      project: `${Array.isArray(team?.members) ? team.members.length : 0} Members`,
      status:
        Array.isArray(team?.members) && team.members.length > 0
          ? "completed"
          : "pending",
    }));
  }, [teams]);

  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => {
        const rawDate =
          meeting?.date || meeting?.meetingDate || meeting?.scheduledAt;
        if (!rawDate) return false;

        const status = String(
          meeting?.status || meeting?.meetingStatus || meeting?.state || "",
        ).toLowerCase();

        // remove cancelled meetings
        if (
          status.includes("cancel") ||
          status.includes("cancelled") ||
          status.includes("canceled")
        ) {
          return false;
        }

        // only future or today meetings
        return new Date(rawDate) >= new Date();
      })
      .sort((a, b) => {
        const aDate = new Date(
          a?.date || a?.meetingDate || a?.scheduledAt || 0,
        );
        const bDate = new Date(
          b?.date || b?.meetingDate || b?.scheduledAt || 0,
        );
        return aDate - bDate;
      })
      .slice(0, 4);
  }, [meetings]);

  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">
      <main className="flex-1 flex flex-col">
        {/* Top header - TL style */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-900">
              CEO Dashboard Overview
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              Welcome back,{" "}
              {user?.email
                ? user.email.split("@")[0]
                : user?.firstName || "CEO"}
              . Here's your company status.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchDashboardData}
              className="rounded-md bg-[#2563EB] text-white text-xs font-medium px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-[#1D4ED8] transition"
            >
              <span>↻</span>
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span className="text-lg">🔔</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 px-6 md:px-8 py-6 flex flex-col gap-6 overflow-y-auto">
          {/* KPI cards - TL theme */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard
              icon="👥"
              iconBg="bg-[#EEF2FF]"
              label="Teams"
              value={loading ? "..." : teams.length}
              badge="Organization Units"
              badgeColor="text-indigo-600"
            />
            <KpiCard
              icon="✅"
              iconBg="bg-[#ECFDF3]"
              label="Today Attendance"
              value={loading ? "..." : todayAttendanceCount}
              badge="Checked today"
              badgeColor="text-emerald-600"
            />
            <KpiCard
              icon="🟢"
              iconBg="bg-[#DCFCE7]"
              label="Available Members"
              value={loading ? "..." : availableCount}
              badge="Live team status"
              badgeColor="text-green-600"
            />
            <KpiCard
              icon="⚠️"
              iconBg="bg-[#FEF3C7]"
              label="Complaints"
              value={loading ? "..." : totalComplaints}
              badge="Needs attention"
              badgeColor="text-amber-600"
            />
          </section>

          {/* Middle row */}
          <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Ongoing Projects */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Ongoing Projects
                </h2>
                <button className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : ongoingProjects.length > 0 ? (
                  ongoingProjects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F9FBFF] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {p.project}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No team/project data found
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions - TL style */}
            <QuickActions
              onNavigate={navigate}
              links={{
                meeting: "/dashboard/meetings/create",
                complaints: "/dashboard/complaints/review",
                employees: "/dashboard/employees",
              }}
            />
          </section>

          {/* Bottom row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalendarCard />
            <UpcomingMeetings
              meetings={upcomingMeetings}
              loading={loading}
              availableCount={availableCount}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const KpiCard = ({ icon, iconBg, label, value, badge, badgeColor }) => (
  <div className="bg-white rounded-3xl shadow-sm px-5 py-4 flex flex-col gap-2">
    <div
      className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center text-lg`}
    >
      {icon}
    </div>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
    <p className="text-2xl font-semibold text-slate-900 leading-tight">
      {value}
    </p>
    {badge && <p className={`text-[11px] mt-1 ${badgeColor}`}>{badge}</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const normalized = String(status).toLowerCase();

  return (
    <span
      className={`text-[11px] px-2 py-1 rounded-full ${
        normalized === "completed" || normalized === "resolved"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {normalized === "completed" || normalized === "resolved"
        ? "Completed"
        : "Pending"}
    </span>
  );
};

const QuickActions = ({ onNavigate, links }) => (
  <div className="bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] rounded-3xl shadow-sm p-6 text-white flex flex-col gap-4">
    <h2 className="text-sm font-semibold">Quick Actions</h2>

    <QuickActionButton
      label="Schedule Meeting"
      icon="🗓"
      onClick={() => onNavigate(links.meeting)}
    />
    <QuickActionButton
      label="Review Complaints"
      icon="📢"
      onClick={() => onNavigate(links.complaints)}
    />
    <QuickActionButton
      label="Manage Employees"
      icon="👨‍💼"
      onClick={() => onNavigate(links.employees)}
    />
  </div>
);

const QuickActionButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white text-blue-600 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-50"
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const CalendarCard = () => {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const today = currentDate.getDate();

  const monthName = currentDate.toLocaleString("default", { month: "short" });

  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const calendarCells = [];

  // empty cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }

  // actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <section className="bg-white rounded-3xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <select
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white"
            value={monthName}
            readOnly
          >
            <option>{monthName}</option>
          </select>
          <select
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white"
            value={year}
            readOnly
          >
            <option>{year}</option>
          </select>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          {currentDate.toLocaleDateString("en-CA")} •{" "}
          {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
        </div>
      </div>

      <div className="grid grid-cols-7 text-[11px] text-center text-gray-400 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-[11px] text-center">
        {calendarCells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="w-7 h-7 mx-auto" />;
          }

          const isSelected = day === today;

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
};

const UpcomingMeetings = ({ meetings, loading, availableCount }) => (
  <div className="bg-white rounded-3xl shadow-sm p-6">
    <h2 className="text-sm font-semibold text-slate-900 mb-3">
      Upcoming Meetings
    </h2>

    <div className="mb-4 rounded-2xl bg-[#F9FBFF] px-4 py-3">
      <p className="text-xs text-gray-500">Available team members</p>
      <p className="text-xl font-semibold text-slate-900 mt-1">
        {loading ? "..." : availableCount}
      </p>
    </div>

    <div className="space-y-3">
      {loading ? (
        <p className="text-sm text-gray-500">Loading meetings...</p>
      ) : meetings.length > 0 ? (
        meetings.map((meeting, index) => {
          const rawDate =
            meeting?.date || meeting?.meetingDate || meeting?.scheduledAt;

          const meetingDate = rawDate ? new Date(rawDate) : null;

          const weekday = meetingDate
            ? meetingDate.toLocaleDateString("en-US", { weekday: "short" })
            : "--";

          const formattedDate = meetingDate
            ? meetingDate.toLocaleDateString()
            : "No date";

          return (
            <div
              key={meeting?._id || index}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 px-4 py-3 bg-[#F9FBFF]"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-semibold bg-[#EEF2FF] text-[#4F46E5]">
                {weekday}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {meeting?.title || meeting?.topic || "Meeting"}
                </p>
                <p className="text-[11px] text-gray-600">{formattedDate}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">No upcoming meetings</p>
      )}
    </div>
  </div>
);

export default CeoDashboard;
