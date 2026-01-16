export default function PendingStats({ tasks }) {
  const pmPending = tasks.filter((t) => t.pmCheck === "Pending").length;
  const tlPending = tasks.filter((t) => t.teamLeadCheck === "Pending").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Total Tasks" value={tasks.length} />
      <StatCard label="PM Pending" value={pmPending} />
      <StatCard label="TL Pending" value={tlPending} />
      <StatCard
        label="Completed"
        value={tasks.filter((t) => t.status === "Completed").length}
      />
    </div>
  );
}

const StatCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-blue-600">{value}</div>
    <div className="text-xs text-slate-500 mt-1">{label}</div>
  </div>
);
