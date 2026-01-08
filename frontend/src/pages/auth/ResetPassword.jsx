import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "At least 8 characters, 1 uppercase letter and 1 number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Resetting password for:", email, formData.password);

      // TODO: BACKEND INTEGRATION
      // const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     email,
      //     password: formData.password,
      //   }),
      // });
      // const data = await res.json();
      // if (!res.ok) {
      //   setErrors({ api: data.message || "Failed to update password" });
      //   return;
      // }

      // On success:
      navigate("/reset-success");
    } catch (err) {
      console.error("Error resetting password:", err);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `mt-2 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm px-8 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">New Password</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          Set the new password for your account so you can login and access all
          features.
        </p>

        {errors.api && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.api}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* New password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Enter new password
            </label>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="8 symbols at least"
                className={inputClass("password")}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-700 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Confirm password
            </label>
            <div className="mt-2 relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="8 symbols at least"
                className={inputClass("confirmPassword")}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-700 text-sm"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white tracking-wide shadow-sm ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
