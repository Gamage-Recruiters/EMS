export default function TopHeader() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Leave Form</h2>
        <p className="mt-1 text-sm text-slate-500">Monday, December 2, 2024</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Status:</span>
          <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200">
            <option>Available</option>
            <option>Busy</option>
            <option>In a Meeting</option>
            <option>Offline</option>
          </select>
        </div>

        {/* Bell */}
        <button className="relative h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">
          <span className="text-lg">🔔</span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
          👤
        </div>
      </div>
    </header>
  );
}
