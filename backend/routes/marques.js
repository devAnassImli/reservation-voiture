const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../config/db");

// GET /api/marques
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute("ff_get_marche");
    const marques = result.recordset.map((row) => ({
      IdMarca: row.IdMarca,
      Marca: row.Marca ? row.Marca.trim() : "",
    }));
    res.json(marques);
  } catch (err) {
    console.error("Erreur GET marques:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/marques — Insérer une marque
router.post("/", async (req, res) => {
  try {
    const { marca } = req.body;
    if (!marca || !marca.trim()) {
      return res.status(400).json({ error: "NOM DE MARQUE REQUIS" });
    }
    const pool = await getPool();

    // Vérifier doublon
    const check = await pool
      .request()
      .input("Marca", sql.NVarChar, marca.trim().toUpperCase())
      .query("SELECT IdMarca FROM utMarche WHERE UPPER(RTRIM(Marca)) = @Marca");
    if (check.recordset.length > 0) {
      return res.status(409).json({ error: "MARQUE DÉJÀ EXISTANTE" });
    }

    await pool
      .request()
      .input("Marca", sql.NVarChar, marca.trim().toUpperCase())
      .execute("ff_insert_marca");
    res.status(201).json({ message: "MARQUE AJOUTÉE AVEC SUCCÈS" });
  } catch (err) {
    console.error("Erreur POST marques:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/marques/:id — Modifier une marque
router.put("/:id", async (req, res) => {
  try {
    const { marca } = req.body;
    const id = parseInt(req.params.id);
    if (!marca || !marca.trim()) {
      return res.status(400).json({ error: "NOM DE MARQUE REQUIS" });
    }
    const pool = await getPool();

    // Vérifier doublon (sauf elle-même)
    const check = await pool
      .request()
      .input("Marca", sql.NVarChar, marca.trim().toUpperCase())
      .input("IdMarca", sql.Int, id)
      .query(
        "SELECT IdMarca FROM utMarche WHERE UPPER(RTRIM(Marca)) = @Marca AND IdMarca != @IdMarca",
      );
    if (check.recordset.length > 0) {
      return res.status(409).json({ error: "MARQUE DÉJÀ EXISTANTE" });
    }

    await pool
      .request()
      .input("Marca", sql.NVarChar, marca.trim().toUpperCase())
      .input("IdMarca", sql.Int, id)
      .query("UPDATE utMarche SET Marca = @Marca WHERE IdMarca = @IdMarca");

    res.json({ message: "MARQUE MODIFIÉE AVEC SUCCÈS" });
  } catch (err) {
    console.error("Erreur PUT marques:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/marques/:id — Supprimer une marque
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();

    // Vérifier si des modèles utilisent cette marque
    const check = await pool
      .request()
      .input("IdMarca", sql.Int, id)
      .query("SELECT COUNT(*) as nb FROM utModelli WHERE IdMarca = @IdMarca");
    if (check.recordset[0].nb > 0) {
      return res.status(409).json({
        error:
          "IMPOSSIBLE DE SUPPRIMER — Cette marque est utilisée par " +
          check.recordset[0].nb +
          " modèle(s). Supprimez d'abord les modèles associés.",
      });
    }

    const result = await pool
      .request()
      .input("IdMarca", sql.Int, id)
      .query("DELETE FROM utMarche WHERE IdMarca = @IdMarca");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "MARQUE NON TROUVÉE" });
    }
    res.json({ message: "MARQUE SUPPRIMÉE AVEC SUCCÈS" });
  } catch (err) {
    console.error("Erreur DELETE marques:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
