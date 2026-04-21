import React, { useEffect, useMemo, useState } from "react";
import { projectService } from "../../services/projectService";
import { useAuth } from "../../context/AuthContext.jsx";

const emptyForm = {
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Active",
};

export default function TLPastProjects() {
  const { user } = useAuth() || {};
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const isTL = user?.role === "TL";

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await projectService.list();
      setProjects(response?.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const completedProjects = useMemo(() => {
    return projects.filter((project) => project.status === "Completed");
  }, [projects]);

  const activeProjects = useMemo(() => {
    return projects.filter((project) => project.status !== "Completed");
  }, [projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      projectName: project.projectName || "",
      description: project.description || "",
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
      status: project.status || "Active",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        projectName: form.projectName,
        description: form.description,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: form.status,
      };

      if (editingId) {
        await projectService.update(editingId, payload);
      } else {
        await projectService.create(payload);
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmed) return;

    try {
      await projectService.remove(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              All Projects
            </h1>
            <p className="text-sm text-gray-500">
              {isTL
                ? "Manage and review project records for your team."
                : "Review all project records in the organization."}
            </p>
          </div>

          {isTL && !showForm && (
            <button
              onClick={handleOpenCreate}
              className="rounded-xl bg-[#2563EB] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#1D4ED8] transition"
            >
              + Create New Project
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isTL && showForm && (
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Project" : "Create New Project"}
              </h2>

              <button
                onClick={resetForm}
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#2563EB] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#1D4ED8] transition disabled:opacity-60"
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Project"
                      : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-gray-100 text-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Ongoing / Current Projects
          </h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading projects...</p>
          ) : activeProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-sm text-gray-500">
              No active projects found.
            </div>
          ) : (
            <div className="grid gap-4">
              {activeProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isTL={isTL}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Past Project Details
          </h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading projects...</p>
          ) : completedProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-sm text-gray-500">
              No completed projects found.
            </div>
          ) : (
            <div className="grid gap-4">
              {completedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isTL={isTL}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, isTL, onEdit, onDelete }) {
  const statusClasses = {
    Active: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    "On Hold": "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-slate-900">
              {project.projectName}
            </h2>
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                statusClasses[project.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {project.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {project.description || "No description available."}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              Start:{" "}
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Not set"}
            </span>
            <span>
              End:{" "}
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Not set"}
            </span>
          </div>
        </div>

        {isTL && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(project)}
              className="rounded-lg bg-blue-50 text-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-100"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-sm font-medium hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
