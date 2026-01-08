import { useEffect, useMemo, useState } from "react";
import { FiUsers, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { employeeService } from "../../../services/employeeService";
import { teamService } from "../../../services/teamService";

export default function TeamCreationTab() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    employeeService
      .list()
      .then((res) => {
        if (ignore) return;
        const d = res?.data;
        let list = [];
        if (Array.isArray(d)) list = d;
        else if (Array.isArray(d?.data)) list = d.data;
        else if (Array.isArray(d?.employees)) list = d.employees;
        setEmployees(list);
      })
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const leadOptions = useMemo(
    () =>
      employees.filter((e) =>
        ["CEO", "SystemAdmin", "TL", "ATL"].includes(e.role)
      ),
    [employees]
  );

  const handleMemberSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setMembers(selected);
  };

  const canSubmit = teamName.trim() && teamLead && !submitting;

  async function onCreate() {
    setError(null);
    setMessage(null);
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = {
        teamName: teamName.trim(),
        description,
        teamLead,
        members,
      };
      const res = await teamService.create(payload);
      setMessage("Team created successfully.");
      // reset form
      setTeamName("");
      setDescription("");
      setTeamLead("");
      setMembers([]);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create team";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <FiUsers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Create Team</h2>
            <p className="text-gray-600 text-sm mt-1">
              Organize your employees into teams. Assign a team lead and add
              members.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl shadow-md flex items-start gap-3 animate-fadeIn">
          <div className="p-1 bg-emerald-500 rounded-full">
            <FiCheckCircle className="w-5 h-5 text-white flex-shrink-0" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">{message}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-300 rounded-xl shadow-md flex items-start gap-3 animate-fadeIn">
          <div className="p-1 bg-red-500 rounded-full">
            <FiAlertCircle className="w-5 h-5 text-white flex-shrink-0" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 max-w-3xl mx-auto backdrop-blur-sm">
        <div className="space-y-7">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Frontend Team Alpha"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium"
            />
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span className="text-blue-500">💡</span> Give your team a unique,
              descriptive name
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the team's purpose and responsibilities"
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 resize-none font-medium"
            />
          </div>

          {/* Team Lead */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
              Team Lead <span className="text-red-500">*</span>
            </label>
            <select
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              disabled={loading}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed font-medium"
            >
              <option value="">Select team lead…</option>
              {leadOptions.map((u) => (
                <option key={u._id ?? u.id} value={u._id ?? u.id}>
                  {u.firstName || u.name || ""} {u.lastName || ""} ({u.email}) —{" "}
                  {u.role}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span className="text-amber-500">⚡</span> Only users with lead
              roles are available
            </p>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
              Team Members
            </label>
            <select
              multiple
              value={members}
              onChange={handleMemberSelect}
              disabled={loading}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-gray-50 focus:bg-white disabled:bg-gray-100 font-medium text-gray-900"
              size={7}
            >
              {employees.map((u) => (
                <option
                  key={u._id ?? u.id}
                  value={u._id ?? u.id}
                  className="py-2"
                >
                  {u.firstName || u.name || ""} {u.lastName || ""} ({u.email}) —{" "}
                  {u.role}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-purple-500">✨</span>{" "}
                <span className="font-semibold">Tip:</span> Hold Ctrl/Cmd to
                select multiple
              </p>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {members.length} selected
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <button
              onClick={onCreate}
              disabled={!canSubmit}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {submitting ? "Creating…" : "Create Team"}
            </button>
            <button
              onClick={() => {
                setTeamName("");
                setDescription("");
                setTeamLead("");
                setMembers([]);
                setMessage(null);
                setError(null);
              }}
              className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
