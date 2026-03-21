import React from "react";
import { useOutletContext } from "react-router-dom";

const PersonalDetailsPage = () => {
  const { employee, setEmployee, isEdit, isView, isAdd } = useOutletContext();

  const isEditable = isEdit || isAdd;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInitials = () => {
    const first = employee?.firstName?.charAt(0)?.toUpperCase() || "";
    const last = employee?.lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "U";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          {isView
            ? "View employee personal information."
            : isEdit
            ? "Update employee personal information."
            : "Enter employee personal information."}
        </p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        {employee?.profileImage ? (
          <img
            src={employee.profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-sm"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
            {getInitials()}
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">
          {isEditable
            ? "Fill in the employee's basic profile information."
            : "Employee profile preview"}
        </p>
      </div>

      {/* Form / View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          {isEditable ? (
            <input
              type="text"
              name="firstName"
              value={employee.firstName || ""}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          ) : (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {employee.firstName || "-"}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          {isEditable ? (
            <input
              type="text"
              name="lastName"
              value={employee.lastName || ""}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          ) : (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {employee.lastName || "-"}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          {isEditable ? (
            <input
              type="email"
              name="email"
              value={employee.email || ""}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          ) : (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {employee.email || "-"}
            </div>
          )}
        </div>

        {/* Password - only for add/edit */}
        {isEditable && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isAdd ? (
                <>
                  Password <span className="text-red-500">*</span>
                </>
              ) : (
                "New Password"
              )}
            </label>
            <input
              type="password"
              name="password"
              value={employee.password || ""}
              onChange={handleChange}
              placeholder={
                isAdd
                  ? "Enter password"
                  : "Leave blank if you do not want to change password"
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                Leave this blank to keep the current password unchanged.
              </p>
            )}
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          {isEditable ? (
            <select
              name="role"
              value={employee.role || "Unassigned"}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Unassigned">Unassigned</option>
              <option value="CEO">CEO</option>
              <option value="SystemAdmin">SystemAdmin</option>
              <option value="TL">TL</option>
              <option value="PM">PM</option>
              <option value="Developer">Developer</option>
            </select>
          ) : (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {employee.role || "-"}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          {isEditable ? (
            <select
              name="status"
              value={employee.status || "Active"}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          ) : (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {employee.status || "-"}
            </div>
          )}
        </div>

        {/* Joined Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Joined Date
          </label>
          {isEditable ? (
            <input
              type="date"
              name="joinedDate"
              value={employee.joinedDate || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          ) : (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {employee.joinedDate || "-"}
            </div>
          )}
        </div>

        {/* Profile Image Upload */}
        {isEditable && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setEmployee((prev) => ({
                  ...prev,
                  profileFile: file,
                  profileImage: URL.createObjectURL(file),
                }));
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a profile image if needed.
            </p>
          </div>
        )}
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Preview Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Full Name:</span>{" "}
            <span className="font-medium text-gray-900">
              {[employee.firstName, employee.lastName].filter(Boolean).join(" ") || "-"}
            </span>
          </div>

          <div>
            <span className="text-gray-500">Email:</span>{" "}
            <span className="font-medium text-gray-900">
              {employee.email || "-"}
            </span>
          </div>

          <div>
            <span className="text-gray-500">Role:</span>{" "}
            <span className="font-medium text-gray-900">
              {employee.role || "-"}
            </span>
          </div>

          <div>
            <span className="text-gray-500">Status:</span>{" "}
            <span className="font-medium text-gray-900">
              {employee.status || "-"}
            </span>
          </div>

          <div>
            <span className="text-gray-500">Joined Date:</span>{" "}
            <span className="font-medium text-gray-900">
              {employee.joinedDate || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsPage;