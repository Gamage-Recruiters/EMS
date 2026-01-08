import { useEffect, useState } from "react";
import { FiChevronDown, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { teamService } from "../../../services/teamService";

export default function TeamHierarchyTab() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadTeams() {
    setLoading(true);
    setError(null);
    try {
      const res = await teamService.list();
      const d = res?.data;
      let list = [];
      if (Array.isArray(d)) list = d;
      else if (Array.isArray(d?.data)) list = d.data;
      else if (Array.isArray(d?.teams)) list = d.teams;
      else list = [];
      setTeams(list);
      if (list.length > 0 && !selectedTeamId) {
        setSelectedTeamId(list[0]._id || list[0].id);
      }
    } catch (err) {
      console.error("Failed to load teams", err);
      setError("Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  const selectedTeam = teams.find((t) => (t._id || t.id) === selectedTeamId);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Hierarchy</h2>
            <p className="text-sm text-gray-600 mt-1">
              View organizational structure of each team
            </p>
          </div>
        </div>
        <button
          onClick={loadTeams}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
      )}

      {/* Team Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Team
        </label>
        <div className="relative max-w-xs">
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            disabled={loading || teams.length === 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 appearance-none pr-10"
          >
            <option value="">Choose a team…</option>
            {teams.map((t) => (
              <option key={t._id ?? t.id} value={t._id ?? t.id}>
                {t.teamName || "Unnamed Team"}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Hierarchy Display */}
      {selectedTeam ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Team Lead */}
          <div className="mb-12">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
              Team Lead
            </h3>
            {selectedTeam.teamLead ? (
              <div className="max-w-xs">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {(
                      selectedTeam.teamLead.firstName?.[0] ||
                      selectedTeam.teamLead.name?.[0] ||
                      "T"
                    ).toUpperCase()}
                  </div>
                  <p className="font-bold text-lg text-gray-900">
                    {`${selectedTeam.teamLead.firstName || ""} ${
                      selectedTeam.teamLead.lastName || ""
                    }`.trim() || selectedTeam.teamLead.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTeam.teamLead.email}
                  </p>
                  <p className="text-xs text-indigo-600 font-semibold mt-2 uppercase tracking-wider">
                    {selectedTeam.teamLead.role || "Team Lead"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No team lead assigned</p>
            )}
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
              Team Members ({(selectedTeam.members || []).length})
            </h3>
            {Array.isArray(selectedTeam.members) &&
            selectedTeam.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTeam.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      {(
                        member.firstName?.[0] ||
                        member.name?.[0] ||
                        "M"
                      ).toUpperCase()}
                    </div>
                    <p className="font-semibold text-gray-900 text-center">
                      {`${member.firstName || ""} ${
                        member.lastName || ""
                      }`.trim() || member.name}
                    </p>
                    <p className="text-sm text-gray-600 text-center mt-1">
                      {member.email}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold text-center mt-3 uppercase tracking-wider">
                      {member.role || member.designation || "Member"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No team members assigned yet</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          {teams.length === 0 ? (
            <>
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM4.5 20H1v-2a6 6 0 0112 0v2H4.5z"
                />
              </svg>
              <p className="text-gray-600 text-lg">No teams created yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Create a team to view its hierarchy
              </p>
            </>
          ) : (
            <>
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-gray-600 text-lg">Select a team to view</p>
              <p className="text-sm text-gray-500 mt-2">
                Choose a team from the dropdown above
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
