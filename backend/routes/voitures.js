// ─────────────────────────────────────────────
// routes/voitures.js — CRUD Parc auto
//
// Équivalent de par_auto.aspx.cs
//
// Utilise aussi ta stored procedure ai_get_voiture_flotte_complete
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET /api/voitures — Liste toutes les voitures
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('ff_get_auto');

    const voitures = result.recordset.map(row => ({
      IdAuto: row.IdAuto,
      IdModello: row.IdModello,
      Marca: row.Marca ? row.Marca.trim() : '',
      Modello: row.Modello ? row.Modello.trim() : '',
      Targa: row.Targa ? row.Targa.trim() : '',
      Rottamato: row.Rottamato,
      Priorite: row.Priorite ? row.Priorite.trim() : 'R',
    }));

    res.json(voitures);
  } catch (err) {
    console.error('Erreur GET voitures:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/voitures/flotte/:priorite — Flotte filtrée par priorité
// Appelle ta stored procedure ai_get_voiture_flotte_complete
router.get('/flotte/:priorite', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('Priorite', sql.NChar(1), req.params.priorite.toUpperCase())
      .execute('ai_get_voiture_flotte_complete');

    const voitures = result.recordset.map(row => ({
      IdAuto: row.IdAuto,
      Targa: row.Targa ? row.Targa.trim() : '',
      Marca: row.Marca ? row.Marca.trim() : '',
      Modello: row.Modello ? row.Modello.trim() : '',
    }));

    res.json(voitures);
  } catch (err) {
    console.error('Erreur GET flotte:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/voitures — Insérer une voiture
router.post('/', async (req, res) => {
  try {
    const { idModello, targa, prezzoAcquisto, annoAcquisto, rottamato } = req.body;

    if (!idModello || !targa) {
      return res.status(400).json({ error: 'CHOISISSEZ UN MODÈLE ET UNE PLAQUE' });
    }

    const pool = await getPool();
    await pool.request()
      .input('IdModello', sql.Int, parseInt(idModello))
      .input('Targa', sql.NVarChar, targa.trim().toUpperCase())
      .input('PrezzoAcquisto', sql.Decimal, prezzoAcquisto ? parseFloat(prezzoAcquisto) : null)
      .input('AnnoAcquisto', sql.Int, annoAcquisto ? parseInt(annoAcquisto) : null)
      .input('Rottamato', sql.Int, rottamato ? 1 : 0)
      .execute('ff_insert_auto');

    res.status(201).json({ message: 'VOITURE AJOUTÉE AVEC SUCCÈS' });
  } catch (err) {
    console.error('Erreur POST voitures:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/voitures/:id — Supprimer une voiture
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('IdAuto', sql.Int, parseInt(req.params.id))
      .execute('ai_delete_auto');

    res.json({ message: 'VOITURE SUPPRIMÉE' });
  } catch (err) {
    console.error('Erreur DELETE voitures:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;