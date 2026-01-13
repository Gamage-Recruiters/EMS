import { useEffect, useState } from "react";
import { FiChevronDown, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { teamService } from "../../../services/teamService";
import { useRequireRole } from "../../../hooks/useRequireRole";


export default function TeamHierarchyTab() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedMember, setDraggedMember] = useState(null);
  // Store departments per team ID
  const [departmentsByTeam, setDepartmentsByTeam] = useState({});

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

  // Get departments for current team
  const departments = selectedTeamId
    ? departmentsByTeam[selectedTeamId] || {
        frontend: [],
        backend: [],
        hr: [],
        admin: [],
        maintenance: [],
      }
    : {
        frontend: [],
        backend: [],
        hr: [],
        admin: [],
        maintenance: [],
      };

  // Drag and Drop Handlers
  const handleDragStart = (member) => {
    setDraggedMember(member);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (departmentName) => {
    if (draggedMember && selectedTeamId) {
      setDepartmentsByTeam((prev) => {
        const currentDepts = prev[selectedTeamId] || {
          frontend: [],
          backend: [],
          hr: [],
          admin: [],
          maintenance: [],
        };

        // Remove member from all departments
        const newDepts = Object.keys(currentDepts).reduce((acc, dept) => {
          acc[dept] = currentDepts[dept].filter(
            (m) =>
              (m._id || m.id || m.email) !==
              (draggedMember._id || draggedMember.id || draggedMember.email)
          );
          return acc;
        }, {});

        // Add to target department
        newDepts[departmentName] = [...newDepts[departmentName], draggedMember];

        return {
          ...prev,
          [selectedTeamId]: newDepts,
        };
      });
      setDraggedMember(null);
    }
  };

  const handleRemoveFromDepartment = (departmentName, memberToRemove) => {
    if (selectedTeamId) {
      setDepartmentsByTeam((prev) => {
        const currentDepts = prev[selectedTeamId] || {
          frontend: [],
          backend: [],
          hr: [],
          admin: [],
          maintenance: [],
        };

        return {
          ...prev,
          [selectedTeamId]: {
            ...currentDepts,
            [departmentName]: currentDepts[departmentName].filter(
              (m) =>
                (m._id || m.id || m.email) !==
                (memberToRemove._id ||
                  memberToRemove.id ||
                  memberToRemove.email)
            ),
          },
        };
      });
    }
  };

  // Check if member is already assigned to a department
  const isMemberAssigned = (member) => {
    return Object.values(departments).some((deptMembers) =>
      deptMembers.some(
        (m) =>
          (m._id || m.id || m.email) ===
          (member._id || member.id || member.email)
      )
    );
  };

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
        <div className="space-y-8">
          {/* Team Lead - kept as is */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
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

          {/* Team Members - Small Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>TEAM MEMBERS ({(selectedTeam.members || []).length})</span>
              <span className="text-xs font-normal text-gray-500">
                (Drag to assign to departments)
              </span>
            </h3>
            {Array.isArray(selectedTeam.members) &&
            selectedTeam.members.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {selectedTeam.members.map((member, idx) => {
                  const isAssigned = isMemberAssigned(member);
                  return (
                    <div
                      key={idx}
                      draggable={!isAssigned}
                      onDragStart={() => handleDragStart(member)}
                      className={`${
                        isAssigned
                          ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                          : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-move hover:shadow-lg hover:scale-105"
                      } border-2 rounded-lg p-3 transition-all duration-200`}
                      title={
                        isAssigned
                          ? "Already assigned to a department"
                          : "Drag to assign to department"
                      }
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${
                          isAssigned
                            ? "bg-gray-400"
                            : "bg-gradient-to-br from-blue-400 to-blue-600"
                        } flex items-center justify-center text-white font-bold text-sm mx-auto mb-2`}
                      >
                        {(
                          member.firstName?.[0] ||
                          member.name?.[0] ||
                          "M"
                        ).toUpperCase()}
                      </div>
                      <p className="font-semibold text-gray-900 text-center text-xs truncate">
                        {`${member.firstName || ""} ${
                          member.lastName || ""
                        }`.trim() || member.name}
                      </p>
                      <p className="text-xs text-gray-600 text-center truncate">
                        {member.email}
                      </p>
                      <p
                        className={`text-xs ${
                          isAssigned ? "text-gray-500" : "text-blue-600"
                        } font-semibold text-center mt-1 uppercase`}
                      >
                        {isAssigned ? "ASSIGNED" : "UNASSIGNED"}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No team members assigned yet
              </p>
            )}
          </div>

          {/* Department Hierarchy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-6">
              DEPARTMENT HIERARCHY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(departments).map(([deptName, members]) => (
                <div
                  key={deptName}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(deptName)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex items-center justify-center mb-4">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      {deptName}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {members.length > 0 ? (
                      members.map((member, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow relative group"
                        >
                          <button
                            onClick={() =>
                              handleRemoveFromDepartment(deptName, member)
                            }
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                            title="Remove from department"
                          >
                            ×
                          </button>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs mx-auto mb-1">
                            {(
                              member.firstName?.[0] ||
                              member.name?.[0] ||
                              "M"
                            ).toUpperCase()}
                          </div>
                          <p className="font-medium text-gray-900 text-center text-xs truncate">
                            {`${member.firstName || ""} ${
                              member.lastName || ""
                            }`.trim() || member.name}
                          </p>
                          <p className="text-xs text-gray-500 text-center truncate">
                            {member.role || member.designation || "Member"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-xs text-gray-400">
                          Drop members here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
