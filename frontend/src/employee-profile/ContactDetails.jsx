import React from "react";
import { useSearchParams  } from "react-router-dom";

export default function ContactDetails() {

  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";
  return (
    <div className="w-full max-w-4xl p-4 mx-auto">

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Contact Details</h2>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number 1</label>
          <input
            type="text"
            placeholder="Phone Number 1"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number 2</label>
          <input
            type="text"
            placeholder="Phone Number 2"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">E-mail Address</label>
        <input
          type="email"
          placeholder="johndoe@gmail.com"
          className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>

      {/* City */}
      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">City of residence</label>
        <input
          type="text"
          placeholder="Enter City"
          className="w-full md:w-1/3 px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Residential Address */}
      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">Residential Address</label>
        <textarea
          rows={3}
          placeholder="AlemBank, Addis ababa"
          className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        ></textarea>
      </div>

      {/* Button */}
      <button className="mt-10 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        {isEdit ? "Update" : "Add"}
      </button>
    </div>
  );
}
