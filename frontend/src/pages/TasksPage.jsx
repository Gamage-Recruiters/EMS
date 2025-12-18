import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import { dailyTasks } from "../data/dailyTasks.js";


function WeeklyWorkSummary() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return dailyTasks.filter((task) => {
      const matchesSearch =
        !term ||
        task.task.toLowerCase().includes(term) ||
        task.project.toLowerCase().includes(term);
      const matchesStatus = status === "all" || task.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="px-6 py-8 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Summary</p>
            <h1 className="text-3xl font-semibold">Weekly Work Summary</h1>
            <p className="text-slate-600 text-sm mt-1">
              View your daily work logs for the week. Filter by status or search by task/project.
            </p>
          </div>
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Daily Task
          </Link>
        </header>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search task or project"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-3 py-2 font-semibold">#</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Task</th>
                  <th className="px-3 py-2 font-semibold">Project</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Start</th>
                  <th className="px-3 py-2 font-semibold">End</th>
                  <th className="px-3 py-2 font-semibold">Hours</th>
                  <th className="px-3 py-2 font-semibold">Faced Issues</th>
                  <th className="px-3 py-2 font-semibold">Learnings</th>
                  <th className="px-3 py-2 font-semibold">PM Check</th>
                  <th className="px-3 py-2 font-semibold">Team Lead Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((task, idx) => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-3 text-slate-700 text-sm">{task.date}</td>
                    <td className="px-3 py-3 font-medium">{task.task}</td>
                    <td className="px-3 py-3 text-slate-700">{task.project}</td>
                    <td className="px-3 py-3">
                      <StatusBadge label={task.status} />
                    </td>
                    <td className="px-3 py-3 text-slate-700 text-sm">{task.startTime}</td>
                    <td className="px-3 py-3 text-slate-700 text-sm">{task.endTime}</td>
                    <td className="px-3 py-3 text-slate-700 text-sm">{task.workingHours}</td>
                    <td className="px-3 py-3 text-slate-700 text-xs max-w-xs truncate" title={task.facedIssues}>{task.facedIssues}</td>
                    <td className="px-3 py-3 text-slate-700 text-xs max-w-xs truncate" title={task.learnings}>{task.learnings}</td>
                    <td className="px-3 py-3 text-slate-700 text-sm">{task.pmCheck}</td>
                    <td className="px-3 py-3 text-slate-700 text-sm">{task.teamLeadCheck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default WeeklyWorkSummary;
