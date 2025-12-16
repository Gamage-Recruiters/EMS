import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

export default function LeaveForm() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <TopHeader />

        {/* Form card */}
        <div className="mt-6 grid place-items-center">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 md:p-8">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2 mt-5">
              <label className="text-sm font-semibold text-slate-800">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-2 mt-5">
              <label className="text-sm font-semibold text-slate-800">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Team */}
            <div className="space-y-2 mt-5">
              <label className="text-sm font-semibold text-slate-800">
                Team
              </label>
              <select
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="" disabled selected>
                  Select your team
                </option>
                <option>Frontend Team</option>
                <option>Backend Team</option>
                <option>Mobile App Team</option>
                <option>QA Team</option>
                <option>DevOps Team</option>
                <option>UI / UX Team</option>
                <option>Other</option>
              </select>
            </div>

            {/* Leave Type */}
            <div className="mt-5 space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Leave Type
              </label>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200">
               
                <option value="" disabled selected>
                  Select your team
                </option>

                <option>Sick leave (Illness or Injury)</option>
                <option>Bereavement leave (Immediate Family)</option>
                <option>Bereavement leave (Other)</option>
                <option>Personal leave</option>
                <option>Jury duty or legal leave</option>
                <option>Emergency leave</option>
                <option>Temporary leave</option>
                <option>Leave without pay</option>
                <option>Study Leave</option>
                <option>Other:</option>
              </select>
            </div>
            

            {/* From / To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  From
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  To
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            {/* Days */}
            <div className="mt-5 space-y-2">
              <label className="text-sm font-semibold text-slate-800">Days</label>
              <input
                type="text"
                placeholder="1 Day"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>

            {/* Reason */}
            <div className="mt-5 space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Reason for Leave
              </label>
              <textarea
                placeholder="Write reason..."
                className="w-full h-28 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
              />
            </div>

            {/* Additional Notes */}
            <div className="mt-5 space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Additional Notes
              </label>
              <input
                type="text"
                placeholder="Write notes..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Buttons */}
            <div className="mt-7 flex items-center justify-end gap-3">
              <button className="px-5 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50">
                Clear
              </button>

              <button className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-700 hover:opacity-95">
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
