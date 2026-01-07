import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 12px",
  margin: "6px 0",
  borderRadius: 8,
  textDecoration: "none",
  color: "#111",
  background: isActive ? "#e9efff" : "transparent",
});

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: "#fff",
        borderRight: "1px solid #eee",
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 16 }}>EMS</div>

      <nav>
        {/* list employees */}
        <NavLink to="/employees" style={linkStyle}>
          Employees
        </NavLink>

        {/* hierarchy view */}
        <NavLink to="/team-hierarchy" style={linkStyle}>
          Hierarchy
        </NavLink>

        {/* team assignment */}
        <NavLink to="/team-management" style={linkStyle}>
          Team Assignment
        </NavLink>
      </nav>
    </aside>
  );
}
