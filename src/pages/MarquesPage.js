// ─────────────────────────────────────────────
// MarquesPage.js — Connecté à la VRAIE base de données !
//
// AVANT (mock) :
//   const [marques] = useState(MOCK_MARQUES_INITIAL);
//
// MAINTENANT (API) :
//   useEffect(() => { loadMarques(); }, []);
//   → appelle GET /api/marques → qui appelle ff_get_marche dans SQL Server
//
// C'est comme Page_Load en ASP.NET :
//   if (!IsPostBack) { CaricaMarcheAuto(); }
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import * as api from "../api/apiService";

function MarquesPage() {
  const [marques, setMarques] = useState([]);
  const [newMarque, setNewMarque] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Charger les marques au démarrage ──
  // Comme Page_Load → CaricaMarcheAuto() en C#
  useEffect(() => {
    loadMarques();
  }, []);

  const loadMarques = async () => {
    try {
      setLoading(true);
      const data = await api.getMarques();
      setMarques(data);
    } catch (err) {
      setMessage("ERREUR: " + err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ── Insérer une marque ──
  // ── Insérer OU Modifier une marque ──
  const handleInsert = async () => {
    setMessage("");
    if (!newMarque.trim()) {
      setMessage("ENTREZ UNE MARQUE");
      setMessageType("error");
      return;
    }

    try {
      if (selectedId) {
        // MODE MODIFICATION (PUT)
        await api.updateMarque(selectedId, newMarque.trim());
        setMessage("MARQUE MODIFIÉE AVEC SUCCÈS");
      } else {
        // MODE INSERTION (POST)
        await api.insertMarque(newMarque.trim());
        setMessage("MARQUE AJOUTÉE AVEC SUCCÈS");
      }
      setMessageType("success");
      setNewMarque("");
      setSelectedId(null);
      await loadMarques();
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  // ── Supprimer une marque ──
  const handleDelete = async () => {
    if (selectedId === null) {
      setMessage("SÉLECTIONNEZ UNE MARQUE D'ABORD");
      setMessageType("error");
      return;
    }
    setConfirmDelete(selectedId);
  };

  const confirmDeleteMarque = async () => {
    try {
      await api.deleteMarque(confirmDelete);
      setMessage("MARQUE SUPPRIMÉE");
      setMessageType("success");
      setSelectedId(null);
      setNewMarque("");
      await loadMarques();
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="page-panel">
      <h2 className="marques-title">MARQUES AUTO</h2>
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

      {loading ? (
        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>
          Chargement...
        </p>
      ) : (
        <div className="marques-layout">
          <div className="marques-table-container">
            <table className="marques-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>SEL.</th>
                  <th style={{ width: 60 }}>ID</th>
                  <th>MARQUE</th>
                </tr>
              </thead>
              <tbody>
                {marques.map((m) => (
                  <tr
                    key={m.IdMarca}
                    className={selectedId === m.IdMarca ? "row-selected" : ""}
                  >
                    <td>
                      <button
                        className="btn-select"
                        onClick={() => {
                          setSelectedId(m.IdMarca);
                          setNewMarque(m.Marca);
                          setMessage("");
                        }}
                      >
                        SEL.
                      </button>
                    </td>
                    <td>{m.IdMarca}</td>
                    <td style={{ textAlign: "left", paddingLeft: 12 }}>
                      {m.Marca}
                    </td>
                  </tr>
                ))}
                {marques.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ color: "#999", padding: 20 }}>
                      Aucune marque
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="marques-form">
            <div className="marques-form-row">
              <label className="marques-form-label">
                <strong>MARQUE:</strong>
              </label>
              <input
                type="text"
                value={newMarque}
                onChange={(e) => setNewMarque(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInsert();
                }}
                className="marques-form-input"
                placeholder="Nom de la marque"
              />
            </div>
            <div className="marques-form-buttons">
              <button onClick={handleInsert} className="btn-insert">
                {selectedId ? "MODIFIER MARQUE" : "INSÉRER MARQUE"}
              </button>
              {selectedId && (
                <button onClick={handleDelete} className="btn-delete">
                  SUPPRIMER MARQUE
                </button>
              )}
              {selectedId && (
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setNewMarque("");
                    setMessage("");
                  }}
                  className="btn-cancel"
                >
                  ANNULER
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 30,
              maxWidth: 450,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ margin: "0 0 12px", color: "#1a3a5c" }}>
              Confirmer la suppression
            </h3>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Etes-vous sur de vouloir supprimer cette marque ? Cette action est
              irreversible.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  background: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 30px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ANNULER
              </button>
              <button
                onClick={confirmDeleteMarque}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 30px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                SUPPRIMER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarquesPage;
