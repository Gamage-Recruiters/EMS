import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileSidebar from "./ProfileSidebar.jsx";

const ProfileLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initial =
    user?.email?.charAt(0)?.toUpperCase() || user?.role?.charAt(0) || "U";

  const handleLogout = () => {
    // TODO: Optionally call backend logout API (e.g. POST /api/auth/logout)
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col">
      {/* TOP BAR */}
      <header className="bg-white shadow-sm">
        <div className="px-8 py-3 flex items-center justify-between">
          {/* Center "Dashboard" with yellow line */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-slate-800">
                Dashboard
              </span>
              <span className="mt-1 h-0.5 w-16 bg-[#F9A825] rounded-full" />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-full bg-[#0F62FE] flex items-center justify-center text-white">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white text-[9px] flex items-center justify-center">
                4
              </span>
            </button>

            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-semibold text-slate-800">
              {initial}
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-[#FF4B4B] text-white text-xs font-semibold shadow-md hover:bg-[#ff3333]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="bg-white shadow-sm mt-4">
        <div className="px-8 py-4 text-sm font-medium text-slate-800">
          Dashboard &gt; <span className="font-semibold">Update Profile</span>
        </div>
      </div>

      {/* MAIN CONTENT: sidebar + page content */}
      <main className="flex-1 px-8 py-8 flex gap-8 items-stretch">
        <ProfileSidebar />
        <section className="flex-1 bg-white rounded-3xl shadow-sm px-12 py-10">
          {children}
        </section>
      </main>
    </div>
  );
};

export default ProfileLayout;