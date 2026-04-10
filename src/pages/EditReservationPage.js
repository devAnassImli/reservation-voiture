import { useState } from "react";
import { MOCK_RESERVATIONS } from "../data/mockData";

function EditReservationPage() {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [viewMode, setViewMode] = useState("list");
  const [selectedResa, setSelectedResa] = useState(null);
  const [editDateDebut, setEditDateDebut] = useState("");
  const [editDateFin, setEditDateFin] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editKm, setEditKm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleViewDetail = (r) => { setSelectedResa(r); setViewMode("detail"); setMessage(""); };

  const handleStartEdit = (r) => {
    setSelectedResa(r); setEditDateDebut(r.DataInizio); setEditDateFin(r.DataFine);
    setEditDestination(r.Destinazione); setEditKm(r.KmEstime ? r.KmEstime.toString() : ""); setViewMode("edit"); setMessage("");
  };

  const handleSaveEdit = () => {
    if (!editDateDebut || !editDateFin || !editDestination.trim()) { setMessage("REMPLISSEZ TOUS LES CHAMPS"); setMessageType("error"); return; }
    const jours = Math.ceil((new Date(editDateFin) - new Date(editDateDebut)) / (1000 * 60 * 60 * 24)) + 1;
    if (jours <= 0) { setMessage("LA DATE DE FIN DOIT ÊTRE APRÈS LA DATE DE DÉBUT"); setMessageType("error"); return; }
    setReservations(reservations.map((r) => {
      if (r.IdPrenotazione === selectedResa.IdPrenotazione) { return { ...r, DataInizio: editDateDebut, DataFine: editDateFin, Giorni: jours, Destinazione: editDestination.trim(), KmEstime: editKm ? parseInt(editKm) : 0 }; }
      return r;
    }));
    setMessage("RÉSERVATION MODIFIÉE AVEC SUCCÈS"); setMessageType("success"); setViewMode("list"); setSelectedResa(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      setReservations(reservations.filter((r) => r.IdPrenotazione !== id));
      setMessage("RÉSERVATION SUPPRIMÉE"); setMessageType("success"); setViewMode("list"); setSelectedResa(null);
    }
  };

  const handleBackToList = () => { setViewMode("list"); setSelectedResa(null); setMessage(""); };

  const renderValidation = (val) => {
    if (val === 1) return <span className="validation-badge validated">✅ Validée</span>;
    return <span className="validation-badge pending">⏳ En attente</span>;
  };

  return (
    <div className="page-panel" style={{ textAlign: "left" }}>
      <h2 className="marques-title">GESTION DES RÉSERVATIONS</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}

      {viewMode === "list" && (
        <>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>{reservations.length} réservation{reservations.length > 1 ? "s" : ""} trouvée{reservations.length > 1 ? "s" : ""}</p>
          <div className="marques-table-container" style={{ maxHeight: 500 }}>
            <table className="marques-table">
              <thead><tr><th style={{ width: 70 }}>ACTIONS</th><th style={{ width: 50 }}>N°</th><th>VOITURE</th><th>PLAQUE</th><th>DEMANDEUR</th><th>DU</th><th>AU</th><th>JOURS</th><th>DESTINATION</th><th style={{ width: 90 }}>VALIDATION</th></tr></thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.IdPrenotazione}>
                    <td><button className="btn-select" onClick={() => handleViewDetail(r)} title="Voir détails">👁</button></td>
                    <td>{r.ProgressivoPrenotazione}/{r.AnnoPrenotazione}</td><td>{r.Marca} {r.Modello}</td>
                    <td><strong>{r.Targa}</strong></td><td>{r.UtentePrenotazione}</td>
                    <td>{r.DataInizio}</td><td>{r.DataFine}</td><td>{r.Giorni}</td>
                    <td style={{ textAlign: "left", paddingLeft: 12 }}>{r.Destinazione}</td><td>{renderValidation(r.ValidationRH)}</td>
                  </tr>
                ))}
                {reservations.length === 0 && <tr><td colSpan={10} style={{ color: "#999", padding: 20 }}>Aucune réservation</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {viewMode === "detail" && selectedResa && (
        <div className="detail-container">
          <button onClick={handleBackToList} className="btn-back">← Retour à la liste</button>
          <div className="detail-card">
            <div className="detail-header">Réservation N° {selectedResa.ProgressivoPrenotazione}/{selectedResa.AnnoPrenotazione} {renderValidation(selectedResa.ValidationRH)}</div>
            <div className="detail-body">
              <div className="detail-row"><span className="detail-label">Voiture :</span><span>{selectedResa.Marca} {selectedResa.Modello} — <strong>{selectedResa.Targa}</strong></span></div>
              <div className="detail-row"><span className="detail-label">Demandeur :</span><span>{selectedResa.UtentePrenotazione}</span></div>
              <div className="detail-row"><span className="detail-label">Période :</span><span>{selectedResa.DataInizio} → {selectedResa.DataFine} ({selectedResa.Giorni} jour{selectedResa.Giorni > 1 ? "s" : ""})</span></div>
              <div className="detail-row"><span className="detail-label">Destination :</span><span>{selectedResa.Destinazione} {selectedResa.UsineRiva === "O" ? "(Usine Riva)" : ""}</span></div>
              <div className="detail-row"><span className="detail-label">Km estimé :</span><span>{selectedResa.KmEstime || "—"}</span></div>
              {selectedResa.Voyageurs && selectedResa.Voyageurs.length > 0 && <div className="detail-row"><span className="detail-label">Voyageurs :</span><span>{selectedResa.Voyageurs.join(", ")}</span></div>}
              <div className="detail-row"><span className="detail-label">Créée le :</span><span className="detail-date">{selectedResa.InsertData}</span></div>
            </div>
            <div className="detail-actions">
              <button onClick={() => handleStartEdit(selectedResa)} className="btn-insert">✏️ MODIFIER</button>
              <button onClick={() => handleDelete(selectedResa.IdPrenotazione)} className="btn-delete">🗑 SUPPRIMER</button>
            </div>
          </div>
        </div>
      )}

      {viewMode === "edit" && selectedResa && (
        <div className="detail-container">
          <button onClick={handleBackToList} className="btn-back">← Retour à la liste</button>
          <div className="detail-card">
            <div className="detail-header">Modifier Réservation N° {selectedResa.ProgressivoPrenotazione}/{selectedResa.AnnoPrenotazione}</div>
            <div className="detail-body">
              <div className="detail-row"><span className="detail-label">Voiture :</span><span>{selectedResa.Marca} {selectedResa.Modello} — {selectedResa.Targa}</span></div>
              <div className="detail-row"><span className="detail-label">Date début :</span><input type="date" value={editDateDebut} onChange={(e) => setEditDateDebut(e.target.value)} className="resa-input-date" /></div>
              <div className="detail-row"><span className="detail-label">Date fin :</span><input type="date" value={editDateFin} onChange={(e) => setEditDateFin(e.target.value)} className="resa-input-date" /></div>
              <div className="detail-row"><span className="detail-label">Destination :</span><input type="text" value={editDestination} onChange={(e) => setEditDestination(e.target.value)} className="resa-input" style={{ width: 250 }} /></div>
              <div className="detail-row"><span className="detail-label">Km estimé :</span><input type="number" value={editKm} onChange={(e) => setEditKm(e.target.value)} className="resa-input" style={{ width: 120 }} /></div>
            </div>
            <div className="detail-actions">
              <button onClick={handleSaveEdit} className="btn-submit-resa" style={{ padding: "12px 40px", fontSize: 14 }}>💾 SAUVEGARDER</button>
              <button onClick={handleBackToList} className="btn-cancel">ANNULER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditReservationPage;
