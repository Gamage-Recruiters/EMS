// PersonalDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiCamera, FiUser } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

export default function PersonalDetails() {
  const { employee, setEmployee, isView } = useOutletContext();
  const fileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(employee?.profileImage || null);

  // Keep preview in sync when employee loads in edit/view mode
  useEffect(() => {
    setPreviewImage(employee?.profileImage || null);
  }, [employee?.profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result;
      setPreviewImage(base64String);
      setEmployee((prev) => ({
        ...prev,
        profileImage: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiUser className="text-blue-600" />
          Personal Details
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Basic information about the employee
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Profile Photo
          </label>
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {!isView && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                  <FiCamera className="w-5 h-5" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isView}
                className="hidden"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Upload photo</p>
              <p className="text-xs">JPG, PNG or GIF (Max. 5MB)</p>
            </div>
          </div>
        </div>

        {/* First Name + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={employee.firstName || ""}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="John"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={employee.lastName || ""}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="Doe"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Email + Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={employee.email || ""}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="john@example.com"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={employee.password || ""}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder={isView ? "" : "Leave blank to keep unchanged"}
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
              }`}
            />
            {!isView && (
              <p className="text-xs text-gray-500 mt-2">
                Leave blank to keep the current password.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
