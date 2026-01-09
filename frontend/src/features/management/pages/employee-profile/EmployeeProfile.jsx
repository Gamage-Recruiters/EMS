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

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Wizard gating for ADD mode
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

  const isJobDetailsStep = useMemo(() => {
    return location.pathname.endsWith("/job-details");
  }, [location.pathname]);

  // ADD mode: prevent jumping ahead
  useEffect(() => {
    if (!isAdd) return;
    if (currentStepIndex > maxUnlockedStep) {
      navigate(`/profile/${STEP_ROUTES[maxUnlockedStep].path}${qs}`, {
        replace: true,
      });
    }
  }, [isAdd, currentStepIndex, maxUnlockedStep, navigate, qs]);

  // Load in edit/view mode
  useEffect(() => {
    if ((!isEdit && !isView) || !employeeId) return;

    setLoading(true);
    setPageError(null);
    setSuccessMsg(null);

    employeeService
      .get(employeeId)
      .then((res) => {
        const data = res?.data?.user || res?.data || {};
        console.log("GET employee response:", res?.data);
        // IMPORTANT:
        // If your backend returns different field names, map them here.
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
          contactNumber: data.contactNumber ?? data.phone ?? "",
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

  // -------- Validation helpers --------
  const validatePersonal = () => {
    const e = {};
    if (!employee.firstName?.trim()) e.firstName = "First name is required.";
    if (!employee.lastName?.trim()) e.lastName = "Last name is required.";

    if (!employee.email?.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(employee.email.trim()))
      e.email = "Enter a valid email address.";

    // Password required only for ADD
    if (isAdd) {
      if (!employee.password?.trim()) e.password = "Password is required.";
      else if (employee.password.trim().length < 6)
        e.password = "Password must be at least 6 characters.";
    }

    setFieldErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const validateContact = () => {
    const e = {};
    if (!employee.contactNumber?.trim())
      e.contactNumber = "Mobile number is required.";
    else if (!mobileRegex.test(employee.contactNumber.trim()))
      e.contactNumber =
        "Enter a valid Sri Lankan mobile number (07XXXXXXXX / +947XXXXXXXX).";

    setFieldErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const clearMessages = () => {
    setPageError(null);
    setSuccessMsg(null);
  };

  // -------- Wizard navigation (ADD) --------
  const goNext = () => {
    if (!isAdd || isView) return;
    clearMessages();

    const idx = currentStepIndex;
    let ok = true;

    if (idx === 0) ok = validatePersonal();
    if (idx === 1) ok = validateContact();

    if (!ok) return;

    const next = Math.min(idx + 1, STEP_ROUTES.length - 1);
    setMaxUnlockedStep((prev) => Math.max(prev, next));
    navigate(`/profile/${STEP_ROUTES[next].path}${qs}`);
  };

  const goBack = () => {
    if (!isAdd || isView) return;
    clearMessages();

    const prev = Math.max(currentStepIndex - 1, 0);
    navigate(`/profile/${STEP_ROUTES[prev].path}${qs}`);
  };

  // -------- Create / Update --------
  const handleCreate = async () => {
    try {
      setSaving(true);
      clearMessages();
      setFieldErrors({});

      const okPersonal = validatePersonal();
      const okContact = validateContact();
      if (!okPersonal || !okContact) return;

      const res = await employeeService.create(employee);
      const newId = res?.data?.user?._id || res?.data?._id;

      setSuccessMsg("Employee created successfully.");
      setTimeout(() => {
        if (newId) navigate(`/profile/personal-details?mode=edit&id=${newId}`);
        else navigate("/employees");
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
      setFieldErrors({});

      // basic safe validation
      if (!employee.firstName?.trim() || !employee.lastName?.trim()) {
        setPageError("First name and last name are required.");
        return;
      }
      if (!employee.email?.trim() || !emailRegex.test(employee.email.trim())) {
        setPageError("Please enter a valid email address.");
        return;
      }
      if (employee.contactNumber?.trim() && !mobileRegex.test(employee.contactNumber.trim())) {
        setPageError("Please enter a valid Sri Lankan mobile number.");
        return;
      }

      // IMPORTANT: Update payload - do not send password if empty
      // Also, if backend is strict about role, you can avoid sending it unless necessary:
      const payload = { ...employee };
      if (!payload.password) delete payload.password;

      // OPTIONAL mitigation:
      // If backend rejects role values, comment this in to avoid sending role unless user changed it.
      // delete payload.role;

      await employeeService.update(employeeId, payload);
      setSuccessMsg("Employee updated successfully.");
    } catch (err) {
      console.error(err);
      setPageError(
        err?.response?.data?.message || "Failed to update employee profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // UI rule:
  // - ADD: Next/Back/Create buttons are inside cards
  // - EDIT: Update button ONLY on last card (Job Details)
  const showUpdateBar = !isView && isEdit && isJobDetailsStep;

  const canOpenStep = (idx) => {
    if (!isAdd) return true; // in edit mode, allow navigation
    return idx <= maxUnlockedStep;
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
                  fieldErrors,
                  setFieldErrors,
                  onNext: goNext,
                  onBack: goBack,
                  onCreate: handleCreate,
                }}
              />

              {/* EDIT MODE: Update button only on Job Details */}
              {showUpdateBar && (
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/employees")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
                  >
                    <FiSave className="w-5 h-5" />
                    {saving ? "Updating…" : "Update Employee"}
                  </button>
                </div>
              )}

              {/* No Delete button in edit mode (QA requirement) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
