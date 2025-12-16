export default function TopHeader() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Leave Form</h2>
        <p className="text-sm text-slate-600 mt-1">Monday, December 16, 2024</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status */}
        <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all">
          <option>Available</option>
          <option>Busy</option>
          <option>In a Meeting</option>
          <option>Offline</option>
        </select>

        {/* Notification */}
        <button className="relative h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          JM
        </div>
      </div>
    </header>
  );
}