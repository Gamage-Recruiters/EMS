import React from "react";
import { useOutletContext } from "react-router-dom";

export default function EducationQualification() {
  const { employee, setEmployee, isEdit } = useOutletContext();
  const education = employee.education || {};

  const today = new Date().toISOString().split("T")[0];

  const updateEducation = (patch) => {
    setEmployee((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        ...patch,
      },
    }));
  };

  const startDate = education.startDate || "";
  const endDate = education.endDate || "";
  const invalidRange = startDate && endDate && endDate < startDate;

  return (
    <div className="w-full max-w-4xl p-4 mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Education Qualification</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Name of Institution
          </label>
          <input
            type="text"
            value={education.institution || ""}
            onChange={(e) =>
              updateEducation({ institution: e.target.value })
            }
            placeholder="Colombo university"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Department
          </label>
          <input
            type="text"
            value={education.department || ""}
            onChange={(e) =>
              updateEducation({ department: e.target.value })
            }
            placeholder="Computer Department"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Course</label>
          <input
            type="text"
            value={education.course || ""}
            onChange={(e) => updateEducation({ course: e.target.value })}
            placeholder="Computer Science"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Location</label>
          <input
            type="text"
            value={education.location || ""}
            onChange={(e) => updateEducation({ location: e.target.value })}
            placeholder="Colombo Sri Lanka"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => updateEducation({ startDate: e.target.value })}
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => updateEducation({ endDate: e.target.value })}
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {invalidRange && (
        <p className="text-red-600 text-sm mt-2">
          ❌ End date cannot be earlier than Start date.
        </p>
      )}

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          value={education.description || ""}
          onChange={(e) =>
            updateEducation({ description: e.target.value })
          }
          placeholder="Summary of key academic achievements, projects, etc."
          className="w-full px-4 py-3 text-gray-700 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>

      <p className="mt-10 text-sm text-gray-500">
        These qualifications will be stored with the employee record when you{" "}
        <span className="font-semibold">
          {isEdit ? "update" : "create"}
        </span>{" "}
        the profile.
      </p>
    </div>
  );
}
