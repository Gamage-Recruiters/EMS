export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center">
          <span className="text-lg">👥</span>
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">EMS Portal</h1>
          <p className="text-xs text-slate-500">Employee System</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="px-3 py-3 space-y-1">
        <SideItem label="Attendance" active={false} />
        <SideItem label="Calendar" active={false} />
        <SideItem label="Leave Request" active={true} />
        <SideItem label="Leave Status" active={false} />
        <SideItem label="Reports" active={false} />
        <SideItem label="Settings" active={false} />
      </nav>

      {/* Profile */}
      <div className="mt-auto border-t border-slate-200 px-6 py-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
          JM
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">John Mitchell</p>
          <p className="text-xs text-slate-500">Software Engineer</p>
        </div>
      </div>
    </aside>
  );
}

function SideItem({ label, active }) {
  return (
    <div
      className={[
        "px-4 py-3 rounded-xl cursor-pointer select-none",
        active
          ? "bg-indigo-50 text-indigo-700 font-semibold"
          : "text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
