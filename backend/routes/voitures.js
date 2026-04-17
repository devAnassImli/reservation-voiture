const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../config/db");

// GET /api/voitures
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute("ff_get_auto");
    const voitures = result.recordset.map((row) => ({
      IdAuto: row.IdAuto,
      IdModello: row.IdModello,
      Marca: row.Marca ? row.Marca.trim() : "",
      Modello: row.Modello ? row.Modello.trim() : "",
      Targa: row.Targa ? row.Targa.trim() : "",
      Rottamato: row.Rottamato,
      Priorite: row.Priorite ? row.Priorite.trim() : "",
    }));
    res.json(voitures);
  } catch (err) {
    console.error("Erreur GET voitures:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/voitures/flotte/:priorite
router.get("/flotte/:priorite", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("Priorite", sql.NChar, req.params.priorite)
      .execute("ai_get_voiture_flotte_complete");
    const voitures = result.recordset.map((row) => ({
      IdAuto: row.IdAuto,
      IdModello: row.IdModello,
      Marca: row.Marca ? row.Marca.trim() : "",
      Modello: row.Modello ? row.Modello.trim() : "",
      Targa: row.Targa ? row.Targa.trim() : "",
      Rottamato: row.Rottamato,
      Priorite: row.Priorite ? row.Priorite.trim() : "",
    }));
    res.json(voitures);
  } catch (err) {
    console.error("Erreur GET flotte:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/voitures — Insérer une voiture
router.post("/", async (req, res) => {
  try {
    const { idModello, targa, rottamato, priorite } = req.body;
    if (!idModello || !targa || !targa.trim()) {
      return res.status(400).json({ error: "MODÈLE ET PLAQUE REQUIS" });
    }
    const pool = await getPool();

    // Vérifier doublon plaque
    const check = await pool
      .request()
      .input("Targa", sql.NChar, targa.trim().toUpperCase())
      .query("SELECT IdAuto FROM utAuto WHERE RTRIM(Targa) = RTRIM(@Targa)");
    if (check.recordset.length > 0) {
      return res.status(409).json({ error: "PLAQUE DÉJÀ EXISTANTE" });
    }

    await pool
      .request()
      .input("IdModello", sql.Int, parseInt(idModello))
      .input("Targa", sql.NChar, targa.trim().toUpperCase())
      .input("Rottamato", sql.Int, rottamato ? parseInt(rottamato) : 0)
      .input("Priorite", sql.NChar, priorite || "R")
      .execute("ff_insert_auto");
    res.status(201).json({ message: "VOITURE AJOUTÉE AVEC SUCCÈS" });
  } catch (err) {
    console.error("Erreur POST voitures:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/voitures/:id — Modifier une voiture
router.put("/:id", async (req, res) => {
  try {
    const { idModello, targa, rottamato, priorite } = req.body;
    const id = parseInt(req.params.id);
    if (!targa || !targa.trim()) {
      return res.status(400).json({ error: "PLAQUE REQUISE" });
    }
    const pool = await getPool();

    // Vérifier doublon plaque (sauf elle-même)
    const check = await pool
      .request()
      .input("Targa", sql.NChar, targa.trim().toUpperCase())
      .input("IdAuto", sql.Int, id)
      .query(
        "SELECT IdAuto FROM utAuto WHERE RTRIM(Targa) = RTRIM(@Targa) AND IdAuto != @IdAuto",
      );
    if (check.recordset.length > 0) {
      return res.status(409).json({ error: "PLAQUE DÉJÀ EXISTANTE" });
    }

    await pool
      .request()
      .input("IdAuto", sql.Int, id)
      .input("IdModello", sql.Int, parseInt(idModello))
      .input("Targa", sql.NChar, targa.trim().toUpperCase())
      .input("Rottamato", sql.Int, rottamato ? parseInt(rottamato) : 0)
      .input("Priorite", sql.NChar, priorite || "R")
      .query(
        "UPDATE utAuto SET IdModello = @IdModello, Targa = @Targa, Rottamato = @Rottamato, Priorite = @Priorite WHERE IdAuto = @IdAuto",
      );

    res.json({ message: "VOITURE MODIFIÉE AVEC SUCCÈS" });
  } catch (err) {
    console.error("Erreur PUT voitures:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/voitures/:id — Supprimer une voiture
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();

    // Vérifier si des réservations utilisent cette voiture
    const checkResa = await pool
      .request()
      .input("IdAuto", sql.Int, id)
      .query(
        "SELECT COUNT(*) as nb FROM utPrenotazioni WHERE IdAuto = @IdAuto",
      );
    if (checkResa.recordset[0].nb > 0) {
      return res.status(409).json({
        error:
          "IMPOSSIBLE DE SUPPRIMER — Cette voiture a " +
          checkResa.recordset[0].nb +
          " réservation(s). Supprimez d'abord les réservations associées.",
      });
    }

    // Vérifier si des maintenances utilisent cette voiture
    const checkMaint = await pool
      .request()
      .input("IdAuto", sql.Int, id)
      .query(
        "SELECT COUNT(*) as nb FROM utManutenzioni WHERE IdAuto = @IdAuto",
      );
    if (checkMaint.recordset[0].nb > 0) {
      return res.status(409).json({
        error:
          "IMPOSSIBLE DE SUPPRIMER — Cette voiture a " +
          checkMaint.recordset[0].nb +
          " maintenance(s). Supprimez d'abord les maintenances associées.",
      });
    }

    const result = await pool
      .request()
      .input("IdAuto", sql.Int, id)
      .query("DELETE FROM utAuto WHERE IdAuto = @IdAuto");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "VOITURE NON TROUVÉE" });
    }
    res.json({ message: "VOITURE SUPPRIMÉE AVEC SUCCÈS" });
  } catch (err) {
    console.error("Erreur DELETE voitures:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
