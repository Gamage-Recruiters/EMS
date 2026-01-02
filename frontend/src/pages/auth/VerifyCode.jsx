import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const INITIAL_SECONDS = 30;

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasErrorStyle, setHasErrorStyle] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // optional

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(
      () => setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits, max 1 char
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    setHasErrorStyle(false);
    setErrors({});

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setSecondsLeft(INITIAL_SECONDS);
    setCode(["", "", "", ""]);
    setHasErrorStyle(false);
    setErrors({});
    inputsRef.current[0]?.focus();

    console.log("Resend code for email:", email);

    // 🔗 TODO: BACKEND INTEGRATION
    // Call /auth/resend-code with email if needed
  };

  const validate = () => {
    const joined = code.join("");
    const newErrors = {};
    if (joined.length !== 4) {
      newErrors.code = "Enter the 4-digit code";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setHasErrorStyle(false);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setHasErrorStyle(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const joined = code.join("");
      console.log("Verifying code:", joined, "for email:", email);

      // TODO: BACKEND INTEGRATION
      // const res = await fetch("http://localhost:5000/api/auth/verify-code", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, code: joined }),
      // });
      // const data = await res.json();
      // if (!res.ok) {
      //   setErrors({ api: data.message || "Invalid or expired code" });
      //   setHasErrorStyle(true);
      //   return;
      // }

      // On success, go to reset password
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("Error verifying code:", err);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timerText = `00:${secondsLeft.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm px-8 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">Verification</h1>
        <p className="mt-3 text-sm text-gray-500">
          Enter your 4 digits code that you received on your email
          {email ? ` (${email})` : ""}.
        </p>

        {errors.api && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.api}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* 4 code boxes */}
          <div className="flex justify-center gap-4">
            {code.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl rounded-md border-2 ${
                  hasErrorStyle
                    ? "border-red-500 focus:border-red-500"
                    : "border-blue-200 focus:border-blue-500"
                } bg-white focus:outline-none`}
              />
            ))}
          </div>
          {errors.code && (
            <p className="text-xs text-center text-red-600">{errors.code}</p>
          )}

          {/* Timer */}
          <p className="text-center text-sm mt-2 text-[#FF4B2B]">
            {timerText}
          </p>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white tracking-wide shadow-sm ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Verifying..." : "CONTINUE"}
          </button>
        </form>

        {/* Resend */}
        <p className="mt-6 text-center text-sm text-gray-500">
          If you didn’t receive a code!{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-[#FF4B2B] font-medium hover:underline"
          >
            Resend
          </button>
        </p>

        {/* Back to login if needed */}
        <p className="mt-4 text-center text-xs text-gray-400">
          <Link to="/login" className="hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyCode;
