// This page is for showing the current logged in user's profile details including the System Admin, CEO, Developer, PM, TL, and ATL.
// It fetches the current user's details from the backend and displays them in a card format. 
// The user can also navigate to the edit profile page from here.

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiUsers,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { employeeService } from "../services/employeeService";

export default function UserProfile() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(authUser || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await employeeService.getCurrentUser();
        const data = res?.data || null;

        if (isMounted) {
          setProfile(data || authUser || null);
        }
      } catch (err) {
        if (isMounted) {
          setProfile(authUser || null);
          setError(err?.response?.data?.message || "Failed to load profile details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const displayName = useMemo(() => {
    const first = profile?.firstName?.trim() || "";
    const last = profile?.lastName?.trim() || "";
    if (first || last) return `${first} ${last}`.trim();
    return profile?.name || profile?.email || "User";
  }, [profile]);

  const initials = useMemo(() => {
    const parts = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "");

    return parts.join("") || "U";
  }, [displayName]);

  const joinedDate = useMemo(() => {
    const value = profile?.joinedDate || profile?.createdAt;
    if (!value) return "Not available";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Not available";

    return parsed.toLocaleDateString();
  }, [profile]);

  const profileImageSrc = useMemo(() => {
    const image = profile?.profileImage;
    if (!image) return "";

    if (image.startsWith("http") || image.startsWith("data:")) {
      return image;
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const backendBase = apiBase.replace("/api", "");
    return `${backendBase}/uploads/${image}`;
  }, [profile?.profileImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-600">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ================= SIDEBAR ================= */}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8">
        {/* Breadcrumb */}
        {/* <div className="mb-6">
          <Link
            to="/user-management"
            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            <FiArrowLeft className="mr-2" />
            Back to User Management
          </Link>
        </div> */}

        {error && (
          <div className="max-w-xl mx-auto mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold mx-auto">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Name & Role */}
          <h2 className="mt-4 text-xl font-semibold">{displayName}</h2>
          <p className="text-gray-500 text-sm">{profile?.role || "Unassigned"}</p>

          {/* Status */}
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
              (profile?.status || "").toLowerCase() === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {profile?.status || "Unknown"}
          </span>

          <hr className="my-6" />

          {/* Details */}
          <div className="text-left space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <FiMail className="text-gray-500" />
              <span>{profile?.email || "Not available"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FiUsers className="text-gray-500" />
              <span>{profile?.department || "No department assigned"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="text-gray-500" />
              <span>Joined &nbsp; {joinedDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <FiUser className="text-gray-500" />
              <span>{profile?.designation || "No designation assigned"}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() =>
                navigate(
                  `/dashboard/profile/personal-details?mode=edit${
                    profile?._id ? `&id=${profile._id}` : ""
                  }`
                )
              }
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
