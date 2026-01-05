import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Basic validation logic
  const validate = () => {
    const newErrors = {};

    // First name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits";
      }
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters, include 1 uppercase letter and 1 number";
      }
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms
    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms & privacy policy";
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
      console.log("Form data ready to send:", formData);

      // TODO: BACKEND INTEGRATION
      // When your backend is ready, replace the console.log above
      // with a real API call, for example:
      //
      // const response = await fetch("http://localhost:5000/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     email: formData.email,
      //     phone: formData.phone,
      //     password: formData.password,
      //   }),
      // });
      //
      // const data = await response.json();
      //
      // if (!response.ok) {
      //   // Example: show backend error message
      //   setErrors({ api: data.message || "Registration failed" });
      //   return;
      // }
      //
      // // On success -> redirect to login page
      // // navigate("/login");   // when you add react-router hooks

      alert("Validation passed. Ready to integrate with backend API.");
    } catch (err) {
      console.error("Error during registration:", err);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to apply error styles
  const inputClass = (fieldName) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left blue branding section */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center">
        <div className="max-w-md px-10">
          <h1 className="text-3xl font-semibold">Gamage Recruiters</h1>
          <div className="mt-2 h-1 w-16 bg-white rounded-full" />

          {/* Simple abstract placeholder graphic */}
          <div className="mt-10 border border-white/50 rounded-2xl p-8 space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 border border-white rounded-full" />
              <div className="flex-1 h-px bg-white/70" />
            </div>
            <div className="h-24 border border-dashed border-white/60 rounded-xl" />
            <div className="flex gap-2">
              <span className="w-4 h-1 bg-white rounded" />
              <span className="w-4 h-1 bg-white rounded" />
              <span className="w-4 h-1 bg-white rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-xl px-6 py-10 md:px-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600">
            Welcome to Gamage Recruiters
          </h2>
          <p className="mt-2 text-gray-500">Register your account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* API-level error (from backend later) */}
            {errors.api && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errors.api}
              </p>
            )}

            {/* First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-blue-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={inputClass("firstName")}
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-blue-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={inputClass("lastName")}
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-700"
                >
                  E-mail Address
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

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-blue-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={inputClass("phone")}
                  placeholder="07X XXXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Password / Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={inputClass("password")}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-blue-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={inputClass("confirmPassword")}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms + checkbox */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to all the{" "}
                <button
                  type="button"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Terms
                </button>
                ,{" "}
                <button
                  type="button"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-xs text-red-600">{errors.terms}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            {/* Already have account */}
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
