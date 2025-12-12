import React from "react";

const MeetingForm = ({ meetingData, onMeetingDataChange }) => {
  const handleChange = (field, value) => {
    onMeetingDataChange({ ...meetingData, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Meeting Details</h2>

      {/* Title */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
      <input
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter meeting title..."
        value={meetingData.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
            value={meetingData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input
            type="time"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
            value={meetingData.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
        </div>
      </div>

      {/* Duration */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
        <input
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter duration..."
          value={meetingData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
        />
      </div>

      {/* Meeting Type Buttons */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>

        <div className="grid grid-cols-2 gap-3">
          {["Daily Standup", "Sprint Planning", "Code Review", "Special Meeting"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-xl border text-sm ${
                meetingData.meetingType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => handleChange("meetingType", type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Location Section */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Location / Meeting Link</label>

        <div className="flex gap-6 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={meetingData.locationType === "online"}
              onChange={() => handleChange("locationType", "online")}
            />
            Online Meeting
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={meetingData.locationType === "in-person"}
              onChange={() => handleChange("locationType", "in-person")}
            />
            In-Person
          </label>
        </div>

        {meetingData.locationType === "online" && (
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Add meeting link..."
            value={meetingData.meetingLink}
            onChange={(e) => handleChange("meetingLink", e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingForm;
