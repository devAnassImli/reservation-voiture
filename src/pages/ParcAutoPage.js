import { useState } from "react";
import { MOCK_MODELES_INITIAL, MOCK_VOITURES_INITIAL } from "../data/mockData";

function ParcAutoPage() {
  const [voitures, setVoitures] = useState(MOCK_VOITURES_INITIAL);
  const [modeles] = useState(MOCK_MODELES_INITIAL);
  const [selectedModello, setSelectedModello] = useState("0");
  const [newTarga, setNewTarga] = useState("");
  const [newRottamato, setNewRottamato] = useState(false);
  const [newPriorite, setNewPriorite] = useState("R");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleInsert = () => {
    setMessage("");
    if (selectedModello === "0") { setMessage("CHOISISSEZ UN MODÈLE"); setMessageType("error"); return; }
    if (!newTarga.trim()) { setMessage("ENTREZ UNE PLAQUE D'IMMATRICULATION"); setMessageType("error"); return; }
    const modele = modeles.find((m) => m.IdModello === parseInt(selectedModello));
    if (selectedId) {
      setVoitures(voitures.map((v) => {
        if (v.IdAuto === selectedId) { return { ...v, IdModello: parseInt(selectedModello), Marca: modele ? modele.Marca : v.Marca, Modello: modele ? modele.Modello : v.Modello, Targa: newTarga.trim().toUpperCase(), Rottamato: newRottamato ? 1 : 0, Priorite: newPriorite }; }
        return v;
      }));
      setMessage("VOITURE MISE À JOUR"); setMessageType("success");
    } else {
      const newId = voitures.length > 0 ? Math.max(...voitures.map((v) => v.IdAuto)) + 1 : 1;
      setVoitures([...voitures, { IdAuto: newId, IdModello: parseInt(selectedModello), Marca: modele ? modele.Marca : "?", Modello: modele ? modele.Modello : "?", Targa: newTarga.trim().toUpperCase(), Rottamato: newRottamato ? 1 : 0, Priorite: newPriorite }]);
      setMessage("VOITURE AJOUTÉE AVEC SUCCÈS"); setMessageType("success");
    }
    resetForm();
  };

  const handleSelect = (v) => { setSelectedId(v.IdAuto); setSelectedModello(v.IdModello.toString()); setNewTarga(v.Targa); setNewRottamato(v.Rottamato === 1); setNewPriorite(v.Priorite || "R"); setMessage(""); };

  const handleDelete = () => { if (!selectedId) return; setVoitures(voitures.filter((v) => v.IdAuto !== selectedId)); setMessage("VOITURE SUPPRIMÉE"); setMessageType("success"); resetForm(); };

  const resetForm = () => { setSelectedId(null); setSelectedModello("0"); setNewTarga(""); setNewRottamato(false); setNewPriorite("R"); };

  return (
    <div className="page-panel">
      <h2 className="marques-title">PARC AUTO</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}
      <div className="marques-layout">
        <div className="marques-table-container" style={{ maxHeight: 500 }}>
          <table className="marques-table">
            <thead><tr><th style={{ width: 50 }}>SEL.</th><th style={{ width: 40 }}>ID</th><th>MARQUE</th><th>MODÈLE</th><th>PLAQUE</th><th style={{ width: 80 }}>PRIORITÉ</th><th style={{ width: 100 }}>HORS SERVICE</th></tr></thead>
            <tbody>
              {voitures.map((v) => (
                <tr key={v.IdAuto} className={selectedId === v.IdAuto ? "row-selected" : ""}>
                  <td><button className="btn-select" onClick={() => handleSelect(v)}>SEL.</button></td>
                  <td>{v.IdAuto}</td><td>{v.Marca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>{v.Modello}</td>
                  <td><strong>{v.Targa}</strong></td>
                  <td><span className={"priorite-badge priorite-" + (v.Priorite || "R").toLowerCase()}>{v.Priorite === "R" ? "Riva" : v.Priorite === "F" ? "Formation" : v.Priorite === "T" ? "Transport" : v.Priorite}</span></td>
                  <td style={{ background: v.Rottamato === 1 ? "#cc0000" : "#008800", color: "#fff", fontWeight: 700, fontSize: 12 }}>{v.Rottamato === 1 ? "OUI" : "NON"}</td>
                </tr>
              ))}
              {voitures.length === 0 && <tr><td colSpan={7} style={{ color: "#999", padding: 20 }}>Aucune voiture</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="marques-form" style={{ minWidth: 360 }}>
          <div className="marques-form-row"><label className="marques-form-label"><strong>Modèle:</strong></label>
            <select value={selectedModello} onChange={(e) => setSelectedModello(e.target.value)} className="modeles-select" style={{ width: 230 }}>
              <option value="0">Choisir...</option>{modeles.map((m) => <option key={m.IdModello} value={m.IdModello}>{m.Marca} - {m.Modello}</option>)}
            </select></div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>Plaque:</strong></label><input type="text" value={newTarga} onChange={(e) => setNewTarga(e.target.value)} className="marques-form-input" style={{ width: 230 }} placeholder="ex: AB-123-CD" /></div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>Priorité:</strong></label>
            <select value={newPriorite} onChange={(e) => setNewPriorite(e.target.value)} className="modeles-select" style={{ width: 230 }}>
              <option value="R">Usine Riva</option><option value="F">Formation</option><option value="T">Transport</option>
            </select></div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>Hors service:</strong></label>
            <div className="parc-checkbox-wrapper"><input type="checkbox" checked={newRottamato} onChange={(e) => setNewRottamato(e.target.checked)} className="parc-checkbox" id="chkRottamato" />
              <label htmlFor="chkRottamato" className="parc-checkbox-label">{newRottamato ? "OUI — véhicule hors service" : "NON — véhicule disponible"}</label></div></div>
          <div className="marques-form-buttons" style={{ marginTop: 8 }}>
            {selectedId && <button onClick={resetForm} className="btn-cancel" style={{ marginBottom: 4 }}>↩ Retour insertion</button>}
            <button onClick={handleInsert} className="btn-insert">{selectedId ? "METTRE À JOUR" : "INSÉRER VOITURE"}</button>
            {selectedId && <button onClick={handleDelete} className="btn-delete">SUPPRIMER VOITURE</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParcAutoPage;
