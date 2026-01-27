// frontend/src/components/Sidebar.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Role-based menu items
  const menus = {
    CEO: [
      { name: "Dashboard", path: "/dashboard/ceo" },
      { name: "Employee Details", path: "/dashboard/employees" },
      { name: "Daily Task Sheet", path: "/dashboard/ceo/daily-task-sheet" },
      { name: "Daily Task History", path: "/dashboard/dev/weekly-summary" },
      { name: "Weekly Progress Overview", path: "/dashboard/ceo/weekly-overview" },
      { name: "Weekly Progress History", path: "/dashboard/ceo/weekly-history" },
      { name: "CEO Attendance Summary", path: "/dashboard/attendance" },
      { name: "Notice Broadcasting", path: "/dashboard/ceo/notices" },
      { name: "CEO Meeting Display", path: "/dashboard/meetings" },
      { name: "Leave Approval / Display", path: "/dashboard/ceo/leave" },
    ],

    Developer: [
      { name: "Dashboard", path: "/dashboard/dev" },
      { name: "Task Board", path: "/dashboard/dev/task-board" },
      { name: "Update Task Status", path: "/dashboard/dev/update-task-status" },
      { name: "Daily Task Update Form", path: "/dashboard/dev/daily-task-update" },
      { name: "Weekly Work Summary", path: "/dashboard/dev/weekly-summary" },
      { name: "Issues Form", path: "/dashboard/dev/issues" },
      { name: "Leave Form", path: "/dashboard/leave-form" },
      { name: "Complaint Submission", path: "/dashboard/complaints" },
    ],

    SYSTEM_OWNER: [
      { name: "Dashboard", path: "/dashboard/system-owner" },
      { name: "Teams", path: "/dashboard/system-owner/teams" },
      { name: "User Management", path: "/dashboard/system-owner/users" },
      { name: "Team Hierarchy", path: "/dashboard/system-owner/hierarchy" },
    ],

    TL: [
      { name: "TL Dashboard", path: "/dashboard/tl" },
      { name: "Team Formation Editor", path: "/dashboard/tl/team-formation" },
      { name: "Add Developer to Team", path: "/dashboard/tl/add-developer" },
      { name: "Schedule Meeting", path: "/dashboard/meetings" },
      { name: "Special Notices", path: "/dashboard/tl/notices" },
      { name: "Developer Progress View", path: "/dashboard/tl/dev-progress" },
      { name: "Weekly Team Progress", path: "/dashboard/tl/weekly-progress" },
      { name: "Past Project Details", path: "/dashboard/tl/past-projects" },
    ],

  };

  // default role if not logged in (you can change this)
  const role = user?.role || "DEVELOPER";
  const menuList = menus[role] || [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-lg font-semibold text-blue-600 tracking-wide">
          EMS
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuList.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-5 py-2.5 text-sm rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#E6F0FF] text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;