import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiTrash2, FiFilter, FiCalendar, FiList } from "react-icons/fi";

import StatusBadge from "../components/StatusBadge";
import {
  getMyDailyTasks,
  deleteDailyTask,
} from "../../../services/dailyTaskService";

// ================= DATE HELPERS =================
const isInCurrentWeek = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();

  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  return date >= monday && date <= friday;
};

function DailyTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState("week"); // week | all

  // ================= FETCH =================
  const fetchTasks = async () => {
    try {
      const res = await getMyDailyTasks();
      setTasks(res.data.data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (view === "week" && !isInCurrentWeek(task.date)) {
          return false;
        }

        const matchesSearch =
          !term ||
          task.task.toLowerCase().includes(term) ||
          task.project.toLowerCase().includes(term);

        const matchesStatus = status === "all" || task.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tasks, search, status, view]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteDailyTask(id);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading…</div>;
  }

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="px-6 py-8 space-y-6">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Summary
            </p>
            <h1 className="text-3xl font-semibold">Weekly Work Summary</h1>
            <p className="text-slate-600 text-sm mt-1">
              Default view shows Monday–Friday tasks
            </p>
          </div>

          <Link
            to="/tasks/new"
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Daily Task
          </Link>
        </header>

        {/* ================= FILTER BAR ================= */}
        <section className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <FiFilter className="text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search task or project"
                className="rounded-lg border px-3 py-2 text-sm w-64"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Blocked</option>
                <option>Completed</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("week")}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm border ${
                  view === "week"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700"
                }`}
              >
                <FiCalendar /> This Week
              </button>

              <button
                onClick={() => setView("all")}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm border ${
                  view === "all"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700"
                }`}
              >
                <FiList /> All
              </button>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="relative max-h-[420px] overflow-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 z-10">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Task</th>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Start</th>
                  <th className="px-3 py-2">End</th>
                  <th className="px-3 py-2">Hours</th>
                  <th className="px-3 py-2">PM</th>
                  <th className="px-3 py-2">TL</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((task, idx) => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">
                      {new Date(task.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-medium">{task.task}</td>
                    <td className="px-3 py-2">{task.project}</td>
                    <td className="px-3 py-2">
                      <StatusBadge label={task.status} />
                    </td>
                    <td className="px-3 py-2">{task.startTime}</td>
                    <td className="px-3 py-2">{task.endTime}</td>
                    <td className="px-3 py-2">{task.workingHours}</td>
                    <td className="px-3 py-2">
                      <StatusBadge label={task.pmCheck} />
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge label={task.teamLeadCheck} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete task"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="11"
                      className="text-center py-8 text-slate-500"
                    >
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DailyTaskPage;
