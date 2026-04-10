import { useState } from "react";
import { MOCK_MARQUES_INITIAL } from "../data/mockData";

function MarquesPage() {
  const [marques, setMarques] = useState(MOCK_MARQUES_INITIAL);
  const [newMarque, setNewMarque] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleInsert = () => {
    setMessage("");
    if (!newMarque.trim()) { setMessage("ENTREZ UNE MARQUE"); setMessageType("error"); return; }
    const existe = marques.some((m) => m.Marca.toUpperCase() === newMarque.trim().toUpperCase());
    if (existe) { setMessage("MARQUE DÉJÀ EXISTANTE"); setMessageType("error"); return; }
    const newId = marques.length > 0 ? Math.max(...marques.map(m => m.IdMarca)) + 1 : 1;
    setMarques([...marques, { IdMarca: newId, Marca: newMarque.trim().toUpperCase() }]);
    setNewMarque("");
    setMessage("MARQUE AJOUTÉE AVEC SUCCÈS");
    setMessageType("success");
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (selectedId === null) { setMessage("SÉLECTIONNEZ UNE MARQUE D'ABORD"); setMessageType("error"); return; }
    setMarques(marques.filter((m) => m.IdMarca !== selectedId));
    setSelectedId(null);
    setMessage("MARQUE SUPPRIMÉE");
    setMessageType("success");
  };

  return (
    <div className="page-panel">
      <h2 className="marques-title">MARQUES AUTO</h2>
      {message && <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>{message}</div>}
      <div className="marques-layout">
        <div className="marques-table-container">
          <table className="marques-table">
            <thead><tr><th style={{ width: 60 }}>SEL.</th><th style={{ width: 60 }}>ID</th><th>MARQUE</th></tr></thead>
            <tbody>
              {marques.map((m) => (
                <tr key={m.IdMarca} className={selectedId === m.IdMarca ? "row-selected" : ""}>
                  <td><button className="btn-select" onClick={() => { setSelectedId(m.IdMarca); setNewMarque(m.Marca); setMessage(""); }}>SEL.</button></td>
                  <td>{m.IdMarca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>{m.Marca}</td>
                </tr>
              ))}
              {marques.length === 0 && <tr><td colSpan={3} style={{ color: "#999", padding: 20 }}>Aucune marque</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="marques-form">
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>MARQUE:</strong></label>
            <input type="text" value={newMarque} onChange={(e) => setNewMarque(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleInsert(); }} className="marques-form-input" placeholder="Nom de la marque" />
          </div>
          <div className="marques-form-buttons">
            <button onClick={handleInsert} className="btn-insert">{selectedId ? "MODIFIER MARQUE" : "INSÉRER MARQUE"}</button>
            {selectedId && <button onClick={handleDelete} className="btn-delete">SUPPRIMER MARQUE</button>}
            {selectedId && <button onClick={() => { setSelectedId(null); setNewMarque(""); setMessage(""); }} className="btn-cancel">ANNULER</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarquesPage;
