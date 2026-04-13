// ─────────────────────────────────────────────
// api/apiService.js — Tous les appels vers le backend
//
// Ce fichier centralise TOUS les appels fetch() vers l'API.
// 
// Équivalent de ConfigurationHelper.DBHelper.DoJob() en C#
//
// En C# :
//   DataSet ds = ConfigurationHelper.DBHelper.DoJob("get_marche", htValues);
//
// En React :
//   const marques = await apiService.getMarques();
//
// POURQUOI un fichier séparé ?
//   - Si l'URL de l'API change, on modifie UN seul fichier
//   - Si on ajoute JWT plus tard, on l'ajoute UN seul endroit
//   - C'est de la bonne architecture en couches (CP6 !)
// ─────────────────────────────────────────────

const API_URL = '/api';  // grâce au proxy, pas besoin de http://localhost:5000

// ── Fonction utilitaire pour les requêtes ──
async function request(url, options = {}) {
  const response = await fetch(API_URL + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erreur serveur');
  }

  return data;
}

// ══════════════════════════════════════
//  AUTH
// ══════════════════════════════════════

export async function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ══════════════════════════════════════
//  MARQUES
// ══════════════════════════════════════

export async function getMarques() {
  return request('/marques');
}

export async function insertMarque(marca) {
  return request('/marques', {
    method: 'POST',
    body: JSON.stringify({ marca }),
  });
}

export async function deleteMarque(id) {
  return request('/marques/' + id, { method: 'DELETE' });
}

// ══════════════════════════════════════
//  MODELES
// ══════════════════════════════════════

export async function getModeles() {
  return request('/modeles');
}

export async function insertModele(idMarca, modello, cilindrata) {
  return request('/modeles', {
    method: 'POST',
    body: JSON.stringify({ idMarca, modello, cilindrata }),
  });
}

export async function deleteModele(id) {
  return request('/modeles/' + id, { method: 'DELETE' });
}

// ══════════════════════════════════════
//  VOITURES
// ══════════════════════════════════════

export async function getVoitures() {
  return request('/voitures');
}

export async function getFlotte(priorite) {
  return request('/voitures/flotte/' + priorite);
}

export async function insertVoiture(data) {
  return request('/voitures', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteVoiture(id) {
  return request('/voitures/' + id, { method: 'DELETE' });
}

// ══════════════════════════════════════
//  RESERVATIONS
// ══════════════════════════════════════

export async function getReservations() {
  return request('/reservations');
}

export async function getReservation(id) {
  return request('/reservations/' + id);
}

export async function insertReservation(data) {
  return request('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}