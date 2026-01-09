// EmployeeProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Outlet,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { employeeService } from "../../../../services/employeeService";

const STEP_ROUTES = [
  { key: "personal", label: "👤 Personal Details", path: "personal-details" },
  { key: "contact", label: "📞 Contact Details", path: "contact-details" },
  { key: "education", label: "🎓 Education", path: "education-qualification" },
  { key: "job", label: "💼 Job Details", path: "job-details" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Sri Lanka: 07XXXXXXXX OR +947XXXXXXXX OR 947XXXXXXXX
const mobileRegex = /^(?:\+94|94|0)?7\d{8}$/;

export default function EmployeeProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = searchParams.get("mode") || "add"; // add | edit | view
  const employeeId = searchParams.get("id");

  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isAdd = mode === "add";

  const [loading, setLoading] = useState(isEdit || isView);
  const [saving, setSaving] = useState(false);

  const [pageError, setPageError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Wizard gating for ADD + EDIT (VIEW has no buttons)
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

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

  const qs = useMemo(() => {
    const s = searchParams.toString();
    return s ? `?${s}` : "";
  }, [searchParams]);

  const currentStepIndex = useMemo(() => {
    const p = location.pathname;
    const idx = STEP_ROUTES.findIndex((s) => p.endsWith(`/${s.path}`));
    return idx >= 0 ? idx : 0;
  }, [location.pathname]);

  const lastStepIndex = STEP_ROUTES.length - 1;
  const isLastStep = currentStepIndex === lastStepIndex;

  const clearMessages = () => {
    setPageError(null);
    setSuccessMsg(null);
  };

  // Reset wizard lock when mode/employee changes
  useEffect(() => {
    if (isView) return;
    setMaxUnlockedStep(0);
  }, [mode, employeeId, isView]);

  // Enforce sequential navigation for ADD + EDIT (VIEW not enforced)
  useEffect(() => {
    if (isView) return;
    if (currentStepIndex > maxUnlockedStep) {
      navigate(`/profile/${STEP_ROUTES[maxUnlockedStep].path}${qs}`, {
        replace: true,
      });
    }
  }, [isView, currentStepIndex, maxUnlockedStep, navigate, qs]);

  // Load in edit/view mode
  useEffect(() => {
    if ((!isEdit && !isView) || !employeeId) return;

    setLoading(true);
    clearMessages();

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
        setPageError("Failed to load employee profile.");
      })
      .finally(() => setLoading(false));
  }, [isEdit, isView, employeeId]);

  // -------- Validation helpers (used for Next + Save) --------
  const validatePersonal = () => {
    if (!employee.firstName?.trim()) {
      setPageError("First name is required.");
      return false;
    }
    if (!employee.lastName?.trim()) {
      setPageError("Last name is required.");
      return false;
    }

    if (!employee.email?.trim()) {
      setPageError("Email is required.");
      return false;
    }
    if (!emailRegex.test(employee.email.trim())) {
      setPageError("Enter a valid email address.");
      return false;
    }

    // Password required only for ADD (not edit)
    if (isAdd) {
      if (!employee.password?.trim()) {
        setPageError("Password is required for new employees.");
        return false;
      }
      if (employee.password.trim().length < 6) {
        setPageError("Password must be at least 6 characters.");
        return false;
      }
    }

    return true;
  };

  const validateContact = () => {
    if (!employee.contactNumber?.trim()) {
      setPageError("Mobile number is required.");
      return false;
    }
    if (!mobileRegex.test(employee.contactNumber.trim())) {
      setPageError(
        "Enter a valid Sri Lankan mobile number (07XXXXXXXX / +947XXXXXXXX)."
      );
      return false;
    }
    return true;
  };

  const validateStep = (idx) => {
    clearMessages();
    if (idx === 0) return validatePersonal();
    if (idx === 1) return validateContact();
    return true; // education/job optional
  };

  // -------- Wizard navigation (ADD + EDIT) --------
  const goNext = () => {
    if (isView) return;

    const ok = validateStep(currentStepIndex);
    if (!ok) return;

    const next = Math.min(currentStepIndex + 1, lastStepIndex);
    setMaxUnlockedStep((prev) => Math.max(prev, next));
    navigate(`/profile/${STEP_ROUTES[next].path}${qs}`);
  };

  const goBack = () => {
    if (isView) return;
    clearMessages();

    const prev = Math.max(currentStepIndex - 1, 0);
    navigate(`/profile/${STEP_ROUTES[prev].path}${qs}`);
  };

  // -------- Create / Update (only on last step) --------
  const handleCreate = async () => {
    try {
      setSaving(true);
      clearMessages();

      const ok1 = validatePersonal();
      const ok2 = validateContact();
      if (!ok1 || !ok2) return;

      await employeeService.create(employee);

      setSuccessMsg("Employee created successfully.");
      setTimeout(() => {
        navigate("/employees");
      }, 900);
    } catch (err) {
      console.error(err);
      setPageError(
        err?.response?.data?.message || "Failed to create employee profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      clearMessages();

      if (!employeeId) {
        setPageError("Missing employee id for update.");
        return;
      }

      const ok1 = validatePersonal(); // password not required in edit
      const ok2 = validateContact();
      if (!ok1 || !ok2) return;

      const payload = { ...employee };
      if (!payload.password) delete payload.password;

      await employeeService.update(employeeId, payload);

      setSuccessMsg("Employee updated successfully.");
      setTimeout(() => {
        navigate("/employees");
      }, 900);
    } catch (err) {
      console.error(err);
      setPageError(
        err?.response?.data?.message || "Failed to update employee profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const canOpenStep = (idx) => {
    if (isView) return true;
    return idx <= maxUnlockedStep; // ADD + EDIT are sequential
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
      {(pageError || successMsg) && (
        <div
          className={`mx-8 mt-6 p-4 rounded-lg flex items-start gap-3 border ${
            pageError
              ? "bg-red-50 border-red-200"
              : "bg-emerald-50 border-emerald-200"
          }`}
        >
          {pageError ? (
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm font-medium ${
              pageError ? "text-red-900" : "text-emerald-900"
            }`}
          >
            {pageError || successMsg}
          </p>
        </div>
      )}

      <div className="px-8 pb-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Sections
              </h3>

              <nav className="space-y-2">
                {STEP_ROUTES.map((s, idx) => (
                  <Link
                    key={s.key}
                    to={`${s.path}${qs}`}
                    onClick={(e) => {
                      if (!canOpenStep(idx)) e.preventDefault();
                    }}
                    className={`block px-4 py-3 rounded-lg font-medium transition ${
                      location.pathname.endsWith(`/${s.path}`)
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    } ${
                      !canOpenStep(idx)
                        ? "opacity-50 cursor-not-allowed pointer-events-auto"
                        : ""
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
              <Outlet
                context={{
                  employee,
                  setEmployee,
                  isEdit,
                  isView,
                  isAdd,
                  saving,
                }}
              />

              {/* Wizard Footer (ADD + EDIT): Back / Next / Create / Update */}
              {!isView && (
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/employees")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>

                  <div className="flex items-center gap-3">
                    {currentStepIndex > 0 && (
                      <button
                        onClick={goBack}
                        disabled={saving}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium rounded-lg transition"
                      >
                        Back
                      </button>
                    )}

                    {!isLastStep && (
                      <button
                        onClick={goNext}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
                      >
                        Next
                      </button>
                    )}

                    {isLastStep && isAdd && (
                      <button
                        onClick={handleCreate}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
                      >
                        <FiSave className="w-5 h-5" />
                        {saving ? "Creating…" : "Create Employee"}
                      </button>
                    )}

                    {isLastStep && isEdit && (
                      <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
                      >
                        <FiSave className="w-5 h-5" />
                        {saving ? "Updating…" : "Update Employee"}
                      </button>
                    )}
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
