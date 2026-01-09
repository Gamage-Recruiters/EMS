import React from "react";
import { FiPhone, FiHome } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

export default function ContactDetails() {
  const { employee, setEmployee, isView } = useOutletContext();

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
            Contact Number
          </label>
          <input
            type="tel"
            value={employee.contactNumber || ""}
            onChange={(e) =>
              setEmployee((prev) => ({
                ...prev,
                contactNumber: e.target.value,
              }))
            }
            placeholder="+1 (555) 123-4567"
            disabled={isView}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
              isView ? "bg-gray-50 cursor-not-allowed text-gray-600" : "bg-white"
            }`}
          />
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
      </div>
    </div>
  );
}
