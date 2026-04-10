function SessionExpiredPage({ onNavigate }) {
  return (
    <div className="expired-container">
      <h2 className="expired-title">SESSION EXPIRÉ</h2>
      <p className="expired-text">
        Vous avez laissé une page inactive ouverte pendant plus de 120 minutes.
      </p>
      <button onClick={() => onNavigate("login")} className="login-btn-ok">
        Retour à la page d'accueil
      </button>
    </div>
  );
}

export default SessionExpiredPage;
