export default function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white text-lg">
            👥
          </div>
          <div>
            <h1 className="font-bold text-white">EMS Portal</h1>
            <p className="text-xs text-slate-400">Employee System</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <MenuItem label="Attendance" />
        <MenuItem label="Calendar" />
        <MenuItem label="Leave Request" active />
        <MenuItem label="Leave Status" />
        <MenuItem label="Reports" />
        <MenuItem label="Settings" />
      </nav>

      {/* Profile */}
      <div className="px-6 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
            JM
          </div>
          <div>
            <p className="text-sm font-semibold text-white">John Mitchell</p>
            <p className="text-xs text-slate-400">Software Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MenuItem({ label, active }) {
  return (
    <div
      className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-700"
      }`}
    >
      {label}
    </div>
  );
}