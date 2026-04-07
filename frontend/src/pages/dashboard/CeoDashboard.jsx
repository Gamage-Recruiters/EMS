import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

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

      // Teams
      if (results[0].status === "fulfilled") {
        setTeams(normalizeArray(results[0].value?.data));
      }

      // Attendance
      if (
        results[1].status === "fulfilled" &&
        results[1].value?.success === true
      ) {
        setAttendance(normalizeArray(results[1].value?.data));
      }

      // Availability
      if (results[2].status === "fulfilled") {
        setTeamAvailability(normalizeArray(results[2].value));
      }

      // Meetings
      if (results[3].status === "fulfilled") {
        setMeetings(normalizeArray(results[3].value?.data));
      }

      // Developer complaints
      if (results[4].status === "fulfilled") {
        setDeveloperComplaints(normalizeArray(results[4].value?.data));
      }

      // Admin complaints
      if (results[5].status === "fulfilled") {
        setAdminComplaints(normalizeArray(results[5].value?.data));
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

  const today = new Date();

  const todayAttendanceCount = useMemo(() => {
    return attendance.filter((item) => {
      const rawDate =
        item?.date || item?.checkIn || item?.createdAt || item?.updatedAt;
      if (!rawDate) return false;

      const d = new Date(rawDate);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [attendance]);

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
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/60 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              CEO Dashboard
            </h1>
            <p className="text-sm text-gray-500 pt-1">
              Welcome {user?.firstName || "User"}!
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="text-xs bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition"
          >
            Refresh
          </button>
        </header>

        {/* Content layout */}
        <div className="flex-1 flex px-8 py-6 gap-6">
          {/* Left main column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard label="Teams" value={loading ? "..." : teams.length} />
              <KpiCard
                label="Attendance"
                value={loading ? "..." : todayAttendanceCount}
              />
              <KpiCard
                label="Tasks / Complaints"
                value={loading ? "..." : totalComplaints}
              />
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
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : ongoingProjects.length > 0 ? (
                  ongoingProjects.map((p) => (
                    <div
                      key={p.id}
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No team/project data found
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="w-80 flex flex-col gap-6">
            <CalendarCard />
            <UpcomingMeetings
              meetings={upcomingMeetings}
              loading={loading}
              availableCount={availableCount}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Sub-components --- */

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
  const normalized = String(status).toLowerCase();
  const isCompleted =
    normalized === "completed" ||
    normalized === "available" ||
    normalized === "resolved";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isCompleted
          ? "bg-[#E6FFEC] text-[#1E9C4D]"
          : "bg-[#FFF3D6] text-[#D98A00]"
      }`}
    >
      {isCompleted ? "Completed" : "Pending"}
    </span>
  );
};

const CalendarCard = () => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "short" });
  const year = now.getFullYear();
  const today = now.getDate();

  return (
    <section className="bg-white rounded-3xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <select
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white"
            value={month}
            readOnly
          >
            <option>{month}</option>
          </select>
          <select
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white"
            value={year}
            readOnly
          >
            <option>{year}</option>
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
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
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
  <section className="bg-white rounded-3xl shadow-sm p-5">
    <h2 className="text-sm font-semibold text-slate-900 mb-3">
      Upcoming meetings
    </h2>

    <div className="mb-4 rounded-2xl bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-500">Available team members</p>
      <p className="text-xl font-semibold text-slate-900 mt-1">
        {loading ? "..." : availableCount}
      </p>
    </div>

    <ul className="space-y-2 text-xs">
      {loading ? (
        <li className="text-gray-500">Loading meetings...</li>
      ) : meetings.length > 0 ? (
        meetings.map((meeting, index) => {
          const meetingDate =
            meeting?.date || meeting?.meetingDate || meeting?.scheduledAt;

          return (
            <li key={meeting?._id || index} className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
              <div>
                <p className="text-slate-700 font-medium">
                  {meeting?.title || meeting?.topic || "Meeting"}
                </p>
                <p className="text-gray-500">
                  {meetingDate
                    ? new Date(meetingDate).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
            </li>
          );
        })
      ) : (
        <li className="text-gray-500">No upcoming meetings</li>
      )}
    </ul>
  </section>
);

export default CeoDashboard;
