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
  FiPhone,
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
      <div className="min-h-screen bg-gradient-to-br from-[#F5F8FD] via-[#EEF4FF] to-[#F8FBFF] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    // Page background wrapper
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FD] via-[#EEF4FF] to-[#F8FBFF]">
      {/* Content container */}
      <div className="mx-auto w-full max-w-5xl px-4 py-5 md:px-6 md:py-6">
        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main profile card shell */}
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="grid md:grid-cols-[280px_1fr]">
            {/* Left summary panel */}
            <aside className="bg-gradient-to-br from-[#0F62FE] via-[#266DFF] to-[#4A88FF] p-5 text-white">
              {/* Avatar block */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white/20 text-2xl font-semibold">
                {profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Name and role */}
              <h2 className="mt-3 text-center text-lg font-bold leading-tight">{displayName}</h2>
              <p className="mt-1 text-center text-xs text-blue-100">{profile?.role || "Unassigned"}</p>

              {/* Status chip */}
              <div className="mt-3 flex justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    (profile?.status || "").toLowerCase() === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white/90 text-slate-700"
                  }`}
                >
                  {profile?.status || "Unknown"}
                </span>
              </div>

              {/* Joined date and department mini stats */}
              <div className="mt-4 rounded-xl bg-white/15 p-3 text-xs">
                <div className="mb-2 flex items-center gap-2 text-blue-50">
                  <FiCalendar className="text-sm" />
                  <span className="font-medium">Joined</span>
                </div>
                <p className="text-sm font-semibold text-white">{joinedDate}</p>

                <div className="mt-3 h-px bg-white/25" />

                <div className="mt-3 mb-2 flex items-center gap-2 text-blue-50">
                  <FiUsers className="text-sm" />
                  <span className="font-medium">Department</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {profile?.department || "Not assigned"}
                </p>
              </div>
            </aside>

            {/* Right detailed profile panel */}
            <section className="p-5 md:min-h-[500px] md:p-7">
              {/* Profile overview header */}
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Profile Overview</h3>
                  <p className="mt-1 text-sm text-slate-500">Live account details for your current login session</p>
                </div>
                <span className="rounded-full bg-[#FFE9C2] px-3 py-1 text-[11px] font-semibold text-[#B26A00]">
                  Account
                </span>
              </div>

              {/* Detail cards grid */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <FiMail className="text-sm text-blue-600" />
                    Email
                  </div>
                  <p className="text-sm font-semibold text-slate-900 break-all">{profile?.email || "Not available"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <FiUser className="text-sm text-blue-600" />
                    Designation
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{profile?.designation || "No designation assigned"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <FiUsers className="text-sm text-blue-600" />
                    Role
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{profile?.role || "Unassigned"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <FiPhone className="text-sm text-blue-600" />
                    Contact Number
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{profile?.contactNumber || "Not available"}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/profile/personal-details?mode=edit${
                        profile?._id ? `&id=${profile._id}` : ""
                      }`
                    )
                  }
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F62FE] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004ED8] sm:w-auto"
                >
                  Edit Profile
                </button>

                <button className="inline-flex w-full items-center justify-center rounded-xl border border-[#0F62FE]/30 bg-[#EAF1FF] px-4 py-2 text-sm font-semibold text-[#0F62FE] transition hover:bg-[#DBE7FF] sm:w-auto">
                  Send Message
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
