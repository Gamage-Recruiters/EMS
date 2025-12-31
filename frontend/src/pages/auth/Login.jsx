import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../utils/api.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      const data = response.data;

      // Store user data and token
      const userData = {
        id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      };

      login(userData);

      // Redirect based on role
      const roleRoutes = {
        CEO: "/dashboard/ceo",
        SYSTEM_OWNER: "/dashboard/system-owner",
        TL: "/dashboard/tl",
        ATL: "/dashboard/atl",
        PM: "/dashboard/pm",
        Developer: "/dashboard/dev",
        Unassigned: "/dashboard",
      };

      const redirectPath = roleRoutes[data.role] || "/dashboard";
      navigate(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500 bg-red-50"
        : "border-gray-300 focus:ring-blue-500 bg-white"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-6 py-10 md:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-sm">
            Log in to your Gamage Recruiters account
          </p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {apiError}
            </p>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-900 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass("email")}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <span>✗</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-900"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={inputClass("password")}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <span>✗</span> {errors.password}
              </p>
            )}
            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition-all ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 h-px bg-gray-200" />

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-3">
            Don't have an account yet?
          </p>
          <Link
            to="/register"
            className="block w-full rounded-lg border-2 border-blue-600 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-slate-500">
          By logging in, you agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;