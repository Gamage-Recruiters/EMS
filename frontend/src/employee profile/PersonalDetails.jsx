import React, { useState } from "react";
import { FiCamera } from "react-icons/fi";
import { useOutletContext,useSearchParams   } from "react-router-dom";


export default function PersonalDetails() {
  const [image, setImage] = useState(null);
  const { jobData, setJobData } = useOutletContext();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";

  // Handle image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center py-6">
      {/* Profile Image Upload */}
      <div className="relative cursor-pointer">
        {/* Clickable Circle */}
        <label>
          <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiCamera className="text-gray-600 text-3xl" />
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Employee Name */}
      <div className="mt-6 w-full max-w-md">
        <label className="text-sm text-gray-500">Employee Name</label>
        <input
          type="text"
          placeholder="Enter employee name"
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Department */}
      <div className="mt-6 w-full max-w-md">
        <label className="text-sm text-gray-500">Department</label>
        <input
          type="text"
          value={jobData.department}
          onChange={(e) =>
            setJobData({ ...jobData, department: e.target.value })
          }
          placeholder="Design & Marketing"
          className="w-full mt-1 px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Job Title + Job Category */}
      <div className="mt-8 w-full max-w-2xl flex justify-center gap-10">
        <div className="w-full max-w-xs">
          <label className="text-sm text-gray-500">Job Title</label>
          <input
          type="text"
          value={jobData.jobRole}
          onChange={(e) =>
            setJobData({ ...jobData, jobRole: e.target.value })
          }
          placeholder="UI / UX Designer"
          className="w-full mt-1 px-4 py-2 border rounded-lg"
        />
        </div>
        <div className="w-full max-w-xs">
          <label className="text-sm text-gray-500">Job Category</label>
          <select
          value={jobData.jobCategory}
          onChange={(e) =>
            setJobData({ ...jobData, jobCategory: e.target.value })
          }
          className="w-full mt-1 px-4 py-2 border rounded-lg"
        >
          <option value="">Select</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>
        </div>
      </div>

      {/*  Button */}
      <button className="mt-10 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      {isEdit ? "Update" : "Add"}
    </button>
    </div>
  );
}
