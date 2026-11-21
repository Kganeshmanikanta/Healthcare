import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  User,
  CalendarDays,
  FileText,
  Bot,
  LogOut,
  HeartPulse,
} from "lucide-react";

function PatientDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Profile", icon: User },
    { name: "Appointments", icon: CalendarDays },
    { name: "Medical Reports", icon: FileText },
    { name: "AI Assistant", icon: Bot },
  ];

  const handleMenuClick = (name) => {
    setActive(name);

    if (name === "Appointments") {
      navigate("/appointments");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>
          <HeartPulse /> HealthCare
        </h2>

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={active === item.name ? "active-menu" : ""}
              onClick={() => handleMenuClick(item.name)}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}

        <button className="logout-button" onClick={logout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>{active}</h1>
            <p>Welcome to your patient portal</p>
          </div>

          <div className="user-avatar">P</div>
        </header>

        {active === "Dashboard" && (
          <>
            <div className="welcome-card">
              <div>
                <h2>Your health matters to us.</h2>
                <p>Manage your healthcare journey in one place.</p>
              </div>

              <HeartPulse size={55} />
            </div>

            <div className="dashboard-cards">
              <div
                className="stat-card"
                onClick={() => navigate("/appointments")}
                style={{ cursor: "pointer" }}
              >
                <CalendarDays />
                <h3>Appointments</h3>
                <p>Book and manage your appointments</p>
              </div>

              <div className="stat-card">
                <FileText />
                <h3>Medical Reports</h3>
                <p>Access your medical records</p>
              </div>

              <div className="stat-card">
                <Bot />
                <h3>AI Assistant</h3>
                <p>Understand medical information</p>
              </div>
            </div>
          </>
        )}

        {active !== "Dashboard" && (
          <div className="placeholder-card">
            <h2>{active}</h2>
            <p>This section will be connected to the backend next.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientDashboard;
