import React from "react";
import { FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const POSITION_OPTIONS = [
  "Member",
  "Team Lead",
  "Project Manager",
  "Assistance Team Lead",
  "QA Lead",
  "Maintenance Lead",
  "UIUX Lead",
  "Full Stack Lead",
  "Admin Lead",
];

export default function JobDetails() {
  const {
    employee,
    setEmployee,
    isView,
  } = useOutletContext();
  const { user } = useAuth();
  const isCEO = user?.role === "CEO";
  const canEditJob = isCEO && !isView;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiBriefcase className="text-blue-600" />
          Job Details
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Employment role and responsibilities
        </p>
      </div>

      <div className="space-y-6">
        {/* Role + Designation + Department */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={employee.role || ""}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, role: e.target.value }))
              }
              disabled={!canEditJob}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                !canEditJob ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            >
              <option value="">Select role</option>
              <option value="CEO">CEO</option>
              <option value="SystemAdmin">System Admin</option>
              <option value="TL">Team Lead</option>
              <option value="ATL">Assistant Team Lead</option>
              <option value="PM">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Position / Designation
            </label>
            <select
              value={employee.designation || ""}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  designation: e.target.value,
                }))
              }
              disabled={!canEditJob}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                !canEditJob ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            >
              <option value="">Select a position</option>
              {POSITION_OPTIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={employee.department || ""}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, department: e.target.value }))
              }
              placeholder="e.g., Engineering"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-3">
          {isCEO
            ? "As CEO, you can choose a predefined position or enter a custom designation."
            : "Only the CEO may update role or position from employee details. Other fields remain viewable."}
        </div>

        {/* Joined Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date Joined
          </label>
          <input
            type="date"
            value={
              employee.joinedDate
                ? new Date(employee.joinedDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setEmployee((prev) => ({ ...prev, joinedDate: e.target.value }))
            }
            disabled={isView}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
            }`}
          />
        </div>

        {/* Validation Info */}
        {employee.designation && employee.department && (
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <FiCheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Job details complete</span> —
              Employee role and department set
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
