import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

export default function LeaveApproval() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          {/* Reuse your header */}
          <TopHeader />

          {/* Small page hint */}
          <p className="mt-2 text-sm text-slate-500">
            Review pending leave requests and approve or reject.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by employee name / email / team..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 md:flex gap-3">
            <select className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <select className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
              <option>All Teams</option>
              <option>Frontend Team</option>
              <option>Backend Team</option>
              <option>QA Team</option>
              <option>DevOps Team</option>
              <option>Mobile Team</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Pending Requests" value="08" tone="amber" />
          <StatCard title="Approved This Week" value="12" tone="green" />
          <StatCard title="Rejected This Week" value="03" tone="red" />
          <StatCard title="Total Requests" value="41" tone="indigo" />
        </div>

        {/* Requests table */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Leave Requests</h3>
            <div className="text-xs text-slate-500">
              Showing latest requests
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <Th>Employee</Th>
                  <Th>Team</Th>
                  <Th>Leave Type</Th>
                  <Th>Dates</Th>
                  <Th>Days</Th>
                  <Th>Status</Th>
                  <Th align="right">Action</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                <Tr
                  name="Kasun Perera"
                  email="kasun.perera@company.lk"
                  team="Backend Team"
                  type="Sick leave"
                  dates="2025-12-18 → 2025-12-20"
                  days="3"
                  status="Pending"
                />
                <Tr
                  name="Dinuka Silva"
                  email="dinuka.silva@company.lk"
                  team="QA Team"
                  type="Personal leave"
                  dates="2025-12-22 → 2025-12-22"
                  days="1"
                  status="Approved"
                />
                <Tr
                  name="Nimali Fernando"
                  email="nimali.fernando@company.lk"
                  team="Frontend Team"
                  type="Study Leave"
                  dates="2025-12-28 → 2026-01-02"
                  days="6"
                  status="Pending"
                />
                <Tr
                  name="Chamod Jayasinghe"
                  email="chamod.j@company.lk"
                  team="DevOps Team"
                  type="Emergency leave"
                  dates="2025-12-15 → 2025-12-15"
                  days="1"
                  status="Rejected"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Details panel (UI only) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
            <h4 className="font-bold text-slate-900">Request Details</h4>
            <p className="text-sm text-slate-500 mt-1">
              Select a request to view details (demo panel).
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Employee" value="Nimali Fernando" />
              <Info label="Email" value="nimali.fernando@company.lk" />
              <Info label="Team" value="Frontend Team" />
              <Info label="Leave Type" value="Study Leave" />
              <Info label="From" value="2025-12-28" />
              <Info label="To" value="2026-01-02" />
              <Info label="Days" value="6" />
              <Info label="Status" value="Pending" />
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-800">Reason</p>
              <div className="mt-2 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 bg-slate-50">
                Need study leave for exams and project submission preparations.
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button className="px-5 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50">
                Request More Info
              </button>

              <button className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:opacity-95">
                Reject
              </button>

              <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-semibold hover:opacity-95">
                Approve
              </button>
            </div>
          </div>

          {/* Quick guidelines */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h4 className="font-bold text-slate-900">Approval Guidelines</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Confirm leave balance / eligibility</li>
              <li>• Check team workload before approval</li>
              <li>• Validate medical/attachments if needed</li>
              <li>• Approve early to avoid schedule conflicts</li>
            </ul>

            <div className="mt-5 border border-slate-200 rounded-xl p-4 bg-slate-50">
              <p className="text-sm font-semibold text-slate-800">
                Quick Tip
              </p>
              <p className="text-sm text-slate-600 mt-1">
                If multiple employees request same dates, prioritize critical roles.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function Th({ children, align }) {
  return (
    <th
      className={[
        "text-left font-semibold px-5 py-3 whitespace-nowrap",
        align === "right" ? "text-right" : "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Tr({ name, email, team, type, dates, days, status }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-5 py-4">
        <div className="font-semibold text-slate-900">{name}</div>
        <div className="text-xs text-slate-500">{email}</div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-slate-700">{team}</td>
      <td className="px-5 py-4 whitespace-nowrap text-slate-700">{type}</td>
      <td className="px-5 py-4 whitespace-nowrap text-slate-700">{dates}</td>
      <td className="px-5 py-4 whitespace-nowrap text-slate-700">{days}</td>
      <td className="px-5 py-4 whitespace-nowrap">
        <StatusPill status={status} />
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50">
            View
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:opacity-95">
            Reject
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-700 text-white hover:opacity-95">
            Approve
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  if (status === "Approved")
    return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
  if (status === "Rejected")
    return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
  return <span className={`${base} bg-amber-100 text-amber-700`}>Pending</span>;
}

function StatCard({ title, value, tone }) {
  const toneMap = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${toneMap[tone]}`}>
          Weekly
        </span>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
