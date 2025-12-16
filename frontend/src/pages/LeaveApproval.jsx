import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

export default function LeaveApproval() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        <div>
          <TopHeader />
          <p className="mt-1 text-sm text-slate-500">
            Manage employee leave requests and approvals.
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3">
          <input
            placeholder="Search employee / email / team"
            className="w-full md:flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <div className="flex gap-3">
            <select className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-200">
              <option>Status: All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <select className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-200">
              <option>Team: All</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>QA</option>
              <option>DevOps</option>
              <option>Mobile</option>
            </select>
          </div>
        </div>

        {/* Compact stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi title="Pending" value="8" badge="Needs review" />
          <Kpi title="Approved (Week)" value="12" badge="On track" />
          <Kpi title="Rejected (Week)" value="3" badge="Review reason" />
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Leave Requests</h3>
            <button className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <Th>Employee</Th>
                  <Th>Team</Th>
                  <Th>Type</Th>
                  <Th>Dates</Th>
                  <Th>Days</Th>
                  <Th>Status</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                <Row
                  name="Kasun Perera"
                  email="kasun.perera@company.lk"
                  team="Backend"
                  type="Sick leave"
                  dates="Dec 18 → Dec 20"
                  days="3"
                  status="Pending"
                />
                <Row
                  name="Nimali Fernando"
                  email="nimali.fernando@company.lk"
                  team="Frontend"
                  type="Study Leave"
                  dates="Dec 28 → Jan 02"
                  days="6"
                  status="Pending"
                />
                <Row
                  name="Dinuka Silva"
                  email="dinuka.silva@company.lk"
                  team="QA"
                  type="Personal leave"
                  dates="Dec 22 → Dec 22"
                  days="1"
                  status="Approved"
                />
                <Row
                  name="Chamod Jayasinghe"
                  email="chamod.j@company.lk"
                  team="DevOps"
                  type="Emergency"
                  dates="Dec 15 → Dec 15"
                  days="1"
                  status="Rejected"
                />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* small UI helpers */
function Th({ children, align }) {
  return (
    <th className={`px-5 py-3 text-left font-semibold whitespace-nowrap ${align === "right" ? "text-right" : ""}`}>
      {children}
    </th>
  );
}

function Row({ name, email, team, type, dates, days, status }) {
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
      <td className="px-5 py-4 whitespace-nowrap"><Pill status={status} /></td>
      <td className="px-5 py-4 whitespace-nowrap text-right">
        <div className="inline-flex gap-2">
          <button className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50">
            View
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:opacity-95">
            Approve
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50">
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}

function Pill({ status }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  if (status === "Approved") return <span className={`${base} bg-green-50 text-green-700 border border-green-200`}>Approved</span>;
  if (status === "Rejected") return <span className={`${base} bg-red-50 text-red-700 border border-red-200`}>Rejected</span>;
  return <span className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}>Pending</span>;
}

function Kpi({ title, value, badge }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
          {badge}
        </span>
      </div>
    </div>
  );
}
