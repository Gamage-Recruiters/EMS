import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiSave } from "react-icons/fi";
import { employeeService } from "../../../services/employeeService";

const STEP_ROUTES = [
  { key: "personal", label: "Personal Details", path: "personal-details" },
  { key: "contact", label: "Contact Details", path: "contact-details" },
  { key: "education", label: "Education", path: "education-qualification" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^(?:\+94|94|0)?7\d{8}$/;

export default function SelfProfileEditPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = searchParams.get("mode") || "edit";
  const isView = mode === "view";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Developer",
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
    setInfoMsg(null);
  };

  const profileOverviewPath = useMemo(() => {
    if (employee?._id) {
      return `/dashboard/user-profile/${employee._id}`;
    }
    return "/dashboard/home";
  }, [employee?._id]);

  useEffect(() => {
    setMaxUnlockedStep(0);
  }, []);

  useEffect(() => {
    if (isView) return;
    if (currentStepIndex > maxUnlockedStep) {
      navigate(`${STEP_ROUTES[maxUnlockedStep].path}${qs}`, { replace: true });
    }
  }, [isView, currentStepIndex, maxUnlockedStep, navigate, qs]);

  useEffect(() => {
    setLoading(true);
    clearMessages();

    employeeService
      .getCurrentUser()
      .then((res) => {
        const data = res?.data || {};
        setEmployee({
          _id: data._id ?? data.id ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          password: "",
          role: data.role ?? "Developer",
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
        setPageError(err?.response?.data?.message || "Failed to load your profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const validatePersonal = () => {
    const nextErrors = {};

    if (!employee.firstName?.trim()) nextErrors.firstName = "First name is required.";
    if (!employee.lastName?.trim()) nextErrors.lastName = "Last name is required.";

    if (!employee.email?.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(employee.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (employee.password?.trim() && employee.password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0) {
      setPageError(Object.values(nextErrors)[0]);
      return false;
    }

    return true;
  };

  const validateContact = () => {
    const nextErrors = {};

    if (!employee.contactNumber?.trim()) {
      nextErrors.contactNumber = "Mobile number is required.";
    } else if (!mobileRegex.test(employee.contactNumber.trim())) {
      nextErrors.contactNumber =
        "Enter a valid Sri Lankan mobile number (07XXXXXXXX / +947XXXXXXXX).";
    }

    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0) {
      setPageError(Object.values(nextErrors)[0]);
      return false;
    }

    return true;
  };

  const validateStep = (idx) => {
    clearMessages();
    if (idx === 0) return validatePersonal();
    if (idx === 1) return validateContact();
    return true;
  };

  const goNext = () => {
    if (isView) return;
    const ok = validateStep(currentStepIndex);
    if (!ok) return;

    const next = Math.min(currentStepIndex + 1, lastStepIndex);
    setMaxUnlockedStep((prev) => Math.max(prev, next));
    navigate(`${STEP_ROUTES[next].path}${qs}`);
  };

  const goBack = () => {
    if (isView) return;
    clearMessages();

    const prev = Math.max(currentStepIndex - 1, 0);
    navigate(`${STEP_ROUTES[prev].path}${qs}`);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      clearMessages();
      setInfoMsg("Updating your profile details...");

      const ok1 = validatePersonal();
      const ok2 = validateContact();
      if (!ok1 || !ok2) return;

      const payload = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        contactNumber: employee.contactNumber,
        address: employee.address,
        city: employee.city,
        education: employee.education,
      };

      if (employee.password?.trim()) {
        payload.password = employee.password.trim();
      }

      const formData = new FormData();
      formData.append("firstName", payload.firstName || "");
      formData.append("lastName", payload.lastName || "");
      formData.append("email", payload.email || "");
      formData.append("contactNumber", payload.contactNumber || "");
      formData.append("address", payload.address || "");
      formData.append("city", payload.city || "");
      formData.append("education", JSON.stringify(payload.education || {}));

      if (payload.password) {
        formData.append("password", payload.password);
      }

      if (employee?.profileFile instanceof File) {
        formData.append("profileImage", employee.profileFile);
      }

      await employeeService.updateProfile(formData);

      setInfoMsg(null);
      setSuccessMsg("Your profile was updated successfully.");
    } catch (err) {
      console.error(err);
      setInfoMsg(null);
      setPageError(err?.response?.data?.message || "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const canOpenStep = (idx) => {
    if (isView) return true;
    return idx <= maxUnlockedStep;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 pb-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                My Profile
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
                      !canOpenStep(idx) ? "opacity-50 cursor-not-allowed pointer-events-auto" : ""
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
              <Outlet
                context={{
                  employee,
                  setEmployee,
                  isEdit: true,
                  isView,
                  isAdd: false,
                  saving,
                  fieldErrors,
                  setFieldErrors,
                }}
              />

              {!isView && (
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <button
                    onClick={() => navigate(profileOverviewPath)}
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

                    {isLastStep && (
                      <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
                      >
                        <FiSave className="w-5 h-5" />
                        {saving ? "Updating..." : "Update My Profile"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {(pageError || successMsg || infoMsg) && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 border ${
                    pageError
                      ? "bg-red-50 border-red-200"
                      : successMsg
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  {pageError ? (
                    <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : successMsg ? (
                    <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin flex-shrink-0" />
                  )}

                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        pageError
                          ? "text-red-900"
                          : successMsg
                          ? "text-emerald-900"
                          : "text-blue-900"
                      }`}
                    >
                      {pageError || successMsg || infoMsg}
                    </p>

                    {successMsg && (
                      <button
                        type="button"
                        onClick={() => navigate(profileOverviewPath)}
                        className="mt-3 inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                      >
                        Go to Profile Overview
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
