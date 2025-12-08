import React, { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // ← use later for redirect

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const navigate = useNavigate(); // use when backend is ready

  const googleLogin = useGoogleLogin({
    flow: "implicit", // frontend-only access token flow
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);

      // tokenResponse contains access_token, etc.
      // 🔗 TODO: BACKEND INTEGRATION
      // 1. Send tokenResponse.access_token (or ID token if you use code flow)
      //    to your backend:
      //
      // const res = await fetch("http://localhost:5000/api/auth/google-login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ access_token: tokenResponse.access_token }),
      // });
      //
      // const data = await res.json();
      //
      // if (!res.ok) {
      //   // Show backend error message
      //   setErrors({ api: data.message || "Google login failed" });
      //   return;
      // }
      //
      // 2. Backend verifies token with Google, creates user, returns your JWT
      // localStorage.setItem("token", data.token);
      //
      // 3. Redirect to dashboard:
      // navigate("/dashboard");

      alert("Google login successful (frontend). Ready to connect backend.");
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setErrors({ api: "Google login failed. Please try again." });
    },
    // You can restrict scopes here if needed:
    // scope: "openid profile email",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      console.log("Login form data ready to send:", formData);

      // TODO: BACKEND LOGIN API INTEGRATION
      // When your backend is ready, replace the console.log above
      // with a real API call, for example:
      //
      // const response = await fetch("http://localhost:5000/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     email: formData.email,
      //     password: formData.password,
      //   }),
      // });
      //
      // const data = await response.json();
      //
      // if (!response.ok) {
      //   // Show backend error (e.g., invalid credentials)
      //   setErrors({ api: data.message || "Login failed" });
      //   return;
      // }
      //
      // // On success: store token & redirect to dashboard
      // // localStorage.setItem("token", data.token);
      // // navigate("/dashboard");

      alert("Login validation passed. Ready to integrate with backend API.");
    } catch (err) {
      console.error("Error during login:", err);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm px-6 py-10 md:px-10">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-slate-800">
          Log in to your Gamage Recruiters account
        </h1>

        {/* API-level error */}
        {errors.api && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.api}
          </p>
        )}

        {/* Google button */}
        <button
        type="button"
        onClick={() => googleLogin()}
        className="mt-8 w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
        >
        <FcGoogle className="text-xl" />
        <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass("email")}
              placeholder="example@gamage.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password + show/hide */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Your password
              </label>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={inputClass("password")}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
              >
                Forget your password
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 w-full rounded-md bg-blue-500 py-2.5 text-sm font-semibold text-white transition-colors ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Bottom separator */}
        <div className="mt-8 h-px bg-gray-200" />

        {/* Sign up prompt */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-700">Don’t have an account?</p>
            <Link
            to="/register"
            className="mt-3 inline-block w-full rounded-full border border-gray-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
            >
            Sign up
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
