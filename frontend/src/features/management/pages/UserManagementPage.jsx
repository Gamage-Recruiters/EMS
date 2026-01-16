import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import Modal from "../../../components/common/Modal";
import { employeeService } from "../../../services/employeeService";
import TeamCreationTab from "../components/TeamCreationTab";
import TeamListTab from "../components/TeamListTab";
import TeamHierarchyTab from "../components/TeamHierarchyTab";
import UserRow from "../components/UserRow";
import { useRequireRole } from "../../../hooks/useRequireRole";


export default function UserManagementPage() {

  const { loadinguser, isAuthorized } = useRequireRole([
  "CEO",
  "SystemAdmin",
  "TL",
  ]);

  if (loadinguser) {
    return <div className="p-8">Checking permissions…</div>;
  }

  if (!isAuthorized) {
    return null; 
  }
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- URL -> UI tab sync ---
  const initialTab = searchParams.get("tab") || "employees";
  const [activeTab, setActiveTab] = useState(initialTab); // employees | team-creation | teams | hierarchy

  // Sync state whenever URL changes (e.g., clicking Edit sets ?tab=team-creation...)
  useEffect(() => {
    const tab = searchParams.get("tab") || "employees";
    setActiveTab(tab);
  }, [searchParams]);

  // Helper to change tab AND write to URL
  const changeTab = useCallback(
    (tab) => {
      setActiveTab(tab);

      const next = new URLSearchParams(searchParams);
      next.set("tab", tab);

      // Recommended: when leaving team-creation, clear edit mode/id
      // so URL doesn't keep stale edit state.
      if (tab !== "team-creation") {
        next.delete("mode");
        next.delete("id");
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // ---- existing state ----
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]); // keep as array

  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useMemo(() => ({ q, team, role }), [q, team, role]);

  async function load() {
    setLoading(true);
    try {
      const res = await employeeService.list(params);

      // --- NORMALISE RESPONSE TO ARRAY ---
      const d = res?.data;
      let list = [];

      if (Array.isArray(d)) {
        list = d;
      } else if (Array.isArray(d?.data)) {
        list = d.data;
      } else if (Array.isArray(d?.employees)) {
        list = d.employees;
      } else {
        list = [];
      }

      setEmployees(list);
    } catch (err) {
      console.error("Employee list failed (backend down):", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function onDeleteConfirm() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await employeeService.remove(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteError(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  }

  const safeEmployees = Array.isArray(employees) ? employees : [];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => changeTab("employees")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "employees"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiUsers className="inline-block w-4 h-4 mr-2" />
            Employees
          </button>

          <button
            onClick={() => changeTab("team-creation")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "team-creation"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Team Creation
          </button>

          <button
            onClick={() => changeTab("teams")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "teams"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Teams
          </button>

          <button
            onClick={() => changeTab("hierarchy")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "hierarchy"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Hierarchy
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        {activeTab === "team-creation" && <TeamCreationTab />}
        {activeTab === "teams" && <TeamListTab />}
        {activeTab === "hierarchy" && <TeamHierarchyTab />}

        {activeTab === "employees" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage all employees in your organization
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Add Employee
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FiFilter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters & Search</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email…"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by role…"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => load()}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition flex items-center justify-center gap-2">
                    <FiRefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                    {loading ? "Loading…" : "Refresh"}
                  </button>
                </div>
              </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Employee
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Contact No:
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      City
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Designation
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Joined Date
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left px-6 py-2 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {safeEmployees.map((e) => (
                    <UserRow
                      key={e._id ?? e.id}
                      user={e}
                      onView={(id) =>
                        navigate(`/profile/personal-details?mode=view&id=${id}`)
                      }
                      onEdit={(id) =>
                        navigate(`/profile/personal-details?mode=edit&id=${id}`)
                      }
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}

                  {!loading && safeEmployees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center">
                        <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No employees found</p>
                        <p className="text-sm text-gray-500">
                          Try adjusting your filters or add a new employee
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Delete Modal */}
            <Modal
              open={!!deleteId}
              title="Delete employee?"
              onClose={() => {
                setDeleteId(null);
                setDeleteError(null);
              }}
              onConfirm={onDeleteConfirm}
              confirmText={isDeleting ? "Deleting…" : "Delete"}
              disableConfirm={isDeleting}
            >
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-900">
                    {deleteError}
                  </p>
                </div>
              )}
              <p className="text-gray-700">
                This action cannot be undone. The employee will be permanently
                deleted from the system.
              </p>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
