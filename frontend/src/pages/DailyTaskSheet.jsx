import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DailyTaskSheet() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    task: "",
    project: "",
    developer: "",
    status: "Not Started",
    startTime: "",
    endTime: "",
    workingHours: "",
    facedIssues: "",
    learnings: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const goBack = () => navigate("/tasks");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Operations</p>
            <h1 className="text-3xl font-semibold">Daily Task Sheet</h1>
            <p className="text-slate-600 text-sm mt-1">Capture a new task with owner, priority, and due date.</p>
          </div>
          <button
            onClick={goBack}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
          >
            ← Back to Tasks
          </button>
        </header>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Task
              <input
                value={form.task}
                onChange={update("task")}
                placeholder="E.g., Implement user authentication"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Project
              <input
                value={form.project}
                onChange={update("project")}
                placeholder="Project name or ID"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Developer (User ID)
              <input
                value={form.developer}
                onChange={update("developer")}
                placeholder="Developer user ID"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Status
              <select
                value={form.status}
                onChange={update("status")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Start Time
              <input
                type="time"
                value={form.startTime}
                onChange={update("startTime")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              End Time
              <input
                type="time"
                value={form.endTime}
                onChange={update("endTime")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Working Hours (e.g., 02:30)
              <input
                value={form.workingHours}
                onChange={update("workingHours")}
                placeholder="HH:mm"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Faced Issues
              <textarea
                value={form.facedIssues}
                onChange={update("facedIssues")}
                rows={2}
                placeholder="Describe any issues faced"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Learnings
              <textarea
                value={form.learnings}
                onChange={update("learnings")}
                rows={2}
                placeholder="What did you learn?"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={goBack}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Save Task
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DailyTaskSheet;
