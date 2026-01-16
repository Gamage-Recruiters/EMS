export default function ComplaintStats({ complaints }) {
  const total = complaints.length;
  const inReview = complaints.filter((c) => c.status === "In Review").length;
  const solved = complaints.filter((c) => c.status === "Solved").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <Stat label="Total Complaints" value={total} />
      <Stat label="In Review" value={inReview} />
      <Stat label="Solved" value={solved} />
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-blue-600">{value}</div>
    <div className="text-xs text-slate-500 mt-1">{label}</div>
  </div>
);
