import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_VOITURES_INITIAL } from "../data/mockData";

function NewReservationPage() {
  const { user } = useAuth();
  const [selectedVoiture, setSelectedVoiture] = useState("0");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [destination, setDestination] = useState("");
  const [usineRiva, setUsineRiva] = useState("N");
  const [kmEstime, setKmEstime] = useState("");
  const [voyageurs, setVoyageurs] = useState([""]);
  const [newVoyageur, setNewVoyageur] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [voitures] = useState(MOCK_VOITURES_INITIAL.filter((v) => v.Rottamato === 0));
  const [reservations, setReservations] = useState([]);
  const [nbJours, setNbJours] = useState(0);

  useEffect(() => {
    if (dateDebut && dateFin) {
      const diff = Math.ceil((new Date(dateFin) - new Date(dateDebut)) / (1000 * 60 * 60 * 24));
      setNbJours(diff >= 0 ? diff + 1 : 0);
    } else { setNbJours(0); }
  }, [dateDebut, dateFin]);

  const handleAddVoyageur = () => {
    if (!newVoyageur.trim()) return;
    if (voyageurs.some((v) => v.toLowerCase() === newVoyageur.trim().toLowerCase())) { setMessage("CE VOYAGEUR EST DÉJÀ DANS LA LISTE"); setMessageType("error"); return; }
    setVoyageurs([...voyageurs.filter((v) => v !== ""), newVoyageur.trim()]); setNewVoyageur(""); setMessage("");
  };

  const handleRemoveVoyageur = (index) => { setVoyageurs(voyageurs.filter((_, i) => i !== index)); };

  const handleSubmit = () => {
    setMessage("");
    if (selectedVoiture === "0") { setMessage("CHOISISSEZ UNE VOITURE"); setMessageType("error"); return; }
    if (!dateDebut) { setMessage("ENTREZ LA DATE DE DÉBUT"); setMessageType("error"); return; }
    if (!dateFin) { setMessage("ENTREZ LA DATE DE FIN"); setMessageType("error"); return; }
    if (new Date(dateFin) < new Date(dateDebut)) { setMessage("LA DATE DE FIN DOIT ÊTRE APRÈS LA DATE DE DÉBUT"); setMessageType("error"); return; }
    if (!destination.trim()) { setMessage("ENTREZ UNE DESTINATION"); setMessageType("error"); return; }

    const voitureId = parseInt(selectedVoiture);
    const conflit = reservations.find((r) => {
      if (r.IdAuto !== voitureId) return false;
      return new Date(dateDebut) <= new Date(r.DataFine) && new Date(dateFin) >= new Date(r.DataInizio);
    });
    if (conflit) { setMessage("CETTE VOITURE EST DÉJÀ RÉSERVÉE SUR CETTE PÉRIODE"); setMessageType("error"); return; }

    const voiture = voitures.find((v) => v.IdAuto === voitureId);
    const nouvelleReservation = {
      IdPrenotazione: reservations.length + 1, IdAuto: voitureId,
      Marca: voiture ? voiture.Marca : "?", Modello: voiture ? voiture.Modello : "?", Targa: voiture ? voiture.Targa : "?",
      UtentePrenotazione: user?.cognomeNome || "?",
      ProgressivoPrenotazione: reservations.length + 1, AnnoPrenotazione: new Date().getFullYear(),
      DataInizio: dateDebut, DataFine: dateFin, Giorni: nbJours,
      KmEstime: kmEstime ? parseInt(kmEstime) : 0, Destinazione: destination.trim(), UsineRiva: usineRiva,
      GuidTable: "GT" + Date.now().toString().slice(-8),
      Voyageurs: voyageurs.filter((v) => v !== ""), InsertData: new Date().toLocaleString("fr-FR"),
    };
    setReservations([...reservations, nouvelleReservation]);
    setSelectedVoiture("0"); setDateDebut(""); setDateFin(""); setDestination(""); setUsineRiva("N"); setKmEstime(""); setVoyageurs([""]); setNewVoyageur("");
    setMessage("✅ RÉSERVATION N° " + nouvelleReservation.ProgressivoPrenotazione + "/" + nouvelleReservation.AnnoPrenotazione + " CRÉÉE AVEC SUCCÈS"); setMessageType("success");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page-panel" style={{ textAlign: "left" }}>
      <h2 className="marques-title">NOUVELLE RÉSERVATION</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}
      <div className="resa-layout">
        <div className="resa-form">
          <div className="resa-row"><label className="resa-label">Demandeur :</label><span className="resa-value">{user?.cognomeNome}</span></div>
          <div className="resa-row"><label className="resa-label">Destination :</label>
            <div className="resa-radio-group">
              <label className="resa-radio"><input type="radio" name="usineRiva" value="O" checked={usineRiva === "O"} onChange={(e) => setUsineRiva(e.target.value)} /> Usine Riva</label>
              <label className="resa-radio"><input type="radio" name="usineRiva" value="N" checked={usineRiva === "N"} onChange={(e) => setUsineRiva(e.target.value)} /> Autre destination</label>
            </div></div>
          <div className="resa-row"><label className="resa-label">Lieu :</label><input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="resa-input" placeholder="ex: SAM Montereau, Paris, Lyon..." /></div>
          <div className="resa-row"><label className="resa-label">Voiture :</label>
            <select value={selectedVoiture} onChange={(e) => setSelectedVoiture(e.target.value)} className="resa-select">
              <option value="0">Choisir une voiture...</option>{voitures.map((v) => <option key={v.IdAuto} value={v.IdAuto}>{v.Marca} {v.Modello} — {v.Targa}</option>)}
            </select></div>
          <div className="resa-row"><label className="resa-label">Date début :</label><input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} min={today} className="resa-input-date" /></div>
          <div className="resa-row"><label className="resa-label">Date fin :</label><input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} min={dateDebut || today} className="resa-input-date" /></div>
          <div className="resa-row"><label className="resa-label">Nombre de jours :</label><span className="resa-jours">{nbJours > 0 ? nbJours + " jour(s)" : "—"}</span></div>
          <div className="resa-row"><label className="resa-label">Km estimé :</label><input type="number" value={kmEstime} onChange={(e) => setKmEstime(e.target.value)} className="resa-input" style={{ width: 120 }} placeholder="ex: 150" /></div>
          <div className="resa-voyageurs-section">
            <label className="resa-label" style={{ marginBottom: 8, display: "block" }}><strong>Voyageurs :</strong></label>
            {voyageurs.filter((v) => v !== "").length > 0 && (
              <div className="resa-voyageurs-list">
                {voyageurs.filter((v) => v !== "").map((v, i) => (
                  <div key={i} className="resa-voyageur-item"><span>👤 {v}</span><button onClick={() => handleRemoveVoyageur(i)} className="resa-voyageur-remove" title="Supprimer">✕</button></div>
                ))}
              </div>
            )}
            <div className="resa-voyageur-add">
              <input type="text" value={newVoyageur} onChange={(e) => setNewVoyageur(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddVoyageur(); } }} className="resa-input" placeholder="Nom du voyageur" style={{ flex: 1 }} />
              <button onClick={handleAddVoyageur} className="btn-add-voyageur">+ Ajouter</button>
            </div>
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}><button onClick={handleSubmit} className="btn-submit-resa">CRÉER LA RÉSERVATION</button></div>
        </div>
        <div className="resa-list">
          <h3 className="resa-list-title">Réservations créées</h3>
          {reservations.length === 0 ? (
            <p style={{ color: "#999", fontSize: 13, textAlign: "center", marginTop: 20 }}>Aucune réservation pour le moment</p>
          ) : reservations.map((r) => (
            <div key={r.IdPrenotazione} className="resa-card">
              <div className="resa-card-header">Réservation N° {r.ProgressivoPrenotazione}/{r.AnnoPrenotazione}</div>
              <div className="resa-card-body">
                <div><strong>Voiture :</strong> {r.Marca} {r.Modello} — {r.Targa}</div>
                <div><strong>Du :</strong> {r.DataInizio} <strong>au</strong> {r.DataFine} ({r.Giorni} jour{r.Giorni > 1 ? "s" : ""})</div>
                <div><strong>Destination :</strong> {r.Destinazione} {r.UsineRiva === "O" ? "(Usine Riva)" : ""}</div>
                <div><strong>Km estimé :</strong> {r.KmEstime || "—"}</div>
                {r.Voyageurs.length > 0 && <div><strong>Voyageurs :</strong> {r.Voyageurs.join(", ")}</div>}
                <div className="resa-card-date">Créée le {r.InsertData}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewReservationPage;
