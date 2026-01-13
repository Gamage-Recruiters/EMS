import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `hover:text-blue-600 ${
      location.pathname === path
        ? "font-semibold text-blue-600"
        : "text-gray-700"
    }`;

  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Team Manager</h2>
      <hr className="mb-4" />

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/user-management" className={linkClass("/user-management")}>
          User Management
        </Link>
      </nav>
    </div>
  );
}
