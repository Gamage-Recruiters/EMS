import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>GR EMS Portal</h1>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">Home</NavLink>
        <NavLink to="/complaints/developer" className="nav-item">Developer Complaints</NavLink>
        <NavLink to="/complaints/executive" className="nav-item">Executive Complaints</NavLink>
        
      </nav>
    </aside>
  )
}
