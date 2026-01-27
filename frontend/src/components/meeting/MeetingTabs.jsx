import React from "react";

const MeetingTabs = ({ active, setActive }) => {
  const tabs = ["All", "Upcoming", "Past", "Cancelled"];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActive(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              active === tab
                ? "bg-purple-600 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-50"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default MeetingTabs;
