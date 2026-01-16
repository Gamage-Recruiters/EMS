import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

import {
  getAllDailyTasks,
  updatePMCheck,
  updateTLCheck,
} from "../../../services/dailyTaskService";

import StatusBadge from "../components/StatusBadge";
import PendingStats from "../components/PendingStats";
import ReviewFilters from "../components/ReviewFilters";
import ExportButtons from "../components/ExportButtons";

const isThisWeek = (date) => {
  const d = new Date(date);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (now.getDay() || 7) + 1);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return d >= monday && d <= friday;
};

export default function DailyTaskReviewPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    developer: "all",
    view: "week",
  });

  // ================= FETCH =================
  useEffect(() => {
    getAllDailyTasks()
      .then((res) => setTasks(res.data.data))
      .catch(() => toast.error("Failed to load tasks"));
  }, []);

  // ================= DEVELOPERS LIST =================
  const developers = useMemo(() => {
    const map = {};
    tasks.forEach((t) => (map[t.developer._id] = t.developer));
    return Object.values(map);
  }, [tasks]);

  // ================= FILTER LOGIC (UPDATED) =================
  const filtered = useMemo(() => {
    const term = filters.search.toLowerCase();

    return tasks.filter((t) => {
      // Week / All filter
      if (filters.view === "week" && !isThisWeek(t.date)) return false;

      // Developer dropdown filter
      if (filters.developer !== "all" && t.developer._id !== filters.developer)
        return false;

      // SEARCH: task + project + developer name
      if (filters.search) {
        const devFirst = t.developer.firstName.toLowerCase();
        const devLast = t.developer.lastName.toLowerCase();
        const devFull = `${devFirst} ${devLast}`;

        const matches =
          t.task.toLowerCase().includes(term) ||
          t.project.toLowerCase().includes(term) ||
          devFirst.includes(term) ||
          devLast.includes(term) ||
          devFull.includes(term);

        if (!matches) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  // ================= PM UPDATE =================
  const handlePM = (id, value) => {
    updatePMCheck(id, value).then(() => {
      toast.success("PM check updated");
      setTasks((ts) =>
        ts.map((t) => (t._id === id ? { ...t, pmCheck: value } : t))
      );
    });
  };

  // ================= TL UPDATE =================
  const handleTL = (id, value) => {
    updateTLCheck(id, value).then(() => {
      toast.success("TL check updated");
      setTasks((ts) =>
        ts.map((t) => (t._id === id ? { ...t, teamLeadCheck: value } : t))
      );
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Daily Task Review</h1>

      {/* ================= STATS ================= */}
      <PendingStats tasks={filtered} />

      {/* ================= FILTERS + EXPORT ================= */}
      <div className="flex justify-between items-center">
        <ReviewFilters
          developers={developers}
          filters={filters}
          setFilters={setFilters}
        />
        <ExportButtons tasks={filtered} />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded-xl shadow-sm max-h-[480px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Developer</th>
              <th className="px-3 py-2">Task</th>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">PM</th>
              <th className="px-3 py-2">TL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t._id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  {t.developer.firstName} {t.developer.lastName}
                </td>
                <td className="px-3 py-2">{t.task}</td>
                <td className="px-3 py-2">{t.project}</td>
                <td className="px-3 py-2">
                  <StatusBadge label={t.status} />
                </td>

                {/* PM CHECK */}
                <td className="px-3 py-2">
                  {user.role === "PM" ? (
                    <select
                      value={t.pmCheck}
                      onChange={(e) => handlePM(t._id, e.target.value)}
                      className="border rounded text-xs px-2 py-1"
                    >
                      <option>Pending</option>
                      <option>Done</option>
                      <option>Issue</option>
                      <option>Not Completed</option>
                    </select>
                  ) : (
                    <StatusBadge label={t.pmCheck} />
                  )}
                </td>

                {/* TL CHECK */}
                <td className="px-3 py-2">
                  {user.role === "TL" ? (
                    <select
                      value={t.teamLeadCheck}
                      onChange={(e) => handleTL(t._id, e.target.value)}
                      className="border rounded text-xs px-2 py-1"
                    >
                      <option>Pending</option>
                      <option>Done</option>
                      <option>Issue</option>
                      <option>Not Completed</option>
                    </select>
                  ) : (
                    <StatusBadge label={t.teamLeadCheck} />
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No matching tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
