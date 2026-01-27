import React from "react";

const UnassignedDashboard = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Gamage Recruiters
        </h1>
        <p className="text-gray-600 mb-6">
          You are currently <span className="font-semibold text-red-500">unassigned</span>.
          Please contact the admin to gain access to the dashboard and start managing tasks.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          onClick={() => alert("Contact Admin at admin@gamagerecruiters.com")}
        >
          Contact Admin
        </button>
      </div>
    </div>
  );
};

export default UnassignedDashboard;
