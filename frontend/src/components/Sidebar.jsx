import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Feedback", path: "/feedback", icon: "📝" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
    { name: "AI Insights", path: "/ai-insights", icon: "💡" },
    { name: "Learning Curve", path: "/learning-curve", icon: "📈" },
    { name: "Before & After", path: "/before-after", icon: "🔄" },
    { name: "AI Agent", path: "/ai-chat", icon: "🤖" },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="sidebar-title">

        <span className="sidebar-brand-icon">
          ✦
        </span>

        <span className="sidebar-brand-text">
          Feedback
          <br />
          Synthesizer
        </span>

      </div>

      <nav>

        {links.map((link) => (

          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >

            <span className="nav-link-icon">
              {link.icon}
            </span>

            <span className="nav-link-text">
              {link.name}
            </span>

          </NavLink>

        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;