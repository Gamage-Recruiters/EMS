import React, { useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

export default function PersonalDetails() {
  const { employee, setEmployee, isEdit } = useOutletContext();
  const [previewImage, setPreviewImage] = useState(employee.avatarUrl || null);

  useEffect(() => {
    setPreviewImage(employee.avatarUrl || null);
  }, [employee.avatarUrl]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    // For now store only preview URL; backend can be extended later for real upload.
    setEmployee((prev) => ({
      ...prev,
      avatarUrl: url,
    }));
  };

  return (
    <div className="w-full flex flex-col items-center text-center py-6">
      {/* Profile Image */}
      <div className="relative cursor-pointer">
        <label>
          <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiCamera className="text-gray-600 text-3xl" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Name */}
      <div className="mt-6 w-full max-w-md">
        <label className="text-sm text-gray-500">Employee Name</label>
        <input
          type="text"
          value={employee.fullName}
          onChange={(e) =>
            setEmployee((prev) => ({ ...prev, fullName: e.target.value }))
          }
          placeholder="Enter employee name"
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Department */}
      <div className="mt-6 w-full max-w-md">
        <label className="text-sm text-gray-500">Department</label>
        <input
          type="text"
          value={employee.department}
          onChange={(e) =>
            setEmployee((prev) => ({ ...prev, department: e.target.value }))
          }
          placeholder="Design & Marketing"
          className="w-full mt-1 px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Job Title + Category */}
      <div className="mt-8 w-full max-w-2xl flex justify-center gap-10">
        <div className="w-full max-w-xs">
          <label className="text-sm text-gray-500">Job Title</label>
          <input
            type="text"
            value={employee.jobRole}
            onChange={(e) =>
              setEmployee((prev) => ({ ...prev, jobRole: e.target.value }))
            }
            placeholder="UI / UX Designer"
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="w-full max-w-xs">
          <label className="text-sm text-gray-500">Job Category</label>
          <select
            value={employee.jobCategory}
            onChange={(e) =>
              setEmployee((prev) => ({ ...prev, jobCategory: e.target.value }))
            }
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          >
            <option value="">Select</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
          </select>
        </div>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        {isEdit
          ? "You are editing an existing employee. Use the top Update button to save."
          : "You are creating a new employee. Use the top Create button to save."}
      </p>
    </div>
  );
}
