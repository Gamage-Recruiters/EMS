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
    <aside style={{ width: 240, background: "#fff", borderRight: "1px solid #eee", padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 16 }}>EMS</div>

      <nav>
        <NavLink to="/employees" style={linkStyle}>Employees</NavLink>
        <NavLink to="/hierarchy" style={linkStyle}>Hierarchy</NavLink>
        <NavLink to="/team-assignment" style={linkStyle}>Team Assignment</NavLink>
      </nav>
    </aside>
  );
}
