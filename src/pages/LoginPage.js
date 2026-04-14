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

  // ── Login classique (avec identifiants) ──
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
      if (!result.success) {
        setError(result.error || "ERREUR");
        setLoading(false);
        return;
      }

      // Stocke user + token JWT
      login(result.data, result.token);
      onNavigate("home");
    } catch (err) {
      setError(err.message || "ERREUR SERVEUR");
    } finally {
      setLoading(false);
    }
  };

  // ── Login mode démo (sans mot de passe) ──
  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await api.loginDemo();
      login(result.data, result.token);
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
    <div className="login-container">
      <div className="login-logos">
        <span className="logo-riva">RIVA</span>
        <span className="logo-sep">•</span>
        <span className="logo-sam">SAM MONTEREAU</span>
      </div>
      <div className="login-banner">RÉSERVATION DE VOITURE</div>
      {error && <div className="login-error">{error}</div>}
      <div className="login-main-panel">
        <p className="login-subtitle">
          <em>
            entrez votre nom d'utilisateur et votre mot de passe pour le domaine
            SAM Montereau ou vos identifiants externes
          </em>
        </p>
        <div className="login-auth-panel">
          <div className="login-field-row">
            <label className="login-label">
              <em>Nom d'utilisateur:</em>
            </label>
            <span className="login-icon">👤</span>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="prénom.nom"
              className="login-input"
            />
          </div>
          <div className="login-field-row">
            <label className="login-label">
              <em>Mot de passe:</em>
            </label>
            <span className="login-icon">🔒</span>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="mot de passe"
                className="login-input"
              />
              <span
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="login-btn-ok"
          >
            {loading ? "Connexion..." : "OK"}
          </button>
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            style={{
              marginTop: 4,
              background: "#667788",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 30px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Mode démo (sans mot de passe)
          </button>
        </div>
      </div>
      <p className="login-footer">
        <em>Groupe Riva — SAM Montereau — vers. 2.0 React — 🔒 JWT</em>
        <br />
        <span
          onClick={() => onNavigate("rgpd")}
          style={{
            color: "#2E75B6",
            cursor: "pointer",
            fontSize: 11,
            textDecoration: "underline",
          }}
        >
          Mentions légales et protection des données (RGPD)
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
