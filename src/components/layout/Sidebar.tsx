import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: "◫" },
  { label: "Habits", path: "/habits", icon: "✓" },
  { label: "History", path: "/history", icon: "◷" },
  { label: "Insights", path: "/insights", icon: "↗" },
  { label: "Settings", path: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand">
        <span className="brand-mark">T</span>
        <span>Tracker</span>
      </NavLink>

      <p className="nav-heading">WORKSPACE</p>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        Build better habits, one day at a time.
      </div>
    </aside>
  );
}
