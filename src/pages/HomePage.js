import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user } = useAuth();
  return (
    <div className="page-panel">
      <h2 className="page-title">Bonjour, {user?.cognomeNome}</h2>
      <p className="page-text">
        Bienvenue dans l'application de réservation de voiture.
        <br />
        Utilisez le menu ci-dessus pour naviguer.
      </p>
    </div>
  );
}

export default HomePage;
