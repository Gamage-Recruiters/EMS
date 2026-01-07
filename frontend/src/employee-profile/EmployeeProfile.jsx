import React, { useEffect, useState } from "react";
import { Link, Outlet, useSearchParams, useNavigate } from "react-router-dom";
import { employeeService } from "../services/employeeService";

export default function EmployeeProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode") || "add";
  const employeeId = searchParams.get("id");
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Unified employee object shared across all tabs
  const [employee, setEmployee] = useState({
    id: null,
    fullName: "",
    avatarUrl: "",
    department: "",
    jobRole: "",
    jobCategory: "",
    role: "", // for role/position edit UI
    team: "",
    contact: {
      phone1: "",
      phone2: "",
      email: "",
      city: "",
      address: "",
    },
    education: {
      institution: "",
      department: "",
      course: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // Load existing employee in edit mode
  useEffect(() => {
    if (!isEdit || !employeeId) return;

    setLoading(true);
    employeeService
      .get(employeeId)
      .then((res) => {
        const data = res.data;

        setEmployee({
          id: data.id ?? employeeId,
          fullName: data.fullName ?? "",
          avatarUrl: data.avatarUrl ?? "",
          department: data.department ?? "",
          jobRole: data.jobRole ?? "",
          jobCategory: data.jobCategory ?? "",
          role: data.role ?? "",
          team: data.team ?? "",
          contact: {
            phone1: data.contact?.phone1 ?? "",
            phone2: data.contact?.phone2 ?? "",
            email: data.contact?.email ?? "",
            city: data.contact?.city ?? "",
            address: data.contact?.address ?? "",
          },
          education: {
            institution: data.education?.institution ?? "",
            department: data.education?.department ?? "",
            course: data.education?.course ?? "",
            location: data.education?.location ?? "",
            startDate: data.education?.startDate ?? "",
            endDate: data.education?.endDate ?? "",
            description: data.education?.description ?? "",
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load employee profile.");
      })
      .finally(() => setLoading(false));
  }, [isEdit, employeeId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (isEdit && employeeId) {
        await employeeService.update(employeeId, employee);
      } else {
        const res = await employeeService.create(employee);
        const newId = res.data.id;
        navigate(`/profile?mode=edit&id=${newId}`);
      }

      alert("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save employee profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!employeeId) return;
    if (!window.confirm("Are you sure you want to delete this profile?")) return;

    try {
      await employeeService.remove(employeeId);
      alert("Profile deleted.");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee.");
    }
  };

  const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

  if (loading) {
    return <div className="p-6">Loading profile…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Employee Profile" : "Add Employee Profile"}
        </h1>

        <div className="flex gap-3">
          {isEdit && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-gray-600 text-sm">
        Dashboard &gt;{" "}
        <span className="font-semibold">
          {isEdit ? "Edit Profile" : "Add Profile"}
        </span>
      </div>

      {/* Layout */}
      <div className="flex px-6 py-4 gap-6">
        {/* Sidebar */}
        <div className="w-60 bg-white p-4 rounded-lg shadow">
          <nav className="flex flex-col gap-3">
            <Link className="hover:bg-gray-200 p-2 rounded" to={`personal-details${qs}`}>
              Personal Details
            </Link>
            <Link className="hover:bg-gray-200 p-2 rounded" to={`contact-details${qs}`}>
              Contact Details
            </Link>
            <Link
              className="hover:bg-gray-200 p-2 rounded"
              to={`education-qualification${qs}`}
            >
              Education Qualification
            </Link>
            <Link className="hover:bg-gray-200 p-2 rounded" to={`job-details${qs}`}>
              Job Details / Role
            </Link>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </div>
          )}
          <Outlet context={{ employee, setEmployee, isEdit }} />
        </div>
      </div>
    </div>
  );
}
