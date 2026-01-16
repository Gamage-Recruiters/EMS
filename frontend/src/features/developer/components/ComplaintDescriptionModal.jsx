import { FiX } from "react-icons/fi";

export default function ComplaintDescriptionModal({ complaint, onClose }) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-800"
        >
          <FiX />
        </button>

        <h2 className="text-lg font-semibold mb-1">{complaint.subject}</h2>

        <p className="text-xs text-slate-500 mb-4">
          Submitted on {new Date(complaint.createdAt).toLocaleString()}
        </p>

        <div className="text-sm text-slate-700 whitespace-pre-wrap">
          {complaint.description}
        </div>
      </div>
    </div>
  );
}
