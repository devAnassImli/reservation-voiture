// ─────────────────────────────────────────────
// routes/auth.js — Authentification avec rôles
//
// Maintenant le JWT contient le ROLE de l'utilisateur :
//   - admin : accès complet (parc auto, toutes réservations)
//   - employe : voir SES réservations uniquement
//   - rh : valider les réservations
//   - gardien : remettre les clés, contrôler véhicules
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sql, getPool } = require("../config/db");

// POST /api/auth/login — Vrai login avec la table utUtenti
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "ENTRER NOM D'UTILISATEUR ET MOT DE PASSE",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Username", sql.NVarChar, username.trim())
      .input("Pwd", sql.NVarChar, password.trim())
      .execute("UP_GET_AUTENTICAZIONE_ESTERNA");

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: "NOM D'UTILISATEUR OU MOT DE PASSE INCORRECT",
      });
    }

    const user = result.recordset[0];

    const userData = {
      idUtente: user.IdUtente,
      username: user.Username ? user.Username.trim() : "",
      cognomeNome: user.CognomeNome ? user.CognomeNome.trim() : "",
      email: user.Email ? user.Email.trim() : "",
      role: user.Role ? user.Role.trim() : "employe",
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    console.log(
      "✅ Login réussi:",
      userData.cognomeNome,
      "— Rôle:",
      userData.role,
    );

    res.json({
      success: true,
      token: token,
      data: userData,
    });
  } catch (err) {
    console.error("❌ Erreur login:", err.message);
    res.status(500).json({
      success: false,
      error: "ERREUR SERVEUR: " + err.message,
    });
  }
});

// POST /api/auth/demo — Mode démo (admin par défaut)
router.post("/demo", (req, res) => {
  const userData = {
    idUtente: 0,
    username: "demo",
    cognomeNome: "IMLI Anass",
    email: "anass.imli@rivagroup.com",
    role: "admin",
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({
    success: true,
    token: token,
    data: userData,
  });
});

module.exports = router;
