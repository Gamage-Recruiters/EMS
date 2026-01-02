import { useEffect, useMemo, useState } from "react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { employeeService } from "../../../services/employeeService";

export default function UserManagementPage() {
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);   // keep as array

  const [deleteId, setDeleteId] = useState(null);

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
        // e.g. { data: [...] }
        list = d.data;
      } else if (Array.isArray(d?.employees)) {
        // e.g. { employees: [...] }
        list = d.employees;
      } else {
        // fallback – nothing usable
        list = [];
      }

      setEmployees(list);
    } catch (err) {
      console.error("Employee list failed (backend down):", err);
      setEmployees([]); // keep UI alive
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [params]);

  async function onDeleteConfirm() {
    await employeeService.remove(deleteId);
    setDeleteId(null);
    load();
  }

  // SAFETY: guarantee we only ever map over an array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Employees</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 180px 180px 140px",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <Input
          placeholder="Search name/email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Input
          placeholder="Team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button onClick={() => load()} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </Button>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Name", "Email", "Role", "Team", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeEmployees.map((e) => (
              <tr key={e._id ?? e.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>{e.name ?? "-"}</td>
                <td style={{ padding: 12 }}>{e.email ?? "-"}</td>
                <td style={{ padding: 12 }}>{e.role ?? "-"}</td>
                <td style={{ padding: 12 }}>{e.team ?? "-"}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <Button
                    variant="secondary"
                    onClick={() => alert("Hook to View page")}
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => alert("Hook to Edit page")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setDeleteId(e._id ?? e.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {!loading && safeEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: 16, color: "#6b7280" }}
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!deleteId}
        title="Delete employee?"
        onClose={() => setDeleteId(null)}
        onConfirm={onDeleteConfirm}
        confirmText="Delete"
      >
        This action cannot be undone.
      </Modal>
    </div>
  );
}
