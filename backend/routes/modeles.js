const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET /api/modeles
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

// POST /api/modeles — Insérer un modèle
router.post('/', async (req, res) => {
  try {
    const { idMarca, modello, cilindrata } = req.body;
    if (!idMarca || !modello || !modello.trim()) {
      return res.status(400).json({ error: 'MARQUE ET NOM DU MODÈLE REQUIS' });
    }
    const pool = await getPool();

    // Vérifier doublon
    const check = await pool.request()
      .input('Modello', sql.NVarChar, modello.trim().toUpperCase())
      .input('IdMarca', sql.Int, parseInt(idMarca))
      .query("SELECT IdModello FROM utModelli WHERE UPPER(RTRIM(Modello)) = @Modello AND IdMarca = @IdMarca");
    if (check.recordset.length > 0) {
      return res.status(409).json({ error: 'MODÈLE DÉJÀ EXISTANT POUR CETTE MARQUE' });
    }

    await pool.request()
      .input('IdMarca', sql.Int, parseInt(idMarca))
      .input('Modello', sql.NVarChar, modello.trim().toUpperCase())
      .input('Cilindrata', sql.Int, cilindrata ? parseInt(cilindrata) : 0)
      .execute('ff_insert_modello');
    res.status(201).json({ message: 'MODÈLE AJOUTÉ AVEC SUCCÈS' });
  } catch (err) {
    console.error('Erreur POST modeles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/modeles/:id — Modifier un modèle
router.put('/:id', async (req, res) => {
  try {
    const { idMarca, modello, cilindrata } = req.body;
    const id = parseInt(req.params.id);
    if (!modello || !modello.trim()) {
      return res.status(400).json({ error: 'NOM DU MODÈLE REQUIS' });
    }
    const pool = await getPool();

    // Vérifier doublon (sauf lui-même)
    const check = await pool.request()
      .input('Modello', sql.NVarChar, modello.trim().toUpperCase())
      .input('IdMarca', sql.Int, parseInt(idMarca))
      .input('IdModello', sql.Int, id)
      .query("SELECT IdModello FROM utModelli WHERE UPPER(RTRIM(Modello)) = @Modello AND IdMarca = @IdMarca AND IdModello != @IdModello");
    if (check.recordset.length > 0) {
      return res.status(409).json({ error: 'MODÈLE DÉJÀ EXISTANT POUR CETTE MARQUE' });
    }

    await pool.request()
      .input('IdModello', sql.Int, id)
      .input('IdMarca', sql.Int, parseInt(idMarca))
      .input('Modello', sql.NVarChar, modello.trim().toUpperCase())
      .input('Cilindrata', sql.Int, cilindrata ? parseInt(cilindrata) : 0)
      .query("UPDATE utModelli SET IdMarca = @IdMarca, Modello = @Modello, Cilindrata = @Cilindrata WHERE IdModello = @IdModello");

    res.json({ message: 'MODÈLE MODIFIÉ AVEC SUCCÈS' });
  } catch (err) {
    console.error('Erreur PUT modeles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/modeles/:id — Supprimer un modèle
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();

    // Vérifier si des voitures utilisent ce modèle
    const check = await pool.request()
      .input('IdModello', sql.Int, id)
      .query("SELECT COUNT(*) as nb FROM utAuto WHERE IdModello = @IdModello");
    if (check.recordset[0].nb > 0) {
      return res.status(409).json({
        error: 'IMPOSSIBLE DE SUPPRIMER — Ce modèle est utilisé par ' + check.recordset[0].nb + ' voiture(s). Supprimez d\'abord les voitures associées.'
      });
    }

    const result = await pool.request()
      .input('IdModello', sql.Int, id)
      .query("DELETE FROM utModelli WHERE IdModello = @IdModello");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'MODÈLE NON TROUVÉ' });
    }
    res.json({ message: 'MODÈLE SUPPRIMÉ AVEC SUCCÈS' });
  } catch (err) {
    console.error('Erreur DELETE modeles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;