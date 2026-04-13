// ─────────────────────────────────────────────
// routes/auth.js — Authentification
//
// Équivalent de Default.aspx.cs → btnOK_Click
//
// En C# :
//   var dic = ClassTools.AutenticazioneDominio(username, password);
//   → appelle LDAP puis UP_GET_AUTENTICAZIONE_ESTERNA
//
// En Node.js :
//   POST /api/auth/login { username, password }
//   → appelle UP_GET_AUTENTICAZIONE_ESTERNA (pour les utilisateurs externes)
//   → retourne les infos utilisateur
//
// POUR L'INSTANT : on fait une authentification simple
// EN PHASE 2 : on ajoutera JWT (token sécurisé)
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation des champs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'ENTRER NOM D\'UTILISATEUR ET MOT DE PASSE'
      });
    }

    const pool = await getPool();

    // Appel de la stored procedure UP_GET_AUTENTICAZIONE_ESTERNA
    // Comme dans ton C# : ConfigurationHelper.DBHelper.DoJob("GET_AUTENTICAZIONE_ESTERNA", htValues)
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

    // Retourne les infos utilisateur
    // Comme Session["S_CognomeNome"] = dic.Item4; etc.
    res.json({
      success: true,
      data: {
        idUtente: user.IdUtente,
        cognomeNome: user.CognomeNome ? user.CognomeNome.trim() : '',
        email: user.Email ? user.Email.trim() : '',
        codice: user.Codice,
        tipoIngresso: user.UtenteEsterno === 1 ? '2' : '1',
      }
    });

  } catch (err) {
    console.error('Erreur login:', err.message);
    res.status(500).json({
      success: false,
      error: 'ERREUR SERVEUR: ' + err.message
    });
  }
});

module.exports = router;