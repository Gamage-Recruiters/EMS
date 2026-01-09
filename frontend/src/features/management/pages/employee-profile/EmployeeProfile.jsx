import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Outlet,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { FiSave, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { employeeService } from "../../../../services/employeeService";

export default function EmployeeProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = searchParams.get("mode") || "add";
  const employeeId = searchParams.get("id");

  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [loading, setLoading] = useState(isEdit || isView);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Unified employee object shared across all tabs
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Unassigned",
    designation: "",
    department: "",
    status: "Active",
    profileImage: "",
    contactNumber: "",
    address: "",
    city: "",
    joinedDate: new Date().toISOString().split("T")[0],
    education: {
      institution: "",
      department: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  });

  // Build query string to preserve mode/id on tab navigation
  const qs = useMemo(() => {
    const s = searchParams.toString();
    return s ? `?${s}` : "";
  }, [searchParams]);

  // Only show "Create/Update" action bar on the last step when creating.
  // In edit mode, allow save from any tab (better UX).
  const isJobDetailsStep = useMemo(
    () => location.pathname.endsWith("/job-details"),
    [location.pathname]
  );
  const showActionBar = !isView && (isEdit || isJobDetailsStep);

  // Load existing employee in edit/view mode
  useEffect(() => {
    if ((!isEdit && !isView) || !employeeId) return;

    setLoading(true);
    setError(null);

    employeeService
      .get(employeeId)
      .then((res) => {
        const data = res?.data?.user || res?.data || {};

        setEmployee({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          password: "", // never prefill password
          role: data.role ?? "Unassigned",
          designation: data.designation ?? "",
          department: data.department ?? "",
          status: data.status ?? "Active",
          profileImage: data.profileImage ?? "",
          contactNumber: data.contactNumber ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          joinedDate: data.joinedDate
            ? new Date(data.joinedDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          education: {
            institution: data.education?.institution ?? "",
            department: data.education?.department ?? "",
            degree: data.education?.degree ?? "",
            location: data.education?.location ?? "",
            startDate: data.education?.startDate
              ? new Date(data.education.startDate).toISOString().split("T")[0]
              : "",
            endDate: data.education?.endDate
              ? new Date(data.education.endDate).toISOString().split("T")[0]
              : "",
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load employee profile.");
      })
      .finally(() => setLoading(false));
  }, [isEdit, isView, employeeId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate required fields (minimum)
      if (!employee.firstName || !employee.lastName || !employee.email) {
        setError("First name, last name, and email are required.");
        return;
      }

      if (isEdit && employeeId) {
        // Update: do NOT send password unless user entered a new one
        const payload = { ...employee };
        if (!payload.password) delete payload.password;

        await employeeService.update(employeeId, payload);
        alert("Profile updated successfully.");
        return;
      }

      // Create
      if (!employee.password) {
        setError("Password is required for new employees.");
        return;
      }

      const res = await employeeService.create(employee);
      const newId = res?.data?.user?._id || res?.data?._id;

      // After create, go to edit mode on job details (or first tab if you prefer)
      if (newId) {
        navigate(`/profile/personal-details?mode=edit&id=${newId}`);
      } else {
        navigate("/employees");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save employee profile.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Alert */}
      {error && (
        <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
      )}

      {/* Layout */}
      <div className="px-8 pb-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Sections
              </h3>
              <nav className="space-y-2">
                <Link
                  to={`personal-details${qs}`}
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  👤 Personal Details
                </Link>
                <Link
                  to={`contact-details${qs}`}
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  📞 Contact Details
                </Link>
                <Link
                  to={`education-qualification${qs}`}
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  🎓 Education
                </Link>
                <Link
                  to={`job-details${qs}`}
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  💼 Job Details
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
              <Outlet context={{ employee, setEmployee, isEdit, isView }} />

              {/* Action Buttons - show only on last step for Create; anywhere for Edit */}
              {showActionBar && (
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/employees")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>

                  <div className="flex items-center gap-3">
                    {isEdit && (
                      <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition"
                      >
                        <FiTrash2 className="w-5 h-5" />
                        Delete
                      </button>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
                    >
                      <FiSave className="w-5 h-5" />
                      {saving
                        ? "Saving…"
                        : isEdit
                        ? "Update Employee"
                        : "Create Employee"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}