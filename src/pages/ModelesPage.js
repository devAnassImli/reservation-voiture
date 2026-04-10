import { useState } from "react";
import { MOCK_MARQUES_INITIAL, MOCK_MODELES_INITIAL } from "../data/mockData";

function ModelesPage() {
  const [modeles, setModeles] = useState(MOCK_MODELES_INITIAL);
  const [marques] = useState(MOCK_MARQUES_INITIAL);
  const [selectedMarca, setSelectedMarca] = useState("0");
  const [newModele, setNewModele] = useState("");
  const [newCilindrata, setNewCilindrata] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleInsert = () => {
    setMessage("");
    if (selectedMarca === "0") { setMessage("CHOISISSEZ UNE MARQUE"); setMessageType("error"); return; }
    if (!newModele.trim()) { setMessage("ENTREZ UN NOM DE MODÈLE"); setMessageType("error"); return; }
    if (selectedId) {
      setModeles(modeles.map((m) => {
        if (m.IdModello === selectedId) {
          const marque = marques.find((ma) => ma.IdMarca === parseInt(selectedMarca));
          return { ...m, IdMarca: parseInt(selectedMarca), Marca: marque ? marque.Marca : m.Marca, Modello: newModele.trim().toUpperCase(), Cilindrata: newCilindrata.trim() ? parseInt(newCilindrata) : null };
        }
        return m;
      }));
      setMessage("MODÈLE MIS À JOUR"); setMessageType("success");
    } else {
      const newId = modeles.length > 0 ? Math.max(...modeles.map((m) => m.IdModello)) + 1 : 1;
      const marque = marques.find((m) => m.IdMarca === parseInt(selectedMarca));
      setModeles([...modeles, { IdModello: newId, IdMarca: parseInt(selectedMarca), Marca: marque ? marque.Marca : "?", Modello: newModele.trim().toUpperCase(), Cilindrata: newCilindrata.trim() ? parseInt(newCilindrata) : null }]);
      setMessage("MODÈLE AJOUTÉ AVEC SUCCÈS"); setMessageType("success");
    }
    resetForm();
  };

  const handleDelete = () => {
    if (selectedId === null) return;
    setModeles(modeles.filter((m) => m.IdModello !== selectedId));
    setMessage("MODÈLE SUPPRIMÉ"); setMessageType("success"); resetForm();
  };

  const handleSelect = (modele) => {
    setSelectedId(modele.IdModello); setSelectedMarca(modele.IdMarca.toString());
    setNewModele(modele.Modello); setNewCilindrata(modele.Cilindrata ? modele.Cilindrata.toString() : ""); setMessage("");
  };

  const resetForm = () => { setSelectedId(null); setSelectedMarca("0"); setNewModele(""); setNewCilindrata(""); };

  return (
    <div className="page-panel">
      <h2 className="marques-title">MODÈLES AUTO</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}
      <div className="marques-layout">
        <div className="marques-table-container" style={{ maxHeight: 450 }}>
          <table className="marques-table">
            <thead><tr><th style={{ width: 50 }}>SEL.</th><th style={{ width: 40 }}>ID</th><th>MARQUE</th><th>MODÈLE</th><th>CYLINDRÉE</th></tr></thead>
            <tbody>
              {modeles.map((m) => (
                <tr key={m.IdModello} className={selectedId === m.IdModello ? "row-selected" : ""}>
                  <td><button className="btn-select" onClick={() => handleSelect(m)}>SEL.</button></td>
                  <td>{m.IdModello}</td><td>{m.Marca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>{m.Modello}</td>
                  <td>{m.Cilindrata || "—"}</td>
                </tr>
              ))}
              {modeles.length === 0 && <tr><td colSpan={5} style={{ color: "#999", padding: 20 }}>Aucun modèle</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="marques-form" style={{ minWidth: 350 }}>
          <div className="marques-form-row"><label className="marques-form-label"><strong>MARQUE:</strong></label>
            <select value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)} className="modeles-select">
              <option value="0">Choisir...</option>
              {marques.map((m) => <option key={m.IdMarca} value={m.IdMarca}>{m.Marca}</option>)}
            </select>
          </div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>MODÈLE:</strong></label>
            <input type="text" value={newModele} onChange={(e) => setNewModele(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleInsert(); }} className="marques-form-input" placeholder="Nom du modèle" />
          </div>
          <div className="marques-form-row"><label className="marques-form-label"><strong>CYLINDRÉE:</strong></label>
            <input type="number" value={newCilindrata} onChange={(e) => setNewCilindrata(e.target.value)} className="marques-form-input" placeholder="ex: 1200" />
          </div>
          <div className="marques-form-buttons">
            {selectedId && <button onClick={resetForm} className="btn-cancel" style={{ marginBottom: 4 }}>↩ Retour insertion</button>}
            <button onClick={handleInsert} className="btn-insert">{selectedId ? "METTRE À JOUR MODÈLE" : "INSÉRER MODÈLE"}</button>
            {selectedId && <button onClick={handleDelete} className="btn-delete">SUPPRIMER MODÈLE</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelesPage;
