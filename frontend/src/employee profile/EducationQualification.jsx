import React, {useState} from "react";

export default function EducationQualification() {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDate = (e) => {
    const value = e.target.value;
    setStartDate(value);

    // If end date is before selected start date → reset it
    if (endDate && endDate < value) {
      setEndDate("");
    }
  };

  const handleEndDate = (e) => {
    const value = e.target.value;
    setEndDate(value);
  };

  return (
    <div className="w-full max-w-4xl p-4 mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Education Qualification</h2>

      {/* Name of the institution and Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Name of Institution
          </label>
          <input
            type="text"
            placeholder="Colombo university"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Department</label>
          <input
            type="text"
            placeholder="Computer Department"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Course and location */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Course</label>
          <input
            type="text"
            placeholder="Computer Science"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Location</label>
          <input
            type="text"
            placeholder="Colombo Sri Lanka"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Start and End date */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={handleStartDate}
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            min={startDate || today} // <-- prevents choosing a date earlier than start date
            value={endDate}
            onChange={handleEndDate}
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Error Message */}
      {startDate && endDate && endDate < startDate && (
        <p className="text-red-600 text-sm mt-2">
          ❌ End date cannot be earlier than Start date.
        </p>
      )}

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-2">Description</label>

        <ul className="list-disc pl-8 w-full px-4 py-3 text-gray-700 space-y-2 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200">
          <li>Completed coursework related to the field</li>
          <li>Participated in academic projects and research</li>
          <li>Gained practical experience through labs and assignments</li>
        </ul>
      </div>

      {/* Button */}
      <button className="mt-10 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Update
      </button>
    </div>
  );
}
