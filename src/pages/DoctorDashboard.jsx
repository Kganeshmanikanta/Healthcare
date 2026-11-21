import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  Users,
  FileText,
  LogOut,
  HeartPulse,
} from "lucide-react";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Profile", icon: User },
    { name: "Appointments", icon: CalendarDays },
    { name: "My Patients", icon: Users },
    { name: "Medical Reports", icon: FileText },
  ];

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
              onClick={() => setActive(item.name)}
            >
              <Icon size={19} /> {item.name}
            </button>
          );
        })}

        <button className="logout-button" onClick={logout}>
          <LogOut size={19} /> Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>{active}</h1>
            <p>Welcome to your doctor portal</p>
          </div>
          <div className="user-avatar">D</div>
        </header>

        {active === "Dashboard" && (
          <>
            <div className="welcome-card">
              <div>
                <h2>Welcome, Doctor!</h2>
                <p>Manage appointments and patient care.</p>
              </div>
              <HeartPulse size={55} />
            </div>

            <div className="dashboard-cards">
              <div className="stat-card">
                <CalendarDays />
                <h3>Appointments</h3>
                <p>View and manage appointments</p>
              </div>

              <div className="stat-card">
                <Users />
                <h3>My Patients</h3>
                <p>View patient information</p>
              </div>

              <div className="stat-card">
                <FileText />
                <h3>Medical Reports</h3>
                <p>Review patient reports</p>
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

export default DoctorDashboard;
