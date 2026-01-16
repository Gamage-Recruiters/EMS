const colors = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Pending: "bg-amber-100 text-amber-800",
  "Not Started": "bg-amber-100 text-amber-800",
  Blocked: "bg-red-100 text-red-800",
  Done: "bg-green-100 text-green-800",
  Issue: "bg-red-100 text-red-800",
  "Not Completed": "bg-gray-100 text-gray-700",
};

export default function StatusBadge({ label }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[label] || "bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}
