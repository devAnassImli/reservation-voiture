import { useState, useEffect } from "react";
import * as api from "../api/apiService";

function ModelesPage() {
  const [modeles, setModeles] = useState([]);
  const [marques, setMarques] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState("0");
  const [newModele, setNewModele] = useState("");
  const [newCilindrata, setNewCilindrata] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [marquesData, modelesData] = await Promise.all([
        api.getMarques(),
        api.getModeles(),
      ]);
      setMarques(marquesData);
      setModeles(modelesData);
    } catch (err) {
      setMessage("ERREUR: " + err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

 const handleInsert = async () => {
    setMessage("");
    if (selectedMarca === "0") {
      setMessage("CHOISISSEZ UNE MARQUE");
      setMessageType("error");
      return;
    }
    if (!newModele.trim()) {
      setMessage("ENTREZ UN NOM DE MODÈLE");
      setMessageType("error");
      return;
    }

    try {
      if (selectedId) {
        // MODE MODIFICATION (PUT)
        await api.updateModele(selectedId, {
          idMarca: parseInt(selectedMarca),
          modello: newModele.trim(),
          cilindrata: newCilindrata ? parseInt(newCilindrata) : 0,
        });
        setMessage("MODÈLE MODIFIÉ AVEC SUCCÈS");
      } else {
        // MODE INSERTION (POST)
        await api.insertModele(
          parseInt(selectedMarca),
          newModele.trim(),
          newCilindrata ? parseInt(newCilindrata) : null,
        );
        setMessage("MODÈLE AJOUTÉ AVEC SUCCÈS");
      }
      setMessageType("success");
      resetForm();
      await loadData();
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  const handleDelete = async () => {
    if (selectedId === null) return;
    try {
      await api.deleteModele(selectedId);
      setMessage("MODÈLE SUPPRIMÉ");
      setMessageType("success");
      resetForm();
      await loadData();
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  const handleSelect = (m) => {
    setSelectedId(m.IdModello);
    setSelectedMarca(m.IdMarca.toString());
    setNewModele(m.Modello);
    setNewCilindrata(m.Cilindrata ? m.Cilindrata.toString() : "");
    setMessage("");
  };

  const resetForm = () => {
    setSelectedId(null);
    setSelectedMarca("0");
    setNewModele("");
    setNewCilindrata("");
  };

  if (loading)
    return (
      <div className="page-panel">
        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>
          Chargement...
        </p>
      </div>
    );

  return (
    <div className="page-panel">
      <h2 className="marques-title">MODÈLES AUTO</h2>
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
      <div className="marques-layout">
        <div className="marques-table-container" style={{ maxHeight: 450 }}>
          <table className="marques-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>SEL.</th>
                <th style={{ width: 40 }}>ID</th>
                <th>MARQUE</th>
                <th>MODÈLE</th>
                <th>CYLINDRÉE</th>
              </tr>
            </thead>
            <tbody>
              {modeles.map((m) => (
                <tr
                  key={m.IdModello}
                  className={selectedId === m.IdModello ? "row-selected" : ""}
                >
                  <td>
                    <button
                      className="btn-select"
                      onClick={() => handleSelect(m)}
                    >
                      SEL.
                    </button>
                  </td>
                  <td>{m.IdModello}</td>
                  <td>{m.Marca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>
                    {m.Modello}
                  </td>
                  <td>{m.Cilindrata || "—"}</td>
                </tr>
              ))}
              {modeles.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "#999", padding: 20 }}>
                    Aucun modèle
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="marques-form" style={{ minWidth: 350 }}>
          <div className="marques-form-row">
            <label className="marques-form-label">
              <strong>MARQUE:</strong>
            </label>
            <select
              value={selectedMarca}
              onChange={(e) => setSelectedMarca(e.target.value)}
              className="modeles-select"
            >
              <option value="0">Choisir...</option>
              {marques.map((m) => (
                <option key={m.IdMarca} value={m.IdMarca}>
                  {m.Marca}
                </option>
              ))}
            </select>
          </div>
          <div className="marques-form-row">
            <label className="marques-form-label">
              <strong>MODÈLE:</strong>
            </label>
            <input
              type="text"
              value={newModele}
              onChange={(e) => setNewModele(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInsert();
              }}
              className="marques-form-input"
              placeholder="Nom du modèle"
            />
          </div>
          <div className="marques-form-row">
            <label className="marques-form-label">
              <strong>CYLINDRÉE:</strong>
            </label>
            <input
              type="number"
              value={newCilindrata}
              onChange={(e) => setNewCilindrata(e.target.value)}
              className="marques-form-input"
              placeholder="ex: 1200"
            />
          </div>
          <div className="marques-form-buttons">
            {selectedId && (
              <button
                onClick={resetForm}
                className="btn-cancel"
                style={{ marginBottom: 4 }}
              >
                ↩ Retour insertion
              </button>
            )}
            <button onClick={handleInsert} className="btn-insert">
              {selectedId ? "METTRE À JOUR MODÈLE" : "INSÉRER MODÈLE"}
            </button>
            {selectedId && (
              <button onClick={handleDelete} className="btn-delete">
                SUPPRIMER MODÈLE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelesPage;
