import React from "react";
import ProfileLayout from "../../components/ProfileLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const PersonalDetailsPage = () => {
  const { user } = useAuth();

  return (
    <ProfileLayout>
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="w-36 h-36 rounded-full bg-[#FFC928] flex items-center justify-center mb-10">
          <span className="text-6xl">🧑🏽‍🎨</span>
        </div>

        {/* Employee name */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-500 mb-1">Employee Name</p>
          <p className="text-2xl font-extrabold tracking-[0.25em]">
            {user?.email?.split("@")[0]?.toUpperCase() || "XXXXXX"}
          </p>
        </div>

        {/* Department */}
        <div className="text-center mb-14">
          <p className="text-sm text-gray-500 mb-1">Department</p>
          <p className="text-xl font-semibold text-slate-900">
            Design &amp; Marketing
          </p>
        </div>

        {/* Job Title + Category */}
        <div className="flex justify-center gap-32">
          <div className="text-center">
            <p className="text-sm text-gray-500">Job Title</p>
            <p className="mt-2 text-lg font-semibold">UI / UX Designer</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Job Category</p>
            <p className="mt-2 text-lg font-semibold">Full time</p>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default PersonalDetailsPage;