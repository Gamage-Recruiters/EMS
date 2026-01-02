import React from "react";
import { ArrowLeft } from "lucide-react";

const MeetingHeader = ({ title, subtitle, onSubmit, onCancel, submitLabel }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Cancel
        </button>

        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow"
        >
          {submitLabel}
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default MeetingHeader;
