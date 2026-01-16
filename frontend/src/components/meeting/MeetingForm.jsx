import React from "react";

const MeetingForm = ({ meetingData, onChange }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Meeting Details</h2>

      {/* Title */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Meeting Title
      </label>
      <input
        className="w-full px-4 py-2.5 rounded-xl border mb-4"
        value={meetingData.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full px-4 py-2.5 rounded-xl border"
            value={meetingData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            className="w-full px-4 py-2.5 rounded-xl border"
            value={meetingData.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
        </div>
      </div>

      {/* Duration */}
      <div className="mt-4">
        <label className="text-sm font-medium">
          Duration <span className="text-xs text-gray-500">(minutes)</span>
        </label>

        <input
          type="number" // ✅ numeric only
          min="1" // ✅ prevents 0 & negatives
          step="1" // ✅ whole numbers only
          className="w-full px-4 py-2.5 rounded-xl border"
          value={meetingData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          placeholder="Enter duration in minutes"
        />
      </div>

      {/* Meeting Type */}
      <div className="mt-4">
        <label className="text-sm font-medium">Meeting Type</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Daily Standup",
            "Sprint Planning",
            "Code Review",
            "Special Meeting",
          ].map((type) => (
            <button
              key={type}
              type="button"
              className={`px-4 py-2 rounded-xl border ${
                meetingData.meetingType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
              onClick={() => handleChange("meetingType", type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mt-5">
        <label className="text-sm font-medium">Location</label>

        <div className="flex gap-6 mt-2">
          <label>
            <input
              type="radio"
              checked={meetingData.locationType === "online"}
              onChange={() => handleChange("locationType", "online")}
            />{" "}
            Online
          </label>

          <label>
            <input
              type="radio"
              checked={meetingData.locationType === "in-person"}
              onChange={() => handleChange("locationType", "in-person")}
            />{" "}
            In-Person
          </label>
        </div>

        {meetingData.locationType === "online" && (
          <input
            className="w-full px-4 py-2.5 rounded-xl border mt-3"
            placeholder="Meeting link"
            value={meetingData.meetingLink}
            onChange={(e) => handleChange("meetingLink", e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingForm;
