// ─────────────────────────────────────────────
// NewReservationPage.js — Pleine page + dropdown usines Riva
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/apiService";

// Liste des usines du Groupe Riva (sites principaux)
const USINES_RIVA = [
  "SAM Montereau (France)",
  "Riva Forni Elettrici - Caronno (Italie)",
  "Riva Acciaio - Lesegno (Italie)",
  "Riva Acciaio - Sellero (Italie)",
  "Riva Acciaio - Verona (Italie)",
  "Ferriera di Cremona (Italie)",
  "Riva Stahl - Hennigsdorf (Allemagne)",
  "Riva Stahl - Brandenburg (Allemagne)",
  "SAM Neuves-Maisons (France)",
  "Iton Seine - Gennevilliers (France)",
];

function NewReservationPage({ onNavigate }) {
  const { user } = useAuth();
  const [voitures, setVoitures] = useState([]);
  const [idAuto, setIdAuto] = useState("");
  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");
  const [destinazione, setDestinazione] = useState("");
  const [usineRiva, setUsineRiva] = useState("N"); // O = usine Riva, N = autre
  const [usineSelectionnee, setUsineSelectionnee] = useState("");
  const [destinationAutre, setDestinationAutre] = useState("");
  const [kmEstime, setKmEstime] = useState("");
  const [voyageurs, setVoyageurs] = useState([]);
  const [voyageurInput, setVoyageurInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVoitures();
  }, []);

  const loadVoitures = async () => {
    try {
      const data = await api.getFlotte("W"); // W = toutes
      setVoitures(data);
    } catch (err) {
      setMessage("ERREUR: " + err.message);
      setMessageType("error");
    }
  };

  const handleAddVoyageur = () => {
    if (voyageurInput.trim()) {
      setVoyageurs([...voyageurs, voyageurInput.trim()]);
      setVoyageurInput("");
    }
  };

  const handleRemoveVoyageur = (i) => {
    setVoyageurs(voyageurs.filter((_, idx) => idx !== i));
  };

  const calcJours = () => {
    if (!dataInizio || !dataFine) return 0;
    return (
      Math.ceil(
        (new Date(dataFine) - new Date(dataInizio)) / (1000 * 60 * 60 * 24),
      ) + 1
    );
  };

  const handleSubmit = async () => {
    setMessage("");
    // Destination finale = usine sélectionnée ou texte libre
    const destinationFinale =
      usineRiva === "O" ? usineSelectionnee : destinationAutre.trim();

    if (!idAuto) {
      setMessage("CHOISISSEZ UNE VOITURE");
      setMessageType("error");
      return;
    }
    if (!dataInizio || !dataFine) {
      setMessage("ENTREZ LES DATES");
      setMessageType("error");
      return;
    }
    if (!destinationFinale) {
      setMessage("ENTREZ UNE DESTINATION");
      setMessageType("error");
      return;
    }
    const jours = calcJours();
    if (jours <= 0) {
      setMessage("LA DATE DE FIN DOIT ÊTRE APRÈS LA DATE DE DÉBUT");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const result = await api.insertReservation({
        dataInizio,
        dataFine,
        giorni: jours,
        kmEstime: kmEstime ? parseInt(kmEstime) : 0,
        destinazione: destinationFinale,
        usineRiva,
        idAuto: parseInt(idAuto),
        voyageurs,
      });
      setMessage(result.message || "RÉSERVATION CRÉÉE");
      setMessageType("success");
      // Reset
      setIdAuto("");
      setDataInizio("");
      setDataFine("");
      setDestinazione("");
      setUsineRiva("N");
      setUsineSelectionnee("");
      setDestinationAutre("");
      setKmEstime("");
      setVoyageurs([]);
    } catch (err) {
      setMessage("ERREUR: " + err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-panel"
      style={{ textAlign: "left", maxWidth: "100%", padding: 24 }}
    >
      <h2 className="marques-title">NOUVELLE RÉSERVATION</h2>
      {message && (
        <div
          className={
            messageType === "error"
              ? "marques-msg-error"
              : "marques-msg-success"
          }
        >
          {message}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 30,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Demandeur */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "1px solid #eee",
          }}
        >
          <label
            style={{ width: 180, fontWeight: 600, color: "#333", fontSize: 15 }}
          >
            Demandeur :
          </label>
          <span style={{ fontSize: 15, color: "#2E75B6", fontWeight: 600 }}>
            👤 {user?.cognomeNome}
          </span>
          <span
            style={{
              marginLeft: 12,
              fontSize: 12,
              color: "#888",
              fontStyle: "italic",
            }}
          >
            (automatique via JWT)
          </span>
        </div>

        {/* Voiture */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
        >
          <label
            style={{ width: 180, fontWeight: 600, color: "#333", fontSize: 15 }}
          >
            Voiture :
          </label>
          <select
            value={idAuto}
            onChange={(e) => setIdAuto(e.target.value)}
            className="resa-select"
            style={{ flex: 1, maxWidth: 500 }}
          >
            <option value="">-- Sélectionnez une voiture --</option>
            {voitures.map((v) => (
              <option key={v.IdAuto} value={v.IdAuto}>
                {v.Marca} {v.Modello} — {v.Targa} ({v.Priorite})
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
        >
          <label
            style={{ width: 180, fontWeight: 600, color: "#333", fontSize: 15 }}
          >
            Date début :
          </label>
          <input
            type="date"
            value={dataInizio}
            onChange={(e) => setDataInizio(e.target.value)}
            className="resa-input-date"
            style={{ width: 200 }}
          />
          <label
            style={{
              marginLeft: 40,
              marginRight: 12,
              fontWeight: 600,
              color: "#333",
              fontSize: 15,
            }}
          >
            Date fin :
          </label>
          <input
            type="date"
            value={dataFine}
            onChange={(e) => setDataFine(e.target.value)}
            className="resa-input-date"
            style={{ width: 200 }}
          />
          {calcJours() > 0 && (
            <span
              style={{
                marginLeft: 20,
                fontSize: 14,
                color: "#2E75B6",
                fontWeight: 600,
              }}
            >
              = {calcJours()} jour{calcJours() > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Type destination */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
        >
          <label
            style={{ width: 180, fontWeight: 600, color: "#333", fontSize: 15 }}
          >
            Type destination :
          </label>
          <div style={{ display: "flex", gap: 20 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                checked={usineRiva === "O"}
                onChange={() => setUsineRiva("O")}
                style={{ marginRight: 6 }}
              />
              <span style={{ fontSize: 14 }}>🏭 Usine Groupe Riva</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                checked={usineRiva === "N"}
                onChange={() => setUsineRiva("N")}
                style={{ marginRight: 6 }}
              />
              <span style={{ fontSize: 14 }}>📍 Autre destination</span>
            </label>
          </div>
        </div>

        {/* Destination (dropdown ou texte) */}
        {usineRiva === "O" ? (
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
          >
            <label
              style={{
                width: 180,
                fontWeight: 600,
                color: "#333",
                fontSize: 15,
              }}
            >
              Usine Riva :
            </label>
            <select
              value={usineSelectionnee}
              onChange={(e) => setUsineSelectionnee(e.target.value)}
              className="resa-select"
              style={{ flex: 1, maxWidth: 500 }}
            >
              <option value="">-- Sélectionnez une usine --</option>
              {USINES_RIVA.map((usine, i) => (
                <option key={i} value={usine}>
                  {usine}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
          >
            <label
              style={{
                width: 180,
                fontWeight: 600,
                color: "#333",
                fontSize: 15,
              }}
            >
              Destination :
            </label>
            <input
              type="text"
              value={destinationAutre}
              onChange={(e) => setDestinationAutre(e.target.value)}
              placeholder="Ville ou lieu..."
              className="resa-input"
              style={{ flex: 1, maxWidth: 500 }}
            />
          </div>
        )}

        {/* Km */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
        >
          <label
            style={{ width: 180, fontWeight: 600, color: "#333", fontSize: 15 }}
          >
            Km estimé :
          </label>
          <input
            type="number"
            value={kmEstime}
            onChange={(e) => setKmEstime(e.target.value)}
            className="resa-input"
            style={{ width: 150 }}
            placeholder="0"
          />
          <span style={{ marginLeft: 10, color: "#888", fontSize: 13 }}>
            km (aller-retour)
          </span>
        </div>

        {/* Voyageurs */}
        <div
          style={{
            marginBottom: 18,
            paddingBottom: 16,
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <label
              style={{
                width: 180,
                fontWeight: 600,
                color: "#333",
                fontSize: 15,
              }}
            >
              Voyageurs :
            </label>
            <input
              type="text"
              value={voyageurInput}
              onChange={(e) => setVoyageurInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddVoyageur()}
              placeholder="Nom prénom du voyageur"
              className="resa-input"
              style={{ flex: 1, maxWidth: 400 }}
            />
            <button
              onClick={handleAddVoyageur}
              className="btn-insert"
              style={{ marginLeft: 10, padding: "8px 20px" }}
            >
              + Ajouter
            </button>
          </div>
          {voyageurs.length > 0 && (
            <div
              style={{
                marginLeft: 180,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {voyageurs.map((v, i) => (
                <span
                  key={i}
                  style={{
                    background: "#e8f0fe",
                    color: "#2E75B6",
                    padding: "6px 12px",
                    borderRadius: 16,
                    fontSize: 13,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  👤 {v}
                  <span
                    onClick={() => handleRemoveVoyageur(i)}
                    style={{
                      cursor: "pointer",
                      fontWeight: 700,
                      color: "#c53030",
                    }}
                  >
                    ✕
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bouton créer */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
        >
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-submit-resa"
            style={{ padding: "14px 50px", fontSize: 15 }}
          >
            {loading ? "⏳ Création en cours..." : "✅ CRÉER LA RÉSERVATION"}
          </button>
        </div>

        {/* Info */}
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "#f0f4f8",
            borderRadius: 6,
            fontSize: 12,
            color: "#666",
            textAlign: "center",
          }}
        >
          ℹ️ La disponibilité de la voiture est vérifiée automatiquement par
          rapport aux maintenances. La réservation sera validée par les RH avant
          la remise des clés.
        </div>
      </div>
    </div>
  );
}

export default NewReservationPage;
