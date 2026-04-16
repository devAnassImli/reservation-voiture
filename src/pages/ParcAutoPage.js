import { useState, useEffect } from "react";
import * as api from "../api/apiService";

function ParcAutoPage() {
  const [voitures, setVoitures] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [selectedModello, setSelectedModello] = useState("0");
  const [newTarga, setNewTarga] = useState("");
  const [newRottamato, setNewRottamato] = useState(false);
  const [newPriorite, setNewPriorite] = useState("R");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [voituresData, modelesData] = await Promise.all([
        api.getVoitures(),
        api.getModeles(),
      ]);
      setVoitures(voituresData);
      setModeles(modelesData);
    } catch (err) { setMessage("ERREUR: " + err.message); setMessageType("error"); }
    finally { setLoading(false); }
  };

const handleInsert = async () => {
    setMessage("");
    if (selectedModello === "0") { setMessage("CHOISISSEZ UN MODÈLE"); setMessageType("error"); return; }
    if (!newTarga.trim()) { setMessage("ENTREZ UNE PLAQUE"); setMessageType("error"); return; }

    try {
      if (selectedId) {
        // MODE MODIFICATION (PUT)
        await api.updateVoiture(selectedId, {
          idModello: parseInt(selectedModello),
          targa: newTarga.trim(),
          rottamato: newRottamato ? 1 : 0,
          priorite: newPriorite,
        });
        setMessage("VOITURE MODIFIÉE AVEC SUCCÈS");
      } else {
        // MODE INSERTION (POST)
        await api.insertVoiture({
          idModello: parseInt(selectedModello),
          targa: newTarga.trim(),
          rottamato: newRottamato ? 1 : 0,
          priorite: newPriorite,
        });
        setMessage("VOITURE AJOUTÉE AVEC SUCCÈS");
      }
      setMessageType("success");
      resetForm();
      await loadData();
    } catch (err) { setMessage(err.message); setMessageType("error"); }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await api.deleteVoiture(selectedId);
      setMessage("VOITURE SUPPRIMÉE"); setMessageType("success");
      resetForm();
      await loadData();
    } catch (err) { setMessage(err.message); setMessageType("error"); }
  };

  const handleSelect = (v) => {
    setSelectedId(v.IdAuto); setSelectedModello(v.IdModello ? v.IdModello.toString() : "0");
    setNewTarga(v.Targa); setNewRottamato(v.Rottamato === 1);
    setNewPriorite(v.Priorite || "R"); setMessage("");
  };

  const resetForm = () => { setSelectedId(null); setSelectedModello("0"); setNewTarga(""); setNewRottamato(false); setNewPriorite("R"); };

  if (loading) return <div className="page-panel"><p style={{ textAlign: "center", color: "#888", padding: 40 }}>Chargement...</p></div>;

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
                  <td><span className={"priorite-badge priorite-" + (v.Priorite || "r").toLowerCase()}>{v.Priorite === "R" ? "Riva" : v.Priorite === "F" ? "Formation" : v.Priorite === "T" ? "Transport" : v.Priorite}</span></td>
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
          <div className="marques-form-row"><label className="marques-form-label"><strong>Plaque:</strong></label>
            <input type="text" value={newTarga} onChange={(e) => setNewTarga(e.target.value)} className="marques-form-input" style={{ width: 230 }} placeholder="ex: AB-123-CD" /></div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>Priorité:</strong></label>
            <select value={newPriorite} onChange={(e) => setNewPriorite(e.target.value)} className="modeles-select" style={{ width: 230 }}>
              <option value="R">Usine Riva</option><option value="F">Formation</option><option value="T">Transport</option>
            </select></div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>Hors service:</strong></label>
            <div className="parc-checkbox-wrapper"><input type="checkbox" checked={newRottamato} onChange={(e) => setNewRottamato(e.target.checked)} className="parc-checkbox" id="chkRottamato" />
              <label htmlFor="chkRottamato" className="parc-checkbox-label">{newRottamato ? "OUI — hors service" : "NON — disponible"}</label></div></div>
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