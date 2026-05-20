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
import { projectService } from "../../services/projectService";

const CeoDashboard = () => {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [teams, setTeams] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [teamAvailability, setTeamAvailability] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [developerComplaints, setDeveloperComplaints] = useState([]);
  const [adminComplaints, setAdminComplaints] = useState([]);
  const [projects, setProjects] = useState([]);

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

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await projectService.list();
      setProjects(response?.data?.data || []);
    } catch (error) {
      console.error("CEO project fetch error:", error);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchProjects();
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const projectSummary = useMemo(() => {
    return projects.slice(0, 3).map((project) => ({
      id: project._id,
      title: project.projectName,
      project: project.endDate
        ? `Ends ${new Date(project.endDate).toLocaleDateString()}`
        : "No end date",
      status: project.status || "Active",
    }));
  }, [projects]);

  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => {
        const rawDate =
          meeting?.date || meeting?.meetingDate || meeting?.scheduledAt;
        if (!rawDate) return false;

        const status = String(
          meeting?.status || meeting?.meetingStatus || meeting?.state || "",
        ).toLowerCase();

        if (
          status.includes("cancel") ||
          status.includes("cancelled") ||
          status.includes("canceled")
        ) {
          return false;
        }

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
              onClick={() => {
                fetchDashboardData();
                fetchProjects();
              }}
              className="rounded-md bg-[#2563EB] text-white text-xs font-medium px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-[#1D4ED8] transition"
            >
              <span>↻</span>
              <span>
                {loading || projectsLoading ? "Refreshing..." : "Refresh"}
              </span>
            </button>

            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span className="text-lg">🔔</span>
            </button>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-8 py-6 flex flex-col gap-6 overflow-y-auto">
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

          <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Ongoing Projects
                </h2>
                <button
                  onClick={() => navigate("/dashboard/ceo/past-projects")}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View All Projects
                </button>
              </div>

              <div className="space-y-3">
                {projectsLoading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : projectSummary.length > 0 ? (
                  projectSummary.map((p) => (
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
                      <ProjectStatusBadge status={p.status} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No project data found</p>
                )}
              </div>
            </div>

            <QuickActions
              onNavigate={navigate}
              links={{
                meeting: "/dashboard/meetings/create",
                complaints: "/dashboard/complaints/review",
                employees: "/dashboard/employees",
              }}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalendarCard 
              meetings={meetings} 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
            />
            <EventsPanel
              meetings={meetings}
              loading={loading}
              availableCount={availableCount}
              selectedDate={selectedDate}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

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

const ProjectStatusBadge = ({ status }) => {
  const normalized = String(status).toLowerCase();

  if (normalized === "completed") {
    return (
      <span className="text-[11px] px-2 py-1 rounded-full bg-green-100 text-green-700">
        Completed
      </span>
    );
  }

  if (normalized === "on hold") {
    return (
      <span className="text-[11px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
        On Hold
      </span>
    );
  }

  if (normalized === "cancelled") {
    return (
      <span className="text-[11px] px-2 py-1 rounded-full bg-red-100 text-red-700">
        Cancelled
      </span>
    );
  }

  return (
    <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
      Active
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

const HOLIDAYS = {
  "0-1": "New Year's Day",
  "0-14": "Tamil Thai Pongal Day",
  "1-4": "Independence Day",
  "3-13": "Sinhala & Tamil New Year's Eve",
  "3-14": "Sinhala & Tamil New Year's Day",
  "4-1": "May Day",
  "11-25": "Christmas Day"
};

const CalendarCard = ({ meetings = [], selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));

  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentMonth(new Date(year, monthIndex - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, monthIndex + 1, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(today);
  };

  const daysWithMeetings = useMemo(() => {
    const days = new Set();
    meetings.forEach((m) => {
      const rawDate = m?.date || m?.meetingDate || m?.scheduledAt;
      if (rawDate) {
        const d = new Date(rawDate);
        if (d.getFullYear() === year && d.getMonth() === monthIndex) {
          days.add(d.getDate());
        }
      }
    });
    return days;
  }, [meetings, year, monthIndex]);

  // holidays are defined globally now

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  return (
    <section className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-slate-900">Calendar</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth} 
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
          >
            &lt;
          </button>
          <div className="text-xs font-semibold w-28 text-center text-slate-800">
            {monthName} {year}
          </div>
          <button 
            onClick={handleNextMonth} 
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
          >
            &gt;
          </button>
          <button 
            onClick={handleToday}
            className="ml-2 text-[10px] uppercase tracking-wider font-bold text-blue-600 hover:text-blue-800 transition"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[11px] font-medium text-center text-gray-400 mb-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3 text-[12px] text-center flex-1">
        {calendarCells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;

          const isSelected = selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === monthIndex && 
            selectedDate.getFullYear() === year;
          
          const today = new Date();
          const isToday = today.getDate() === day && 
            today.getMonth() === monthIndex && 
            today.getFullYear() === year;

          const hasMeeting = daysWithMeetings.has(day);
          const holidayName = HOLIDAYS[`${monthIndex}-${day}`];

          return (
            <div key={day} className="flex flex-col items-center justify-center relative">
              <button
                onClick={() => onSelectDate(new Date(year, monthIndex, day))}
                title={holidayName || (hasMeeting ? "Has events" : "")}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#2563EB] text-white font-semibold shadow-md shadow-blue-200 scale-110"
                    : holidayName
                    ? "bg-[#FEF2F2] text-[#DC2626] font-bold border border-[#FCA5A5]"
                    : isToday
                    ? "bg-slate-100 text-blue-600 font-bold"
                    : "text-slate-700 hover:bg-gray-50 hover:scale-110"
                }`}
              >
                {day}
              </button>
              
              {/* Event Indicator */}
              {hasMeeting && (
                <span className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-white" : "bg-[#4F46E5] border border-white"
                }`} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
          Events
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Holidays
        </div>
      </div>
    </section>
  );
};

const EventsPanel = ({ meetings = [], loading, availableCount, selectedDate }) => {
  const selectedDateEvents = useMemo(() => {
    const events = meetings.filter((meeting) => {
      const rawDate = meeting?.date || meeting?.meetingDate || meeting?.scheduledAt;
      if (!rawDate) return false;
      const mDate = new Date(rawDate);
      return (
        mDate.getFullYear() === selectedDate.getFullYear() &&
        mDate.getMonth() === selectedDate.getMonth() &&
        mDate.getDate() === selectedDate.getDate()
      );
    });

    const holidayName = HOLIDAYS[`${selectedDate.getMonth()}-${selectedDate.getDate()}`];
    if (holidayName) {
      events.unshift({
        _id: `holiday-${selectedDate.getTime()}`,
        title: holidayName,
        description: "Public Holiday",
        isHoliday: true
      });
    }

    return events;
  }, [meetings, selectedDate]);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-full">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">
        Events for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </h2>

      <div className="mb-5 rounded-2xl bg-[#F9FBFF] px-4 py-3 flex items-center justify-between border border-blue-50">
        <div>
          <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wide">Team Availability</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {loading ? "..." : availableCount}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
          👥
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {loading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading events...</p>
        ) : selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((meeting, index) => {
            if (meeting.isHoliday) {
              return (
                <div
                  key={meeting._id}
                  className="flex items-start gap-3 rounded-2xl border border-[#FCA5A5] px-4 py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-[20px] bg-white text-[#DC2626] shrink-0 border border-[#FECACA] shadow-sm">
                    🎉
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-sm font-bold text-[#991B1B] truncate">
                      {meeting.title}
                    </p>
                    <p className="text-[11px] font-medium text-[#DC2626] mt-1">
                      {meeting.description}
                    </p>
                  </div>
                </div>
              );
            }

            const rawDate = meeting?.date || meeting?.meetingDate || meeting?.scheduledAt;
            const mDate = rawDate ? new Date(rawDate) : null;
            const time = mDate ? mDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "All day";

            return (
              <div
                key={meeting?._id || index}
                className="flex items-start gap-3 rounded-2xl border border-gray-100 px-4 py-3 bg-white hover:bg-[#F9FBFF] transition-colors shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-[11px] font-semibold bg-[#EEF2FF] text-[#4F46E5] shrink-0 border border-indigo-50">
                  <span className="text-xs">{time.split(' ')[0]}</span>
                  <span className="text-[9px] opacity-70">{time.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {meeting?.title || meeting?.topic || "Scheduled Meeting"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {meeting?.description || meeting?.agenda || "No additional details provided."}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl mb-2 grayscale opacity-50">📅</span>
            <p className="text-xs font-medium text-gray-500">No events scheduled</p>
            <p className="text-[10px] text-gray-400 mt-1">Select a different date to view past or upcoming events.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CeoDashboard;
