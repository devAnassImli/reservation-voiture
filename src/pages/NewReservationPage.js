import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/apiService";

function NewReservationPage() {
  const { user } = useAuth();
  const [selectedVoiture, setSelectedVoiture] = useState("0");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [destination, setDestination] = useState("");
  const [usineRiva, setUsineRiva] = useState("N");
  const [kmEstime, setKmEstime] = useState("");
  const [voyageurs, setVoyageurs] = useState([]);
  const [newVoyageur, setNewVoyageur] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [voitures, setVoitures] = useState([]);
  const [nbJours, setNbJours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadVoitures(); }, []);

  const loadVoitures = async () => {
    try {
      setLoading(true);
      // Charger toutes les voitures disponibles (W = toutes)
      const data = await api.getFlotte('W');
      setVoitures(data);
    } catch (err) {
      setMessage("ERREUR: " + err.message); setMessageType("error");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (dateDebut && dateFin) {
      const diff = Math.ceil((new Date(dateFin) - new Date(dateDebut)) / (1000 * 60 * 60 * 24));
      setNbJours(diff >= 0 ? diff + 1 : 0);
    } else { setNbJours(0); }
  }, [dateDebut, dateFin]);

  const handleAddVoyageur = () => {
    if (!newVoyageur.trim()) return;
    if (voyageurs.some((v) => v.toLowerCase() === newVoyageur.trim().toLowerCase())) {
      setMessage("CE VOYAGEUR EST DÉJÀ DANS LA LISTE"); setMessageType("error"); return;
    }
    setVoyageurs([...voyageurs, newVoyageur.trim()]); setNewVoyageur(""); setMessage("");
  };

  const handleRemoveVoyageur = (index) => { setVoyageurs(voyageurs.filter((_, i) => i !== index)); };

  const handleSubmit = async () => {
    setMessage("");
    if (selectedVoiture === "0") { setMessage("CHOISISSEZ UNE VOITURE"); setMessageType("error"); return; }
    if (!dateDebut) { setMessage("ENTREZ LA DATE DE DÉBUT"); setMessageType("error"); return; }
    if (!dateFin) { setMessage("ENTREZ LA DATE DE FIN"); setMessageType("error"); return; }
    if (new Date(dateFin) < new Date(dateDebut)) { setMessage("LA DATE DE FIN DOIT ÊTRE APRÈS LA DATE DE DÉBUT"); setMessageType("error"); return; }
    if (!destination.trim()) { setMessage("ENTREZ UNE DESTINATION"); setMessageType("error"); return; }

    try {
      setSubmitting(true);
      const result = await api.insertReservation({
        utentePrenotazione: user?.cognomeNome || "?",
        dataInizio: dateDebut,
        dataFine: dateFin,
        giorni: nbJours,
        kmEstime: kmEstime ? parseInt(kmEstime) : 0,
        destinazione: destination.trim(),
        usineRiva: usineRiva,
        idAuto: parseInt(selectedVoiture),
        voyageurs: voyageurs,
      });

      setMessage("✅ " + result.message);
      setMessageType("success");

      // Reset
      setSelectedVoiture("0"); setDateDebut(""); setDateFin("");
      setDestination(""); setUsineRiva("N"); setKmEstime("");
      setVoyageurs([]); setNewVoyageur("");
    } catch (err) {
      setMessage(err.message); setMessageType("error");
    } finally { setSubmitting(false); }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) return <div className="page-panel"><p style={{ textAlign: "center", color: "#888", padding: 40 }}>Chargement...</p></div>;

  return (
    <div className="page-panel" style={{ textAlign: "left" }}>
      <h2 className="marques-title">NOUVELLE RÉSERVATION</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}
      <div className="resa-form" style={{ maxWidth: 700 }}>
        <div className="resa-row"><label className="resa-label">Demandeur :</label><span className="resa-value">{user?.cognomeNome}</span></div>
        <div className="resa-row"><label className="resa-label">Destination :</label>
          <div className="resa-radio-group">
            <label className="resa-radio"><input type="radio" name="usineRiva" value="O" checked={usineRiva === "O"} onChange={(e) => setUsineRiva(e.target.value)} /> Usine Riva</label>
            <label className="resa-radio"><input type="radio" name="usineRiva" value="N" checked={usineRiva === "N"} onChange={(e) => setUsineRiva(e.target.value)} /> Autre destination</label>
          </div></div>
        <div className="resa-row"><label className="resa-label">Lieu :</label><input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="resa-input" placeholder="ex: SAM Montereau, Paris..." /></div>
        <div className="resa-row"><label className="resa-label">Voiture :</label>
          <select value={selectedVoiture} onChange={(e) => setSelectedVoiture(e.target.value)} className="resa-select">
            <option value="0">Choisir une voiture...</option>
            {voitures.map((v) => <option key={v.IdAuto} value={v.IdAuto}>{v.Marca} {v.Modello} — {v.Targa}</option>)}
          </select></div>
        <div className="resa-row"><label className="resa-label">Date début :</label><input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} min={today} className="resa-input-date" /></div>
        <div className="resa-row"><label className="resa-label">Date fin :</label><input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} min={dateDebut || today} className="resa-input-date" /></div>
        <div className="resa-row"><label className="resa-label">Nombre de jours :</label><span className="resa-jours">{nbJours > 0 ? nbJours + " jour(s)" : "—"}</span></div>
        <div className="resa-row"><label className="resa-label">Km estimé :</label><input type="number" value={kmEstime} onChange={(e) => setKmEstime(e.target.value)} className="resa-input" style={{ width: 120 }} placeholder="ex: 150" /></div>
        <div className="resa-voyageurs-section">
          <label className="resa-label" style={{ marginBottom: 8, display: "block" }}><strong>Voyageurs :</strong></label>
          {voyageurs.length > 0 && (
            <div className="resa-voyageurs-list">
              {voyageurs.map((v, i) => (
                <div key={i} className="resa-voyageur-item"><span>👤 {v}</span><button onClick={() => handleRemoveVoyageur(i)} className="resa-voyageur-remove" title="Supprimer">✕</button></div>
              ))}
            </div>
          )}
          <div className="resa-voyageur-add">
            <input type="text" value={newVoyageur} onChange={(e) => setNewVoyageur(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddVoyageur(); } }} className="resa-input" placeholder="Nom du voyageur" style={{ flex: 1 }} />
            <button onClick={handleAddVoyageur} className="btn-add-voyageur">+ Ajouter</button>
          </div>
        </div>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button onClick={handleSubmit} disabled={submitting} className="btn-submit-resa">
            {submitting ? "Création en cours..." : "CRÉER LA RÉSERVATION"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewReservationPage;