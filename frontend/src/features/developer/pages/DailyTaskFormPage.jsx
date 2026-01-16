import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDailyTask } from "../../../services/dailyTaskService";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

function DailyTaskFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    task: "",
    project: "",
    status: "Not Started",
    startTime: "",
    endTime: "",
    workingHours: "",
    facedIssues: "",
    learnings: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const goBack = () => navigate("/tasks");

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.task || !form.project) {
      toast.error("Task and Project are required");
      return;
    }

    try {
      setLoading(true);

      await createDailyTask({
        ...form,
        // developer is AUTO handled by backend using token
      });

      toast.success("Daily task submitted successfully");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Operations
            </p>
            <h1 className="text-3xl font-semibold">Daily Task Sheet</h1>
            <p className="text-slate-600 text-sm mt-1">
              Submit your daily work summary
            </p>
          </div>

          <button
            onClick={goBack}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
          >
            ← Back to Tasks
          </button>
        </header>

        {/* ================= FORM ================= */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
          {/* Developer (Read Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Developer
              <input
                value={`${user?.firstName} ${user?.lastName} (${user?.role})`}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm"
              />
            </label>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Task
              <input
                value={form.task}
                onChange={update("task")}
                placeholder="E.g., Implement meeting module"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Project
              <input
                value={form.project}
                onChange={update("project")}
                placeholder="EMS"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Status
              <select
                value={form.status}
                onChange={update("status")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Blocked</option>
                <option>Completed</option>
              </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Working Hours (HH:mm)
              <input
                value={form.workingHours}
                onChange={update("workingHours")}
                placeholder="08:00"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Start Time
              <input
                type="time"
                value={form.startTime}
                onChange={update("startTime")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              End Time
              <input
                type="time"
                value={form.endTime}
                onChange={update("endTime")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Faced Issues
              <textarea
                value={form.facedIssues}
                onChange={update("facedIssues")}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Learnings
              <textarea
                value={form.learnings}
                onChange={update("learnings")}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={goBack}
              className="border border-slate-300 px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DailyTaskFormPage;
