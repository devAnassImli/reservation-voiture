// ─────────────────────────────────────────────
// mockData.js
// Toutes les données simulées (mock)
// Plus tard tu remplaceras par des appels fetch() vers ton API
// ─────────────────────────────────────────────

// ── Utilisateurs mock (pour le login) ──
const MOCK_USERS = [
  {
    username: "anass.imli",
    password: "test123",
    cognomeNome: "IMLI Anass",
    email: "anass.imli@rivagroup.com",
    tipoIngresso: "1",
    codice: "1",
  },
  {
    username: "test",
    password: "test",
    cognomeNome: "TEST Utilisateur",
    email: "test@rivagroup.com",
    tipoIngresso: "1",
    codice: "1",
  },
];

// ── Fonction login mock ──
export async function mockLogin(username, password) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const found = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!found) {
    return { success: false, error: "NOM D'UTILISATEUR OU MOT DE PASSE INCORRECT" };
  }
  return {
    success: true,
    data: {
      cognomeNome: found.cognomeNome,
      email: found.email,
      tipoIngresso: found.tipoIngresso,
      codice: found.codice,
    },
  };
}

// ── Marques mock ──
export const MOCK_MARQUES_INITIAL = [
  { IdMarca: 1, Marca: "RENAULT" },
  { IdMarca: 2, Marca: "PEUGEOT" },
  { IdMarca: 3, Marca: "CITROEN" },
  { IdMarca: 4, Marca: "DACIA" },
  { IdMarca: 5, Marca: "FIAT" },
];

// ── Modèles mock ──
export const MOCK_MODELES_INITIAL = [
  { IdModello: 1, IdMarca: 1, Marca: "RENAULT", Modello: "CLIO", Cilindrata: 1200 },
  { IdModello: 2, IdMarca: 1, Marca: "RENAULT", Modello: "MEGANE", Cilindrata: 1500 },
  { IdModello: 3, IdMarca: 2, Marca: "PEUGEOT", Modello: "208", Cilindrata: 1200 },
  { IdModello: 4, IdMarca: 2, Marca: "PEUGEOT", Modello: "308", Cilindrata: 1600 },
  { IdModello: 5, IdMarca: 3, Marca: "CITROEN", Modello: "C3", Cilindrata: 1200 },
  { IdModello: 6, IdMarca: 4, Marca: "DACIA", Modello: "SANDERO", Cilindrata: 1000 },
  { IdModello: 7, IdMarca: 5, Marca: "FIAT", Modello: "500", Cilindrata: 900 },
];

// ── Voitures mock ──
export const MOCK_VOITURES_INITIAL = [
  { IdAuto: 1, IdModello: 1, Marca: "RENAULT", Modello: "CLIO", Targa: "AB-123-CD", Rottamato: 0, Priorite: "R" },
  { IdAuto: 2, IdModello: 2, Marca: "RENAULT", Modello: "MEGANE", Targa: "EF-456-GH", Rottamato: 0, Priorite: "R" },
  { IdAuto: 3, IdModello: 3, Marca: "PEUGEOT", Modello: "208", Targa: "IJ-789-KL", Rottamato: 0, Priorite: "F" },
  { IdAuto: 4, IdModello: 4, Marca: "PEUGEOT", Modello: "308", Targa: "MN-012-OP", Rottamato: 1, Priorite: "R" },
  { IdAuto: 5, IdModello: 5, Marca: "CITROEN", Modello: "C3", Targa: "QR-345-ST", Rottamato: 0, Priorite: "T" },
  { IdAuto: 6, IdModello: 6, Marca: "DACIA", Modello: "SANDERO", Targa: "UV-678-WX", Rottamato: 0, Priorite: "R" },
  { IdAuto: 7, IdModello: 7, Marca: "FIAT", Modello: "500", Targa: "YZ-901-AB", Rottamato: 1, Priorite: "F" },
];

// ── Réservations mock ──
export const MOCK_RESERVATIONS = [
  {
    IdPrenotazione: 1, IdAuto: 1, Marca: "RENAULT", Modello: "CLIO", Targa: "AB-123-CD",
    UtentePrenotazione: "IMLI Anass", Guidatore: "IMLI Anass",
    ProgressivoPrenotazione: 1, AnnoPrenotazione: 2026,
    DataInizio: "2026-04-15", DataFine: "2026-04-17", Giorni: 3,
    KmEstime: 200, Destinazione: "Paris", UsineRiva: "N",
    ValidationRH: 0, Voyageurs: ["DUPONT Jean", "MARTIN Pierre"],
    InsertData: "09/04/2026 14:30",
  },
  {
    IdPrenotazione: 2, IdAuto: 3, Marca: "PEUGEOT", Modello: "208", Targa: "IJ-789-KL",
    UtentePrenotazione: "COPPOLA Manlio", Guidatore: "COPPOLA Manlio",
    ProgressivoPrenotazione: 2, AnnoPrenotazione: 2026,
    DataInizio: "2026-04-20", DataFine: "2026-04-20", Giorni: 1,
    KmEstime: 50, Destinazione: "SAM Montereau", UsineRiva: "O",
    ValidationRH: 1, Voyageurs: [],
    InsertData: "09/04/2026 15:00",
  },
  {
    IdPrenotazione: 3, IdAuto: 6, Marca: "DACIA", Modello: "SANDERO", Targa: "UV-678-WX",
    UtentePrenotazione: "IMLI Anass", Guidatore: "KORNAK Didier",
    ProgressivoPrenotazione: 3, AnnoPrenotazione: 2026,
    DataInizio: "2026-05-01", DataFine: "2026-05-03", Giorni: 3,
    KmEstime: 350, Destinazione: "Lyon", UsineRiva: "N",
    ValidationRH: 0, Voyageurs: ["KORNAK Didier", "IMLI Anass", "BERNARD Sophie"],
    InsertData: "10/04/2026 09:15",
  },
];
