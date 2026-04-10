import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { mockLogin } from "../data/mockData";

function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");
  const [changeMsgOk, setChangeMsgOk] = useState(false);
  const usernameRef = useRef(null);

  useEffect(() => { usernameRef.current?.focus(); }, []);

  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("ENTRER NOM D'UTILISATEUR ET MOT DE PASSE");
      usernameRef.current?.focus();
      return;
    }
    setLoading(true);
    const result = await mockLogin(username.trim(), password.trim());
    setLoading(false);
    if (!result.success) { setError(result.error); return; }
    if (password.trim() === "Riva100!") {
      setShowChangePassword(true);
      setChangeMsg("CHANGEMENT DE MOT DE PASSE OBLIGATOIRE");
      return;
    }
    login(result.data);
    onNavigate("home");
  };

  const handleChangePassword = () => {
    setChangeMsg(""); setChangeMsgOk(false);
    if (!newPassword.trim() || !confirmPassword.trim()) { setChangeMsg("VOUS DEVEZ REMPLIR LES DEUX CHAMPS"); return; }
    if (newPassword.trim() === "Riva100!") { setChangeMsg("UTILISEZ UN MOT DE PASSE DIFFÉRENT"); return; }
    if (newPassword.trim() !== confirmPassword.trim()) { setChangeMsg("LE MOT DE PASSE NE CORRESPOND PAS À LA CONFIRMATION"); return; }
    setChangeMsg("OK, MOT DE PASSE MODIFIÉ"); setChangeMsgOk(true);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="login-container">
      <div className="login-logos">
        <span className="logo-riva">RIVA</span>
        <span className="logo-sep">•</span>
        <span className="logo-sam">SAM MONTEREAU</span>
      </div>
      <div className="login-banner">RÉSERVATION DE VOITURE</div>
      <div className="login-test-info">🔑 Pour tester : <strong>test / test</strong> ou <strong>anass.imli / test123</strong></div>
      {error && <div className="login-error">{error}</div>}
      <div className="login-main-panel">
        {!showChangePassword ? (
          <>
            <p className="login-subtitle"><em>entrez votre nom d'utilisateur et votre mot de passe pour le domaine SAM Montereau ou vos identifiants externes</em></p>
            <div className="login-auth-panel">
              <div className="login-field-row">
                <label className="login-label"><em>Nom d'utilisateur:</em></label>
                <span className="login-icon">👤</span>
                <input ref={usernameRef} type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} placeholder="prénom.nom" className="login-input" />
              </div>
              <div className="login-field-row">
                <label className="login-label"><em>Mot de passe:</em></label>
                <span className="login-icon">🔒</span>
                <div className="login-password-wrapper">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="mot de passe" className="login-input" />
                  <span className="login-eye" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁"}</span>
                </div>
              </div>
              <button onClick={handleLogin} disabled={loading} className="login-btn-ok">{loading ? "Connexion..." : "OK"}</button>
            </div>
          </>
        ) : (
          <div className="login-auth-panel">
            {changeMsg && <p className={changeMsgOk ? "change-msg-ok" : "change-msg-error"}>{changeMsg}</p>}
            <div className="login-field-row">
              <label className="login-label"><em>Nouveau mot de passe:</em></label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="login-input" />
            </div>
            <div className="login-field-row">
              <label className="login-label"><em>Confirmez le mot de passe:</em></label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="login-input" />
            </div>
            <button onClick={handleChangePassword} className="login-btn-ok">OK</button>
          </div>
        )}
      </div>
      <p className="login-footer"><em>Groupe Riva — usine SAM Montereau — France — vers. 2.0 React</em></p>
    </div>
  );
}

export default LoginPage;
