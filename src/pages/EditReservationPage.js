import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/apiService";
 
function EditReservationPage() {
  const { user } = useAuth();
  const role = user?.role || "employe";
 
  const [reservations, setReservations] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedResa, setSelectedResa] = useState(null);
  const [editDateDebut, setEditDateDebut] = useState("");
  const [editDateFin, setEditDateFin] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editKm, setEditKm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => { loadReservations(); }, []);
 
  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await api.getReservations();
      setReservations(data);
    } catch (err) {
      setMessage("ERREUR: " + err.message);
      setMessageType("error");
    } finally { setLoading(false); }
  };
 
  const handleViewDetail = (r) => { setSelectedResa(r); setViewMode("detail"); setMessage(""); };
 
  const handleStartEdit = (r) => {
    setSelectedResa(r);
    const fmt = (d) => { if (!d) return ""; return new Date(d).toISOString().split("T")[0]; };
    setEditDateDebut(fmt(r.DataInizio));
    setEditDateFin(fmt(r.DataFine));
    setEditDestination(r.Destinazione);
    setEditKm(r.KmEstime ? r.KmEstime.toString() : "");
    setViewMode("edit");
    setMessage("");
  };
 
  const handleSaveEdit = async () => {
    if (!editDateDebut || !editDateFin || !editDestination.trim()) {
      setMessage("REMPLISSEZ TOUS LES CHAMPS"); setMessageType("error"); return;
    }
    const jours = Math.ceil((new Date(editDateFin) - new Date(editDateDebut)) / (1000 * 60 * 60 * 24)) + 1;
    if (jours <= 0) { setMessage("LA DATE DE FIN DOIT ETRE APRES LA DATE DE DEBUT"); setMessageType("error"); return; }
 
    try {
      await api.updateReservation(selectedResa.IdPrenotazione, {
        dataInizio: editDateDebut,
        dataFine: editDateFin,
        giorni: jours,
        destinazione: editDestination.trim(),
        kmEstime: editKm ? parseInt(editKm) : 0,
      });
      setMessage("RESERVATION MODIFIEE AVEC SUCCES"); setMessageType("success");
      await loadReservations();
      setViewMode("list"); setSelectedResa(null);
    } catch (err) {
      setMessage("ERREUR: " + err.message); setMessageType("error");
    }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Etes-vous sur de vouloir supprimer cette reservation ?")) return;
    try {
      await api.deleteReservation(id);
      setMessage("RESERVATION SUPPRIMEE"); setMessageType("success");
      await loadReservations();
      setViewMode("list"); setSelectedResa(null);
    } catch (err) {
      setMessage("ERREUR: " + err.message); setMessageType("error");
    }
  };
 
  const handleValidation = async (id, statut) => {
    try {
      await api.validerReservation(id, statut, "");
      const msg = statut === 1 ? "RESERVATION VALIDEE PAR LES RH" : "RESERVATION REFUSEE PAR LES RH";
      setMessage(msg);
      setMessageType(statut === 1 ? "success" : "error");
      await loadReservations();
      setViewMode("list"); setSelectedResa(null);
    } catch (err) {
      setMessage("ERREUR: " + err.message); setMessageType("error");
    }
  };
 
  const handleBackToList = () => { setViewMode("list"); setSelectedResa(null); setMessage(""); };
 
  const canEdit = (r) => {
    if (role === "admin") return true;
    if (role === "employe" && r.UtentePrenotazione === user?.cognomeNome) return true;
    return false;
  };
 
  const renderValidation = (val) => {
    if (val === 1) return <span style={{ background: "#e6f7e9", color: "#1a7a2e", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>VALIDEE</span>;
    if (val === 2) return <span style={{ background: "#fde8e8", color: "#c53030", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>REFUSEE</span>;
    return <span style={{ background: "#fef3e2", color: "#b8860b", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>EN ATTENTE</span>;
  };
 
  const formatDate = (d) => { if (!d) return "-"; try { return new Date(d).toLocaleDateString("fr-FR"); } catch { return d; } };
 
  const pageTitle = role === "employe" ? "MES RESERVATIONS" : "GESTION DES RESERVATIONS";
 
  if (loading) return <div className="page-panel"><p style={{ textAlign: "center", color: "#888", padding: 40 }}>Chargement...</p></div>;
 
  return (
    <div className="page-panel" style={{ textAlign: "left", maxWidth: "100%", padding: 24 }}>
      <h2 className="marques-title">{pageTitle}</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}
 
      {/* ═══════ MODE LISTE ═══════ */}
      {viewMode === "list" && (
        <div>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>
            {reservations.length} reservation{reservations.length > 1 ? "s" : ""}
            {role === "employe" && " (vos reservations uniquement)"}
          </p>
          <div style={{ overflowX: "auto" }}>
            <table className="marques-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ACTIONS</th>
                  <th style={{ width: 60 }}>N</th>
                  <th>VOITURE</th>
                  <th>PLAQUE</th>
                  {(role === "admin" || role === "rh") && <th>DEMANDEUR</th>}
                  <th>DU</th>
                  <th>AU</th>
                  <th>JOURS</th>
                  <th>DESTINATION</th>
                  <th style={{ width: 100 }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.IdPrenotazione}>
                    <td><button className="btn-select" onClick={() => handleViewDetail(r)}>Voir</button></td>
                    <td>{r.ProgressivoPrenotazione}/{r.AnnoPrenotazione}</td>
                    <td>{r.Marca} {r.Modello}</td>
                    <td><strong>{r.Targa}</strong></td>
                    {(role === "admin" || role === "rh") && <td>{r.UtentePrenotazione}</td>}
                    <td>{formatDate(r.DataInizio)}</td>
                    <td>{formatDate(r.DataFine)}</td>
                    <td>{r.Giorni}</td>
                    <td style={{ textAlign: "left", paddingLeft: 12 }}>{r.Destinazione}</td>
                    <td>{renderValidation(r.ValidationRH)}</td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan={10} style={{ color: "#999", padding: 20 }}>Aucune reservation</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
 
      {/* ═══════ MODE DETAIL (plein écran) ═══════ */}
      {viewMode === "detail" && selectedResa && (
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 30, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
 
          {/* Header avec numéro + statut */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #2E75B6" }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#1a3a5c" }}>
                RESERVATION N {selectedResa.ProgressivoPrenotazione}/{selectedResa.AnnoPrenotazione}
              </span>
              <span style={{ marginLeft: 16 }}>{renderValidation(selectedResa.ValidationRH)}</span>
            </div>
            <button onClick={handleBackToList} style={{ background: "transparent", border: "2px solid #ddd", borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#666" }}>
              Retour a la liste
            </button>
          </div>
 
          {/* Infos véhicule */}
          <div style={{ background: "#f0f6ff", border: "1px solid #d0e0f0", borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#2E75B6", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>VEHICULE</div>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: 12, color: "#888" }}>Marque</span>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{selectedResa.Marca}</div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: "#888" }}>Modele</span>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{selectedResa.Modello}</div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: "#888" }}>Plaque</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#2E75B6" }}>{selectedResa.Targa}</div>
              </div>
            </div>
          </div>
 
          {/* Infos réservation */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Demandeur</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{selectedResa.UtentePrenotazione}</div>
            </div>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Destination</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>
                {selectedResa.Destinazione} {selectedResa.UsineRiva === "O" ? " (Usine Riva)" : ""}
              </div>
            </div>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Periode</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>
                {formatDate(selectedResa.DataInizio)} au {formatDate(selectedResa.DataFine)} ({selectedResa.Giorni} jour{selectedResa.Giorni > 1 ? "s" : ""})
              </div>
            </div>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Km estime</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{selectedResa.KmEstime || "-"} km</div>
            </div>
          </div>
 
          {/* Voyageurs */}
          {selectedResa.Voyageurs && selectedResa.Voyageurs.length > 0 && (
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Voyageurs</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {selectedResa.Voyageurs.map((v, i) => (
                  <span key={i} style={{ background: "#e8f0fe", color: "#2E75B6", padding: "4px 12px", borderRadius: 12, fontSize: 13 }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
 
          {/* ═══ BOUTONS D'ACTION — tous sur la même ligne ═══ */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
            paddingTop: 20, borderTop: "1px solid #eee",
          }}>
 
            {/* Modifier (employé proprio ou admin) */}
            {canEdit(selectedResa) && (
              <button
                onClick={() => handleStartEdit(selectedResa)}
                style={{ background: "#2E75B6", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                MODIFIER
              </button>
            )}
 
            {/* Supprimer (employé proprio ou admin) */}
            {canEdit(selectedResa) && (
              <button
                onClick={() => handleDelete(selectedResa.IdPrenotazione)}
                style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                SUPPRIMER
              </button>
            )}
 
            {/* Valider RH (rh ou admin) */}
            {(role === "rh" || role === "admin") && (
              <button
                onClick={() => handleValidation(selectedResa.IdPrenotazione, 1)}
                style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                VALIDER (RH)
              </button>
            )}
 
            {/* Refuser RH (rh ou admin) */}
            {(role === "rh" || role === "admin") && (
              <button
                onClick={() => handleValidation(selectedResa.IdPrenotazione, 2)}
                style={{ background: "#D85A30", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                REFUSER (RH)
              </button>
            )}
 
            {/* Consultation uniquement */}
            {!canEdit(selectedResa) && role !== "rh" && role !== "admin" && (
              <span style={{ color: "#888", fontSize: 13, fontStyle: "italic" }}>Consultation uniquement</span>
            )}
          </div>
        </div>
      )}
 
      {/* ═══════ MODE EDITION ═══════ */}
      {viewMode === "edit" && selectedResa && (
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 30, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
 
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #2E75B6" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1a3a5c" }}>
              MODIFIER RESERVATION N {selectedResa.ProgressivoPrenotazione}/{selectedResa.AnnoPrenotazione}
            </span>
            <button onClick={handleBackToList} style={{ background: "transparent", border: "2px solid #ddd", borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#666" }}>
              Annuler
            </button>
          </div>
 
          {/* Véhicule (non modifiable) */}
          <div style={{ background: "#f0f6ff", border: "1px solid #d0e0f0", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#888" }}>Vehicule (non modifiable)</span>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#333", marginTop: 4 }}>
              {selectedResa.Marca} {selectedResa.Modello} — {selectedResa.Targa}
            </div>
          </div>
 
          {/* Champs modifiables */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <label style={{ width: 140, fontWeight: 600, color: "#333", fontSize: 15 }}>Date debut :</label>
            <input type="date" value={editDateDebut} onChange={(e) => setEditDateDebut(e.target.value)} className="resa-input-date" style={{ width: 200 }} />
          </div>
 
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <label style={{ width: 140, fontWeight: 600, color: "#333", fontSize: 15 }}>Date fin :</label>
            <input type="date" value={editDateFin} onChange={(e) => setEditDateFin(e.target.value)} className="resa-input-date" style={{ width: 200 }} />
          </div>
 
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <label style={{ width: 140, fontWeight: 600, color: "#333", fontSize: 15 }}>Destination :</label>
            <input type="text" value={editDestination} onChange={(e) => setEditDestination(e.target.value)} className="resa-input" style={{ flex: 1, maxWidth: 400 }} />
          </div>
 
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            <label style={{ width: 140, fontWeight: 600, color: "#333", fontSize: 15 }}>Km estime :</label>
            <input type="number" value={editKm} onChange={(e) => setEditKm(e.target.value)} className="resa-input" style={{ width: 150 }} />
          </div>
 
          <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid #eee" }}>
            <button onClick={handleSaveEdit} style={{ background: "#2E75B6", color: "#fff", border: "none", borderRadius: 6, padding: "12px 40px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              SAUVEGARDER
            </button>
            <button onClick={handleBackToList} style={{ background: "transparent", color: "#666", border: "2px solid #ddd", borderRadius: 6, padding: "10px 30px", fontSize: 14, cursor: "pointer" }}>
              ANNULER
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default EditReservationPage;