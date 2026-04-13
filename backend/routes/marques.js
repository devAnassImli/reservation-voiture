// ─────────────────────────────────────────────
// routes/marques.js — CRUD Marques auto
//
// Équivalent de par_marche.aspx.cs
//
// En C# :
//   DataSet ds = ConfigurationHelper.DBHelper.DoJob("get_marche", htValues);
//   → appelle ff_get_marche
//
// En Node.js :
//   GET /api/marques → pool.request().execute('ff_get_marche')
//
// Correspondances :
//   CaricaMarcheAuto()       → GET /api/marques
//   btnInserimento_Click     → POST /api/marques
//   (suppression)            → DELETE /api/marques/:id
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET /api/marques — Liste toutes les marques
// Équivalent de : ConfigurationHelper.DBHelper.DoJob("get_marche", htValues)
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('ff_get_marche');
    
    // Nettoyer les espaces (nchar ajoute des espaces à droite)
    const marques = result.recordset.map(row => ({
      IdMarca: row.IdMarca,
      Marca: row.Marca ? row.Marca.trim() : '',
    }));

    res.json(marques);
  } catch (err) {
    console.error('Erreur GET marques:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/marques — Insérer une nouvelle marque
// Équivalent de : ConfigurationHelper.DBHelper.DoJob("insert_marca", htValues)
router.post('/', async (req, res) => {
  try {
    const { marca } = req.body;

    if (!marca || !marca.trim()) {
      return res.status(400).json({ error: 'ENTREZ UNE MARQUE' });
    }

    const pool = await getPool();

    // Vérifier si la marque existe déjà (comme ton foreach en C#)
    const existing = await pool.request().execute('ff_get_marche');
    const existe = existing.recordset.some(
      row => row.Marca && row.Marca.trim().toUpperCase() === marca.trim().toUpperCase()
    );

    if (existe) {
      return res.status(409).json({ error: 'MARQUE DÉJÀ EXISTANTE' });
    }

    // Insérer
    await pool.request()
      .input('Marca', sql.NVarChar, marca.trim().toUpperCase())
      .execute('ff_insert_marca');

    res.status(201).json({ message: 'MARQUE AJOUTÉE AVEC SUCCÈS' });
  } catch (err) {
    console.error('Erreur POST marques:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/marques/:id — Supprimer une marque
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('IdMarca', sql.Int, parseInt(req.params.id))
      .execute('ai_delete_marque');

    res.json({ message: 'MARQUE SUPPRIMÉE' });
  } catch (err) {
    console.error('Erreur DELETE marques:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;