// src/components/NavBar.jsx
import { NavLink } from "react-router-dom"
import { FaBell, FaUserCircle } from "react-icons/fa"
import Clock from "./Clock"

export default function NavBar() {
  return (
    <header className="navbar">

      <div className="navbar-left">
        <form className="search-form">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="navbar-right">
        <Clock /> {/* Digital clock here */}
        <NavLink to="/notifications" className="nav-icon">
          <FaBell size={22} />
        </NavLink>
        <NavLink to="/user" className="nav-icon">
          <FaUserCircle size={22} />
        </NavLink>
      </div>
    </header>
  )
}
