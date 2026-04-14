// ============================================================
//  App.js — Le chef d'orchestre
//  
//  Ce fichier est maintenant PROPRE et PETIT.
//  Il ne fait que 2 choses :
//    1. Importer tous les composants
//    2. Gérer le routing (quelle page afficher)
//
//  Chaque composant est dans son propre fichier.
//  C'est de la bonne programmation professionnelle ! ✅
// ============================================================

import { useState, useEffect } from "react";
import './App.css';
import RgpdPage from "./pages/RgpdPage";

// Imports des composants
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SessionExpiredPage from "./pages/SessionExpiredPage";
import MarquesPage from "./pages/MarquesPage";
import ModelesPage from "./pages/ModelesPage";
import ParcAutoPage from "./pages/ParcAutoPage";
import NewReservationPage from "./pages/NewReservationPage";
import EditReservationPage from "./pages/EditReservationPage";

function App() {
  const [page, setPage] = useState("login");

  return (
    <AuthProvider>
      <AppContent page={page} setPage={setPage} />
    </AuthProvider>
  );
}

function AppContent({ page, setPage }) {
  const { user } = useAuth();

  // Si pas connecté → redirige vers login
  useEffect(() => {
    if (!user && page !== "login" && page !== "session-expired") {
      setPage("login");
    }
  }, [user, page, setPage]);

  // Si connecté et sur login → redirige vers home
  useEffect(() => {
    if (user && page === "login") {
      setPage("home");
    }
  }, [user, page, setPage]);

  // Page login (sans Layout)
  if (page === "login") return <LoginPage onNavigate={setPage} />;

  // Page session expirée (sans Layout)
  if (page === "session-expired") return <SessionExpiredPage onNavigate={setPage} />;

  // Toutes les autres pages avec le Layout (MasterPage)
  const pages = {
    home: <HomePage />,
    marques: <MarquesPage />,
    modeles: <ModelesPage />,
    "parc-auto": <ParcAutoPage />,
    "reservation-new": <NewReservationPage />,
    "reservation-edit": <EditReservationPage />,
     "rgpd": <RgpdPage />,    
  };

  return (
    <Layout onNavigate={setPage}>
      {pages[page] || <HomePage />}
    </Layout>
  );
}

export default App;