import React, { useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { employeeService } from "../services/employeeService";

export default function JobDetails() {
  const { employee, setEmployee } = useOutletContext();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";
  const employeeId = searchParams.get("id");

  const [savingRole, setSavingRole] = useState(false);
  const [roleError, setRoleError] = useState(null);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setEmployee((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleRoleSave = async () => {
    if (!employeeId) {
      alert("Employee ID missing – save the profile first.");
      return;
    }
    try {
      setSavingRole(true);
      setRoleError(null);
      await employeeService.updateRole(employeeId, employee.role);
      alert("Role updated successfully.");
    } catch (err) {
      console.error(err);
      setRoleError("Failed to update role.");
    } finally {
      setSavingRole(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      <h3 className="text-sm text-gray-500 mb-4">
        {isEdit ? "View / Edit Job Details" : "Job Details (for new profile)"}
      </h3>

      {/* Job role summary */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500">Job Title</p>
        <h2 className="text-xl font-semibold">
          {employee.jobRole || "—"}
        </h2>
      </div>

      {/* Department & Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-10">
        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p className="font-semibold">
            {employee.department || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Team</p>
          <p className="font-semibold">
            {employee.team || "Not assigned"}
          </p>
        </div>
      </div>

      {/* Role / Position edit UI */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3">Role / Position</h3>
        <p className="text-sm text-gray-500 mb-2">
          This controls the employee&apos;s position in the hierarchy (e.g. Employee,
          Team Lead, Manager).
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={employee.role || ""}
            onChange={handleRoleChange}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg"
            disabled={!isEdit}
          >
            <option value="">Select role</option>
            <option value="employee">Employee</option>
            <option value="team_lead">Team Lead</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
          </select>

          {isEdit && (
            <button
              onClick={handleRoleSave}
              disabled={savingRole}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {savingRole ? "Saving…" : "Update Role"}
            </button>
          )}
        </div>

        {roleError && (
          <p className="mt-2 text-sm text-red-600">{roleError}</p>
        )}
      </div>

      {/* Job description (can be static or later powered from backend) */}
      <div>
        <h3 className="text-center font-semibold mb-4">Job Description</h3>
        <p className="text-sm text-gray-600 mb-3">
          Typical responsibilities for this role include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>
            Delivering assigned tasks and collaborating with the project team.
          </li>
          <li>
            Participating in sprint planning, reviews, and retrospectives.
          </li>
          <li>
            Communicating actively with managers and team members.
          </li>
          <li>
            Following company standards, policies, and guidelines.
          </li>
        </ul>
      </div>
    </div>
  );
}
