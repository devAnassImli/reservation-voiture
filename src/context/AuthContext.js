// ─────────────────────────────────────────────
// AuthContext.js — Avec stockage du token JWT
//
// AVANT : on stockait juste les infos user
// MAINTENANT : on stocke aussi le token JWT
//
// Le token est envoyé avec chaque requête API
// pour prouver qu'on est connecté.
// ─────────────────────────────────────────────

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("rv_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("rv_token") || null;
    } catch {
      return null;
    }
  });

  // Login : stocke user + token
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("rv_user", JSON.stringify(userData));
    if (jwtToken) localStorage.setItem("rv_token", jwtToken);
  };

  // Logout : supprime tout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rv_user");
    localStorage.removeItem("rv_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
