// ─────────────────────────────────────────────
// routes/auth.js — Authentification avec JWT
//
// AVANT : retournait juste les infos user
// MAINTENANT : retourne un TOKEN JWT signé
//
// Le token contient les infos user (encodées)
// et expire après 8 heures.
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'ENTRER NOM D\'UTILISATEUR ET MOT DE PASSE'
      });
    }

    const pool = await getPool();

    // Appel de la stored procedure
    const result = await pool.request()
      .input('Username', sql.NVarChar, username.trim())
      .input('Pwd', sql.NVarChar, password.trim())
      .execute('UP_GET_AUTENTICAZIONE_ESTERNA');

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'NOM D\'UTILISATEUR OU MOT DE PASSE INCORRECT'
      });
    }

    const user = result.recordset[0];

    // Données à mettre dans le token
    const userData = {
      idUtente: user.IdUtente,
      cognomeNome: user.CognomeNome ? user.CognomeNome.trim() : '',
      email: user.Email ? user.Email.trim() : '',
      codice: user.Codice,
      tipoIngresso: user.UtenteEsterno === 1 ? '2' : '1',
    };

    // ── CRÉER LE TOKEN JWT ──
    // jwt.sign(données, clé_secrète, options)
    // Le token expire après 8h (une journée de travail)
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    console.log('✅ Login réussi:', userData.cognomeNome);

    // Retourne le token + les infos user
    res.json({
      success: true,
      token: token,    // ← NOUVEAU : le token JWT
      data: userData,
    });

  } catch (err) {
    console.error('❌ Erreur login:', err.message);
    res.status(500).json({
      success: false,
      error: 'ERREUR SERVEUR: ' + err.message
    });
  }
});

// POST /api/auth/demo — Mode démo (sans base de données)
// Permet de tester l'app même sans la SP d'authentification
router.post('/demo', (req, res) => {
  const userData = {
    idUtente: 0,
    cognomeNome: 'IMLI Anass',
    email: 'anass.imli@rivagroup.com',
    codice: '1',
    tipoIngresso: '1',
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });

  res.json({
    success: true,
    token: token,
    data: userData,
  });
});

module.exports = router;