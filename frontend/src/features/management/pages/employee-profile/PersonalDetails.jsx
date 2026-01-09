import React, { useEffect, useRef, useState } from "react";
import { FiCamera, FiUser } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

export default function PersonalDetails() {
  const {
    employee,
    setEmployee,
    isView,
    isAdd,
    isEdit,
    saving,
    fieldErrors,
    setFieldErrors,
    onNext,
  } = useOutletContext();

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(
    employee?.profileImage || null
  );

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

  const clearField = (name) => {
    setFieldErrors?.((p) => ({ ...p, [name]: undefined }));
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
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={employee.firstName || ""}
              onChange={(e) => {
                clearField("firstName");
                setEmployee((prev) => ({ ...prev, firstName: e.target.value }));
              }}
              placeholder="John"
              disabled={isView}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600 border-gray-300"
                  : fieldErrors?.firstName
                  ? "bg-white border-red-300"
                  : "bg-white border-gray-300"
              }`}
            />
            {fieldErrors?.firstName && (
              <p className="text-xs text-red-600 mt-2">{fieldErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={employee.lastName || ""}
              onChange={(e) => {
                clearField("lastName");
                setEmployee((prev) => ({ ...prev, lastName: e.target.value }));
              }}
              placeholder="Doe"
              disabled={isView}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600 border-gray-300"
                  : fieldErrors?.lastName
                  ? "bg-white border-red-300"
                  : "bg-white border-gray-300"
              }`}
            />
            {fieldErrors?.lastName && (
              <p className="text-xs text-red-600 mt-2">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email + Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={employee.email || ""}
              onChange={(e) => {
                clearField("email");
                setEmployee((prev) => ({ ...prev, email: e.target.value }));
              }}
              placeholder="john@example.com"
              disabled={isView}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600 border-gray-300"
                  : fieldErrors?.email
                  ? "bg-white border-red-300"
                  : "bg-white border-gray-300"
              }`}
            />
            {fieldErrors?.email && (
              <p className="text-xs text-red-600 mt-2">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password {isAdd ? <span className="text-red-500">*</span> : null}
            </label>
            <input
              type="password"
              value={employee.password || ""}
              onChange={(e) => {
                clearField("password");
                setEmployee((prev) => ({ ...prev, password: e.target.value }));
              }}
              placeholder={
                isView
                  ? ""
                  : isAdd
                  ? "Enter a password"
                  : "Leave blank to keep unchanged"
              }
              disabled={isView}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600 border-gray-300"
                  : fieldErrors?.password
                  ? "bg-white border-red-300"
                  : "bg-white border-gray-300"
              }`}
            />
            {!isView && isEdit && (
              <p className="text-xs text-gray-500 mt-2">
                Leave blank to keep the current password.
              </p>
            )}
            {!isView && isAdd && (
              <p className="text-xs text-gray-500 mt-2">
                Minimum 6 characters.
              </p>
            )}
            {fieldErrors?.password && (
              <p className="text-xs text-red-600 mt-2">{fieldErrors.password}</p>
            )}
          </div>
        </div>

        {/* Wizard: Next (ADD only) */}
        {isAdd && !isView && (
          <div className="flex justify-end pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onNext}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-medium rounded-lg transition"
            >
              {saving ? "Saving…" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
