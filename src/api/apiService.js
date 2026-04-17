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

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const response = await fetch(API_URL + url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("rv_user");
    localStorage.removeItem("rv_token");
    window.location.reload();
    throw new Error("SESSION EXPIRÉE — Reconnectez-vous");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Erreur serveur — réponse invalide (code " + response.status + ")");
  }

  if (!response.ok) {
    throw new Error(data.error || "Erreur serveur (code " + response.status + ")");
  }
return data ; 
  

 
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

export async function deleteReservation(id) {
  return request(`/reservations/${id}`, { method: "DELETE" });
}

export async function updateReservation(id, data) {
  return request(`/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export async function updateMarque(id, marca) {
  return request(`/marques/${id}`, {
    method: "PUT",
    body: JSON.stringify({ marca }),
  });
}

export async function updateModele(id, data) {
  return request(`/modeles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateVoiture(id, data) {
  return request(`/voitures/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export async function validerReservation(id, validationRH, note) {
  return request(`/reservations/${id}/validation`, {
    method: "PATCH",
    body: JSON.stringify({ validationRH, note }),
  });
}

export const getVoituresFlotte = getFlotte;
export const createReservation = insertReservation;
