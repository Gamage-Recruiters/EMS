import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
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
      console.log("Forgot password email ready to send:", email);

      // TODO: BACKEND INTEGRATION
      // Call your backend to start reset flow, e.g.:
      //
      // const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await res.json();
      // if (!res.ok) {
      //   setErrors({ api: data.message || "Unable to send reset code" });
      //   return;
      // }
      //
      // Optionally store email in context / global state

      // For now just navigate to verification page
      navigate("/verify-code", { state: { email } });
    } catch (err) {
      console.error("Error during forgot password:", err);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
      <div className="absolute top-8 right-10">
        <Link
          to="/login"
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
        >
          Log in
        </Link>
      </div>

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm px-8 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">Forgot password</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          Enter your email for the verification process, we will send a 4-digit
          code to your email.
        </p>

        {errors.api && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.api}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 tracking-wide">
              E mail
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className={`${inputClass} ${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
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
            {isSubmitting ? "Sending..." : "CONTINUE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
