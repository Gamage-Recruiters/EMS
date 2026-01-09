import React from "react";
import { FiPhone, FiHome, FiMapPin } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

export default function ContactDetails() {
  const {
    employee,
    setEmployee,
    isView,
    isAdd,
    saving,
    fieldErrors,
    setFieldErrors,
    onNext,
    onBack,
  } = useOutletContext();

  const clearField = (name) => {
    setFieldErrors?.((p) => ({ ...p, [name]: undefined }));
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiPhone className="text-emerald-600" />
          Contact Details
        </h2>
        <p className="text-gray-600 text-sm mt-2">How to reach this employee</p>
      </div>

      <div className="space-y-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiPhone className="w-4 h-4 text-emerald-600" />
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={employee.contactNumber || ""}
            onChange={(e) => {
              clearField("contactNumber");
              setEmployee((prev) => ({
                ...prev,
                contactNumber: e.target.value,
              }));
            }}
            placeholder="07XXXXXXXX or +947XXXXXXXX"
            disabled={isView}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
              isView
                ? "bg-gray-50 cursor-not-allowed text-gray-600 border-gray-300"
                : fieldErrors?.contactNumber
                ? "bg-white border-red-300"
                : "bg-white border-gray-300"
            }`}
          />
          {fieldErrors?.contactNumber && (
            <p className="text-xs text-red-600 mt-2">
              {fieldErrors.contactNumber}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiHome className="w-4 h-4 text-emerald-600" />
            Address
          </label>
          <input
            type="text"
            value={employee.address || ""}
            onChange={(e) =>
              setEmployee((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            placeholder="123 Main Street"
            disabled={isView}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
              isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
            }`}
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-emerald-600" />
            City
          </label>
          <input
            type="text"
            value={employee.city || ""}
            onChange={(e) =>
              setEmployee((prev) => ({
                ...prev,
                city: e.target.value,
              }))
            }
            placeholder="e.g., Colombo"
            disabled={isView}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
              isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
            }`}
          />
        </div>

        {/* Wizard: Back/Next (ADD only) */}
        {isAdd && !isView && (
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
