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

  const handleLogout = () => {
    logout();
    onNavigate("login");
  };

  // ── Menu selon le rôle ──
  const role = user?.role || "employe";

  const menuItems = [];

  // ADMIN : tout voir
  if (role === "admin") {
    menuItems.push({
      label: "PARAMÉTRISATION",
      children: [
        { label: "Marques auto", page: "marques" },
        { label: "Modèles auto", page: "modeles" },
        { label: "Parc auto", page: "parc-auto" },
      ],
    });
    menuItems.push({
      label: "RÉSERVATIONS",
      children: [
        { label: "Nouvelle réservation", page: "reservation-new" },
        { label: "Toutes les réservations", page: "reservation-edit" },
      ],
    });
  }

  // EMPLOYÉ : seulement réserver et voir ses réservations
  if (role === "employe") {
    menuItems.push({
      label: "RÉSERVATIONS",
      children: [
        { label: "Nouvelle réservation", page: "reservation-new" },
        { label: "Mes réservations", page: "reservation-edit" },
      ],
    });
  }

  // RH : valider les réservations
  if (role === "rh") {
    menuItems.push({
      label: "RÉSERVATIONS",
      children: [
        { label: "Toutes les réservations", page: "reservation-edit" },
      ],
    });
  }

  // GARDIEN : voir les réservations du jour
  if (role === "gardien") {
    menuItems.push({
      label: "RÉSERVATIONS",
      children: [{ label: "Réservations en cours", page: "reservation-edit" }],
    });
  }

  // Badge rôle
  const roleLabels = {
    admin: "ADMINISTRATEUR",
    employe: "EMPLOYÉ",
    rh: "RESSOURCES HUMAINES",
    gardien: "GARDIEN",
  };

  const roleColors = {
    admin: "#dc3545",
    employe: "#2E75B6",
    rh: "#b8860b",
    gardien: "#1a7a2e",
  };

  return (
    <div className="layout-container">
      <div className="layout-header">
        <div className="header-row">
          <div className="header-left">
            <span className="header-clock">{clock}</span>
          </div>
          <div className="header-center">
            <div className="header-subtitle">SAM MONTEREAU</div>
            <div className="header-title">RÉSERVATION DE VOITURE</div>
          </div>
          <div className="header-right">
            <div className="header-user">
              {user?.cognomeNome}
              <span
                style={{
                  marginLeft: 8,
                  background: roleColors[role] || "#666",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                {roleLabels[role] || role}
              </span>
            </div>
            <div className="header-email">{user?.email}</div>
            <button onClick={handleLogout} className="header-logout-btn">
              🔓 Déconnexion
            </button>
          </div>
        </div>
        <div className="menu-bar">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="menu-parent"
              onMouseEnter={() => setMenuOpen(i)}
              onMouseLeave={() => setMenuOpen(null)}
            >
              <span className="menu-parent-label">{item.label}</span>
              {menuOpen === i && (
                <div className="menu-dropdown">
                  {item.children.map((child, j) => (
                    <div
                      key={j}
                      className="menu-child"
                      onClick={() => {
                        onNavigate(child.page);
                        setMenuOpen(null);
                      }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="page-content">{children}</div>
      <div
        style={{
          textAlign: "center",
          padding: "8px 0",
          fontSize: 11,
          color: "#888",
          borderTop: "1px solid #ddd",
        }}
      >
        <span
          onClick={() => onNavigate("rgpd")}
          style={{
            color: "#2E75B6",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Mentions légales et protection des données (RGPD)
        </span>
      </div>
    </div>
  );
}

export default Layout;
