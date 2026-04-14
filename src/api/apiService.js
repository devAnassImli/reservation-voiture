// ─────────────────────────────────────────────
// api/apiService.js — Avec envoi du token JWT
//
// AVANT : fetch sans authentification
// MAINTENANT : chaque requête envoie le token dans le header
//
// Header envoyé :
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
//
// Si le token expire ou est invalide → 401/403 → déconnexion auto
// ─────────────────────────────────────────────

const API_URL = "/api";

// ── Récupère le token stocké dans localStorage ──
function getToken() {
  return localStorage.getItem("rv_token");
}

// ── Fonction utilitaire pour les requêtes ──
async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Ajoute le token JWT si on en a un
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const response = await fetch(API_URL + url, {
    ...options,
    headers,
  });

  // Si 401 ou 403 → token expiré → déconnexion
  // Si le serveur ne répond pas (pas de JSON)
  if (!response.ok && response.status === 500) {
    try {
      const data = await response.json();
      throw new Error(data.error || "Erreur serveur");
    } catch {
      throw new Error("Serveur indisponible — utilisez le mode démo");
    }
  }
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("rv_user");
    localStorage.removeItem("rv_token");
    window.location.reload(); // force retour au login
    throw new Error("SESSION EXPIRÉE — Reconnectez-vous");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erreur serveur");
  }

  return data;
}

// ══════════════════════════════════════
//  AUTH
// ══════════════════════════════════════

export async function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginDemo() {
  return request("/auth/demo", { method: "POST" });
}

// ══════════════════════════════════════
//  MARQUES
// ══════════════════════════════════════

export async function getMarques() {
  return request("/marques");
}

export async function insertMarque(marca) {
  return request("/marques", {
    method: "POST",
    body: JSON.stringify({ marca }),
  });
}

export async function deleteMarque(id) {
  return request("/marques/" + id, { method: "DELETE" });
}

// ══════════════════════════════════════
//  MODELES
// ══════════════════════════════════════

export async function getModeles() {
  return request("/modeles");
}

export async function insertModele(idMarca, modello, cilindrata) {
  return request("/modeles", {
    method: "POST",
    body: JSON.stringify({ idMarca, modello, cilindrata }),
  });
}

export async function deleteModele(id) {
  return request("/modeles/" + id, { method: "DELETE" });
}

// ══════════════════════════════════════
//  VOITURES
// ══════════════════════════════════════

export async function getVoitures() {
  return request("/voitures");
}

export async function getFlotte(priorite) {
  return request("/voitures/flotte/" + priorite);
}

export async function insertVoiture(data) {
  return request("/voitures", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteVoiture(id) {
  return request("/voitures/" + id, { method: "DELETE" });
}

// ══════════════════════════════════════
//  RESERVATIONS
// ══════════════════════════════════════

export async function getReservations() {
  return request("/reservations");
}

export async function getReservation(id) {
  return request("/reservations/" + id);
}

export async function insertReservation(data) {
  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
