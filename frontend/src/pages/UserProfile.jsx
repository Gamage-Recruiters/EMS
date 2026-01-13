import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiUsers,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import Sidebar from "./Sidebar";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/user-management"
            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            <FiArrowLeft className="mr-2" />
            Back to User Management
          </Link>
        </div>

        {/* Profile Card */}
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold mx-auto">
            SJ
          </div>

          {/* Name & Role */}
          <h2 className="mt-4 text-xl font-semibold">Sarah Johnson</h2>
          <p className="text-gray-500 text-sm">Team Lead</p>

          {/* Status */}
          <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            active
          </span>

          <hr className="my-6" />

          {/* Details */}
          <div className="text-left space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <FiMail className="text-gray-500" />
              <span>sarah.j@company.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FiUsers className="text-gray-500" />
              <span>Frontend Team Alpha</span>
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="text-gray-500" />
              <span>Joined &nbsp; 2022-03-15</span>
            </div>

            <div className="flex items-center gap-3">
              <FiUser className="text-gray-500" />
              <span>Senior Level</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/profile/personal-details?mode=edit")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>

            <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
