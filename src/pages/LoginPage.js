import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/apiService";

function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("ENTRER NOM D'UTILISATEUR ET MOT DE PASSE");
      usernameRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const result = await api.login(username.trim(), password.trim());
      if (!result.token) {
        setError(result.error || "ERREUR DE CONNEXION");
        setLoading(false);
        return;
      }
      login(result.user, result.token);
      onNavigate("home");
    } catch (err) {
      setError(err.message || "ERREUR SERVEUR");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 30,
      }}
    >
      {/* ── Logos ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          marginBottom: 16,
        }}
      >
        <img
          src="/logo_riva.png"
          alt="Logo Riva"
          style={{ height: 110, objectFit: "contain" }}
        />
        <img
          src="/logo_sam.png"
          alt="Logo SAM Montereau"
          style={{ height: 90, objectFit: "contain" }}
        />
      </div>

      {/* ── Bannière verte ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #2a7a6a 0%, #3a9a8a 100%)",
          color: "#fff",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 3,
          textAlign: "center",
          padding: "18px 80px",
          width: "100%",
          maxWidth: 900,
          marginBottom: 30,
        }}
      >
        RÉSERVATION DE VOITURE
      </div>

      {/* ── Panneau principal ── */}
      <div
        style={{
          background: "#d6e4f0",
          border: "1px solid #a0b8cc",
          borderRadius: 4,
          padding: "30px 40px",
          width: "100%",
          maxWidth: 850,
        }}
      >
        {/* Sous-titre */}
        <p
          style={{
            textAlign: "center",
            color: "#2a7a6a",
            fontSize: 16,
            fontStyle: "italic",
            marginBottom: 24,
          }}
        >
          entrez votre nom d'utilisateur et votre mot de passe pour le domaine
          SAM Montereau ou vos identifiants externes
        </p>

        {/* Erreur */}
        {error && (
          <div
            style={{
              background: "#fde8e8",
              color: "#c53030",
              padding: "10px 16px",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 16,
              borderLeft: "4px solid #c53030",
            }}
          >
            {error}
          </div>
        )}

        {/* Formulaire gris */}
        <div
          style={{
            background: "#c8c8c8",
            padding: "30px 40px",
            borderRadius: 4,
            border: "1px solid #aaa",
          }}
        >
          {/* Nom d'utilisateur */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              justifyContent: "center",
            }}
          >
            <label
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#333",
                width: 160,
                textAlign: "right",
                marginRight: 10,
              }}
            >
              Nom d'utilisateur:
            </label>
            <span style={{ marginRight: 6, fontSize: 16 }}>👤</span>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="prénom.nom"
              style={{
                width: 260,
                padding: "8px 12px",
                fontSize: 15,
                border: "1px solid #999",
                borderRadius: 2,
                background: "#fffde8",
              }}
            />
          </div>

          {/* Mot de passe */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              justifyContent: "center",
            }}
          >
            <label
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#333",
                width: 160,
                textAlign: "right",
                marginRight: 10,
              }}
            >
              Mot de passe:
            </label>
            <span style={{ marginRight: 6, fontSize: 16 }}>🔒</span>
            <div style={{ position: "relative", width: 260 }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="mot de passe"
                style={{
                  width: "100%",
                  padding: "8px 36px 8px 12px",
                  fontSize: 15,
                  border: "1px solid #999",
                  borderRadius: 2,
                  background: "#fffde8",
                  boxSizing: "border-box",
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  cursor: "pointer",
                  fontSize: 16,
                  opacity: 0.6,
                }}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* Boutons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                background: "#2E75B6",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "12px 60px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              {loading ? "Connexion..." : "OK"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
          Groupe Riva — Usine SAM Montereau — France — Version 2.0 React/Node.js
          — 🔒 JWT
        </p>
        <span
          onClick={() => onNavigate("rgpd")}
          style={{
            fontSize: 12,
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

export default LoginPage;
