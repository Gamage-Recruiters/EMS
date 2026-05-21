import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Calendar, Users, BarChart2, Loader2, AlertCircle } from "lucide-react";
import { getMonthlyAttendanceSummary } from "../services/attendanceService";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const AttendanceGraph = ({
  selectedYear: propsYear,
  setSelectedYear: propsSetYear,
  selectedEmployee: propsEmployee,
  setSelectedEmployee: propsSetEmployee
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState([]);
  
  // Filter States (Internal fallback if not controlled by parent props)
  const [internalYear, setInternalYear] = useState(new Date().getFullYear());
  const [internalEmployee, setInternalEmployee] = useState("all");

  const selectedYear = propsYear !== undefined ? propsYear : internalYear;
  const setSelectedYear = propsSetYear || setInternalYear;
  const selectedEmployee = propsEmployee !== undefined ? propsEmployee : internalEmployee;
  const setSelectedEmployee = propsSetEmployee || setInternalEmployee;
  
  // Dropdown Options
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const isCEO = user?.role === "CEO" || user?.role === "PM";
  const isTL = user?.role === "TL";
  const showEmployeeFilter = isCEO || isTL;

  // Available years
  const years = [2024, 2025, 2026, 2027, 2028];

  // Fetch dropdown list of employees for CEO / TL
  useEffect(() => {
    const fetchEmployeeOptions = async () => {
      if (!showEmployeeFilter) return;
      try {
        setOptionsLoading(true);
        if (isCEO) {
          // Fetch all active users from /api/user
          const res = await api.get("/user");
          if (Array.isArray(res.data)) {
            setEmployeeOptions(res.data);
          }
        } else if (isTL) {
          // Fetch teams led by this Team Lead from /api/team
          const res = await api.get("/team");
          if (res.data?.success && Array.isArray(res.data.data)) {
            // Find teams where teamLead matches current user's ID
            const myTeams = res.data.data.filter(
              (team) => team.teamLead?._id === user?._id || team.teamLead === user?._id
            );
            // Extract members
            const membersMap = new Map();
            myTeams.forEach((team) => {
              if (team.members) {
                team.members.forEach((m) => {
                  membersMap.set(m._id, m);
                });
              }
            });
            // Include Team Lead themselves as an option
            membersMap.set(user?._id, {
              _id: user?._id,
              firstName: user?.firstName || "Me",
              lastName: user?.lastName || "",
              role: user?.role
            });
            setEmployeeOptions(Array.from(membersMap.values()));
          }
        }
      } catch (err) {
        console.error("Error loading employee dropdown options:", err);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchEmployeeOptions();
  }, [user, isCEO, isTL, showEmployeeFilter]);

  // Fetch Monthly Summary Data based on filters
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pass selectedEmployee value only if a specific one is selected
        const empIdParam = selectedEmployee !== "all" ? selectedEmployee : "";
        const res = await getMonthlyAttendanceSummary(selectedYear, empIdParam);
        
        if (res.success) {
          const data = res.data.data || [];
          // Filter out months with no attendance records (all zero counts)
          const filteredData = data.filter(
            (item) => item.present > 0 || item.absent > 0 || item.late > 0 || item.leave > 0
          );
          setGraphData(filteredData);
        } else {
          setError(res.error || "Failed to load monthly attendance summary.");
        }
      } catch (err) {
        console.error("Error fetching monthly summary:", err);
        setError("An unexpected error occurred while fetching graph data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGraphData();
    }
  }, [user, selectedYear, selectedEmployee]);

  // Custom tool-tip matching modern premium glassmorphism styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/80 p-4 rounded-xl shadow-xl flex flex-col gap-2">
          <p className="font-bold text-gray-800 border-b border-gray-100 pb-1 mb-1 text-sm flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-500" />
            {label} {selectedYear}
          </p>
          <div className="space-y-1 text-xs">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-6 font-semibold">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}:
                </span>
                <span className="text-gray-900 font-bold">{entry.value} days</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6 mb-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Monthly Attendance Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Visual breakdown of attendance status trends over the selected year.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Dropdown */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 transition hover:border-gray-300">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent border-0 text-sm font-semibold text-gray-700 focus:ring-0 focus:outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Dropdown (CEO/TL Only) */}
          {showEmployeeFilter && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 transition hover:border-gray-300 min-w-[200px]">
              <Users className="w-4 h-4 text-gray-500" />
              {optionsLoading ? (
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading...
                </span>
              ) : (
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="bg-transparent border-0 text-sm font-semibold text-gray-700 focus:ring-0 focus:outline-none cursor-pointer w-full"
                >
                  <option value="all">
                    {isCEO ? "All Employees (Aggregated)" : "All Team Members (Aggregated)"}
                  </option>
                  {employeeOptions.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative min-h-[350px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl p-4 border border-slate-100">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Generating attendance summary graph...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-12 text-red-500 max-w-md text-center">
            <AlertCircle className="w-10 h-10" />
            <p className="text-base font-bold">Failed to load data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : graphData.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
            <BarChart2 className="w-12 h-12" />
            <p className="text-sm font-semibold">No attendance records found for this selection.</p>
          </div>
        ) : (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={graphData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  allowDecimals={false}
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}
                />
                
                {/* 4 Bars with premium curated vibrant colors */}
                <Bar 
                  dataKey="present" 
                  name="Present" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
                <Bar 
                  dataKey="late" 
                  name="Late" 
                  fill="#F59E0B" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
                <Bar 
                  dataKey="leave" 
                  name="On Leave" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
                <Bar 
                  dataKey="absent" 
                  name="Absent" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceGraph;
