import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Layout({ children, onNavigate }) {
  const { user, logout } = useAuth();
  const [clock, setClock] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    const updateClock = () => setClock(new Date().toLocaleString("fr-FR"));
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => { logout(); onNavigate("login"); };

  const menuItems = [
    { label: "PARAMÉTRISATION", children: [
      { label: "Marques auto", page: "marques" },
      { label: "Modèles auto", page: "modeles" },
      { label: "Parc auto", page: "parc-auto" },
    ]},
    { label: "RÉSERVATIONS", children: [
      { label: "Nouvelle réservation", page: "reservation-new" },
      { label: "Modifier réservation", page: "reservation-edit" },
    ]},
  ];

  return (
    <div className="layout-container">
      <div className="layout-header">
        <div className="header-row">
          <div className="header-left"><span className="header-clock">{clock}</span></div>
          <div className="header-center">
            <div className="header-subtitle">SAM MONTEREAU</div>
            <div className="header-title">RÉSERVATION DE VOITURE</div>
          </div>
          <div className="header-right">
            <div className="header-user">user: {user?.cognomeNome}</div>
            <div className="header-email">{user?.email}</div>
            <button onClick={handleLogout} className="header-logout-btn">🔓 Déconnexion</button>
          </div>
        </div>
        <div className="menu-bar">
          {menuItems.map((item, i) => (
            <div key={i} className="menu-parent" onMouseEnter={() => setMenuOpen(i)} onMouseLeave={() => setMenuOpen(null)}>
              <span className="menu-parent-label">{item.label}</span>
              {menuOpen === i && (
                <div className="menu-dropdown">
                  {item.children.map((child, j) => (
                    <div key={j} className="menu-child" onClick={() => { onNavigate(child.page); setMenuOpen(null); }}>{child.label}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
}

export default Layout;
