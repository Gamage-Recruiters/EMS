import React from "react";
import { NavLink } from "react-router-dom";

const TABS = [
  { label: "Personal Details", path: "/profile/personal" },
  { label: "Contact Details", path: "/profile/contact" },
  { label: "Education Qualifications", path: "/profile/education" },
  { label: "Job Details", path: "/profile/job" },
];

const ProfileSidebar = () => {
  return (
    <aside className="w-80 bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-3">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `w-full rounded-2xl px-4 py-3 text-sm font-medium text-left transition-colors ${
              isActive
                ? "bg-[#FFA726] text-white"
                : "bg-[#E6F2FF] text-slate-800 hover:bg-[#d8e9ff]"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default ProfileSidebar;