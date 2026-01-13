const tone = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Pending: "bg-amber-100 text-amber-800",
  "Not Started": "bg-amber-100 text-amber-800",
  Blocked: "bg-red-100 text-red-800",
  "Not Completed": "bg-gray-100 text-gray-700",
};

function StatusBadge({ label }) {
  const style = tone[label] || "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
