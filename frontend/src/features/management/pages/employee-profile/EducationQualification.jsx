import React from "react";
import { FiBook, FiCheckCircle } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

export default function EducationQualification() {
  const { employee, setEmployee, isView } = useOutletContext();

  const edu = employee.education || {};

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiBook className="text-purple-600" />
          Education Qualification
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Academic background and certifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Institution + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Institution
            </label>
            <input
              type="text"
              value={edu.institution || ""}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  education: { ...prev.education, institution: e.target.value },
                }))
              }
              placeholder="e.g., MIT, Stanford"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={edu.department || ""}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  education: { ...prev.education, department: e.target.value },
                }))
              }
              placeholder="e.g., Computer Science"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Degree + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Degree
            </label>
            <input
              type="text"
              value={edu.degree || ""}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  education: { ...prev.education, degree: e.target.value },
                }))
              }
              placeholder="e.g., Bachelor of Science"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={edu.location || ""}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  education: { ...prev.education, location: e.target.value },
                }))
              }
              placeholder="e.g., Cambridge, MA"
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Start Date + End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={
                edu.startDate
                  ? new Date(edu.startDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  education: { ...prev.education, startDate: e.target.value },
                }))
              }
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={
                edu.endDate
                  ? new Date(edu.endDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  education: { ...prev.education, endDate: e.target.value },
                }))
              }
              disabled={isView}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isView
                  ? "bg-gray-50 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Validation Info */}
        {edu.degree && edu.institution && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <FiCheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-900">
              <span className="font-semibold">Education record complete</span> —
              All required fields filled
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
