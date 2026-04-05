import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiUsers,
  FiCalendar,
  FiUser,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { employeeService } from "../services/employeeService";

export default function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setPageError("");

        const res = await employeeService.getCurrentUser();

        // backend may return user directly or inside an object
        const currentUser = res?.data?.user || res?.data || null;

        if (!currentUser) {
          setPageError("Failed to load user profile.");
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setPageError(
          error?.response?.data?.message || "Failed to load user profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const userId = user?._id || user?.id || "";

  const initials = useMemo(() => {
    const first = user?.firstName?.charAt(0)?.toUpperCase() || "";
    const last = user?.lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "U";
  }, [user]);

  const fullName = useMemo(() => {
    const first = user?.firstName || "";
    const last = user?.lastName || "";
    return `${first} ${last}`.trim() || "Unknown User";
  }, [user]);

  const joinedDate = useMemo(() => {
    const rawDate = user?.joinedDate || user?.createdAt;
    if (!rawDate) return "-";

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toISOString().split("T")[0];
  }, [user]);

  const handleEditProfile = () => {
    if (!userId) return;

    navigate(
      `/dashboard/profile/personal-details?mode=edit&id=${encodeURIComponent(userId)}`
    );
  };

  const handleSendMessage = () => {
    if (!userId) return;

    navigate(`/dashboard/tl/notices?userId=${encodeURIComponent(userId)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-700">
          <FiLoader className="animate-spin text-xl" />
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
          <FiAlertCircle className="mx-auto text-red-500 text-3xl mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Load Failed
          </h2>
          <p className="text-sm text-gray-600 mb-4">{pageError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-1 p-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 text-center">
          {/* Avatar */}
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold mx-auto">
              {initials}
            </div>
          )}

          {/* Name & Role */}
          <h2 className="mt-4 text-xl font-semibold">{fullName}</h2>
          <p className="text-gray-500 text-sm">{user?.role || "Unassigned"}</p>

          {/* Status */}
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
              user?.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user?.status || "Unknown"}
          </span>

          <hr className="my-6" />

          {/* Details */}
          <div className="text-left space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <FiMail className="text-gray-500" />
              <span>{user?.email || "-"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FiUsers className="text-gray-500" />
              <span>{user?.department || "-"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="text-gray-500" />
              <span>Joined {joinedDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <FiUser className="text-gray-500" />
              <span>{user?.designation || "-"}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleEditProfile}
              disabled={!userId}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Profile
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!userId}
              className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}