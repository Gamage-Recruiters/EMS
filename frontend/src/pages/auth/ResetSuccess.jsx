import React from "react";
import { useNavigate } from "react-router-dom";

const ResetSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Later you can choose where to go (login or dashboard)
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm px-8 py-10 text-center">
        {/* Green circle with check */}
        <div className="mx-auto w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
          <span className="text-5xl text-green-500">✓</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-green-500">
          Successfully
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Your password has been reset successfully
        </p>

        <button
          onClick={handleContinue}
          className="mt-8 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white tracking-wide shadow-sm hover:bg-blue-700"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default ResetSuccess;
