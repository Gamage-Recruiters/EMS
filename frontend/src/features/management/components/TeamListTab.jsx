import { useEffect, useState } from "react";
import { FiUsers, FiRefreshCw, FiTrash2, FiAlertCircle, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { teamService } from "../../../services/teamService";

export default function TeamListTab() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await teamService.list();
      const d = res?.data;

      // normalize: backend may return { success, count, data: [] } OR { teams: [] } OR []
      let list = [];
      if (Array.isArray(d)) list = d;
      else if (Array.isArray(d?.data)) list = d.data;
      else if (Array.isArray(d?.teams)) list = d.teams;

      setTeams(list);
    } catch (err) {
      console.error("Failed to load teams", err);
      setError(err?.response?.data?.message || "Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("Delete this team?")) return;
    try {
      await teamService.remove(id);
      load();
    } catch (err) {
      console.error("Failed to delete team", err);
      setError(err?.response?.data?.message || "Failed to delete team");
    }
  }

  function editTeam(id) {
    // IMPORTANT: change this path if your tabs are not controlled via query params.
    // Typical pattern:
    // - Employees page reads ?tab=team-creation and renders <TeamCreationTab />
    navigate(`/employees?tab=team-creation&mode=edit&id=${id}`);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiUsers className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all teams in your organization
            </p>
          </div>
        </div>

        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Team Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Team Lead
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Members
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teams.map((t, idx) => {
              const id = t._id ?? t.id;
              return (
                <tr
                  key={id}
                  className={`border-b border-gray-100 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {(t.teamName?.[0] || "T").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t.teamName ?? "-"}
                        </p>
                        {t.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {t.teamLead
                          ? `${t.teamLead.firstName ?? ""} ${t.teamLead.lastName ?? ""}`.trim()
                          : "-"}
                      </p>
                      {t.teamLead?.email && (
                        <p className="text-sm text-gray-500">
                          {t.teamLead.email}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {Array.isArray(t.members) ? t.members.length : 0}
                      </span>
                      <span className="text-gray-600 text-sm">members</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editTeam(id)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-lg transition font-medium text-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => remove(id)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loading && teams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No teams found yet</p>
                  <p className="text-sm text-gray-500">
                    Create your first team to get started
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
