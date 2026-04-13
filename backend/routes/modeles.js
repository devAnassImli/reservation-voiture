// ─────────────────────────────────────────────
// routes/modeles.js — CRUD Modèles auto
//
// Équivalent de par_modelli.aspx.cs
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET /api/modeles — Liste tous les modèles
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('ff_get_modelli');

    const modeles = result.recordset.map(row => ({
      IdModello: row.IdModello,
      IdMarca: row.IdMarca,
      Marca: row.Marca ? row.Marca.trim() : '',
      Modello: row.Modello ? row.Modello.trim() : '',
      Cilindrata: row.Cilindrata,
    }));

    res.json(modeles);
  } catch (err) {
    console.error('Erreur GET modeles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/modeles/:id — Un modèle par ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('IdModello', sql.Int, parseInt(req.params.id))
      .execute('ff_get_modelli_per_id_modello');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Modèle non trouvé' });
    }

    const row = result.recordset[0];
    res.json({
      IdModello: row.IdModello,
      IdMarca: row.IdMarca,
      Marca: row.Marca ? row.Marca.trim() : '',
      Modello: row.Modello ? row.Modello.trim() : '',
      Cilindrata: row.Cilindrata,
    });
  } catch (err) {
    console.error('Erreur GET modeles/:id:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/modeles — Insérer un modèle
router.post('/', async (req, res) => {
  try {
    const { idMarca, modello, cilindrata } = req.body;

    if (!idMarca || !modello) {
      return res.status(400).json({ error: 'CHOISISSEZ UNE MARQUE ET UN MODÈLE' });
    }

    const pool = await getPool();
    await pool.request()
      .input('IdMarca', sql.Int, parseInt(idMarca))
      .input('Modello', sql.NVarChar, modello.trim().toUpperCase())
      .input('Cilindrata', sql.Int, cilindrata ? parseInt(cilindrata) : null)
      .input('AnnoAcquisto', sql.Int, null)
      .input('Rottamato', sql.Int, null)
      .execute('ff_insert_modello');

    res.status(201).json({ message: 'MODÈLE AJOUTÉ AVEC SUCCÈS' });
  } catch (err) {
    console.error('Erreur POST modeles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/modeles/:id — Supprimer un modèle
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('IdModello', sql.Int, parseInt(req.params.id))
      .execute('ff_delete_modello');

    res.json({ message: 'MODÈLE SUPPRIMÉ' });
  } catch (err) {
    console.error('Erreur DELETE modeles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;