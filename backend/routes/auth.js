const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sql, getPool } = require("../config/db");

//const JWT_SECRET = process.env.JWT_SECRET || "sam_montereau_reservation_voiture_secret_2026";
const JWT_SECRET = "sam_montereau_reservation_voiture_secret_2026";

// ══════════════════════════════════════════════════════════
//  CONFIGURATION LDAP
//  Serveur Active Directory de SAM Montereau (Groupe Riva)
//  Extrait du code ASP.NET : ClassTools.AutenticazioneDominio
// ══════════════════════════════════════════════════════════
const LDAP_URL = "ldap://mt.rivagroup.local";
const LDAP_BASE_DN = "DC=mt,DC=rivagroup,DC=local";
const LDAP_ENABLED = process.env.LDAP_ENABLED !== "false"; // activé par défaut à l'usine

// ══════════════════════════════════════════════════════════
//  Fonction : Authentification LDAP (Active Directory)
//  Reproduit exactement ClassTools.AutenticazioneDominio()
// ══════════════════════════════════════════════════════════
async function authenticateLDAP(username, password) {
  // Charger ldapjs dynamiquement (pas installé sur Docker)
  let ldap;
  try {
    ldap = require("ldapjs");
  } catch {
    console.log("⚠️ ldapjs non installé — LDAP désactivé");
    return null;
  }

  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: LDAP_URL,
      timeout: 5000,
      connectTimeout: 5000,
    });

    client.on("error", (err) => {
      console.log("⚠️ LDAP connexion impossible:", err.message);
      resolve(null); // fallback vers utUtenti
    });

    // Étape 1 : Bind (login) avec les identifiants de l'employé
    // Comme dans ASP.NET : new DirectoryEntry("LDAP://mt.rivagroup.local", username, password)
    const bindDN = `${username}@mt.rivagroup.local`;

    client.bind(bindDN, password, (err) => {
      if (err) {
        console.log("❌ LDAP bind échoué pour", username, ":", err.message);
        client.destroy();
        resolve(null); // identifiants invalides ou LDAP inaccessible
        return;
      }

      // Étape 2 : Rechercher l'utilisateur pour récupérer CN et mail
      // Comme dans ASP.NET : adsSearcher.Filter = "(sAMAccountName=" + username + ")"
      const searchOptions = {
        filter: `(sAMAccountName=${username})`,
        scope: "sub",
        attributes: ["cn", "mail", "sAMAccountName", "memberOf"],
      };

      client.search(LDAP_BASE_DN, searchOptions, (err, res) => {
        if (err) {
          console.log("❌ LDAP search erreur:", err.message);
          client.destroy();
          resolve(null);
          return;
        }

        let userInfo = null;

        res.on("searchEntry", (entry) => {
          // Récupérer les attributs (comme ASP.NET : adsSearchResult.Properties["CN"][0])
          let cn = username;
          let email = "";
          let sam = username;

          // ldapjs v2+ : entry.object contient les attributs en plain object
          if (entry.object) {
            cn = entry.object.cn || entry.object.CN || username;
            email = entry.object.mail || entry.object.Mail || "";
            sam = entry.object.sAMAccountName || username;
          } else if (entry.attributes) {
            entry.attributes.forEach((attr) => {
              const name = (attr.type || "").toLowerCase();
              const val = attr.values
                ? attr.values[0]
                : attr._vals
                  ? attr._vals[0].toString()
                  : "";
              if (name === "cn") cn = val;
              if (name === "mail") email = val;
              if (name === "samaccountname") sam = val;
            });
          }

          userInfo = {
            cognomeNome: cn,
            email: email,
            username: sam,
          };
        });

        res.on("end", () => {
          client.destroy();
          if (userInfo) {
            console.log(
              "✅ LDAP authentifié:",
              userInfo.cognomeNome,
              "-",
              userInfo.email,
            );
            resolve(userInfo);
          } else {
            console.log(
              "⚠️ LDAP bind OK mais utilisateur non trouvé dans l'annuaire",
            );
            resolve(null);
          }
        });

        res.on("error", (err) => {
          console.log("❌ LDAP search stream erreur:", err.message);
          client.destroy();
          resolve(null);
        });
      });
    });
  });
}

// ══════════════════════════════════════════════════════════
//  Fonction : Déterminer le rôle de l'utilisateur
//  Vérifie dans utUtenti si l'utilisateur a un rôle défini
//  Sinon → rôle par défaut = 'employe'
// ══════════════════════════════════════════════════════════
async function getUserRole(pool, cognomeNome, email) {
  try {
    // Chercher par email d'abord
    if (email) {
      const result = await pool
        .request()
        .input("Email", sql.NVarChar, email)
        .query("SELECT Role FROM utUtenti WHERE Email = @Email AND Attivo = 1");
      if (result.recordset.length > 0) {
        return result.recordset[0].Role.trim();
      }
    }

    // Sinon chercher par nom
    const result = await pool
      .request()
      .input("CognomeNome", sql.NVarChar, cognomeNome)
      .query(
        "SELECT Role FROM utUtenti WHERE CognomeNome = @CognomeNome AND Attivo = 1",
      );
    if (result.recordset.length > 0) {
      return result.recordset[0].Role.trim();
    }
  } catch (err) {
    console.log("⚠️ Erreur recherche rôle:", err.message);
  }

  // Rôle par défaut pour les employés du domaine
  return "employe";
}

// ══════════════════════════════════════════════════════════
//  POST /api/auth/login
//  1. Essaie LDAP (Active Directory) si activé
//  2. Sinon fallback vers table utUtenti
// ══════════════════════════════════════════════════════════
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "ENTRER NOM D'UTILISATEUR ET MOT DE PASSE" });
    }

    const pool = await getPool();
    let cognomeNome = "";
    let email = "";
    let role = "employe";
    let authMethod = "";

    // ── ÉTAPE 1 : Essayer LDAP (si activé) ──
    if (LDAP_ENABLED) {
      const ldapUser = await authenticateLDAP(username, password);
      if (ldapUser) {
        cognomeNome = ldapUser.cognomeNome;
        email = ldapUser.email;
        role = await getUserRole(pool, cognomeNome, email);
        authMethod = "LDAP";
      }
    }

    // ── ÉTAPE 2 : Fallback vers utUtenti (si LDAP échoué ou désactivé) ──
    if (!authMethod) {
      try {
        const result = await pool
          .request()
          .input("Username", sql.NVarChar, username)
          .input("Pwd", sql.NVarChar, password)
          .query(
            "SELECT * FROM utUtenti WHERE Username = @Username AND Pwd = @Pwd AND Attivo = 1",
          );

        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          cognomeNome = user.CognomeNome ? user.CognomeNome.trim() : username;
          email = user.Email ? user.Email.trim() : "";
          role = user.Role ? user.Role.trim() : "employe";
          authMethod = "utUtenti";
        }
      } catch (err) {
        // Si utUtenti n'existe pas (ancienne base), essayer la SP
        try {
          const result = await pool
            .request()
            .input("Username", sql.NVarChar, username)
            .input("Pwd", sql.NVarChar, password)
            .execute("UP_GET_AUTENTICAZIONE_ESTERNA");
          if (result.recordset.length > 0) {
            const user = result.recordset[0];
            cognomeNome = user.CognomeNome ? user.CognomeNome.trim() : username;
            email = user.Email ? user.Email.trim() : "";
            role = user.Role ? user.Role.trim() : "employe";
            authMethod = "SP";
          }
        } catch (spErr) {
          console.log("⚠️ SP non disponible:", spErr.message);
        }
      }
    }

    // ── ÉTAPE 3 : Résultat ──
    if (!authMethod) {
      return res
        .status(401)
        .json({ error: "NOM D'UTILISATEUR OU MOT DE PASSE INCORRECT" });
    }

    // Générer le token JWT
    const token = jwt.sign({ id: 1, cognomeNome, email, role }, JWT_SECRET, {
      expiresIn: "8h",
    });

    console.log(
      `✅ Login réussi (${authMethod}): ${cognomeNome} — Rôle: ${role}`,
    );
    res.json({
      message: "Connexion réussie",
      token,
      user: { cognomeNome, email, role },
    });
  } catch (err) {
    console.error("Erreur login:", err.message);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// POST /api/auth/demo (pour les tests)
router.post("/demo", async (req, res) => {
  const token = jwt.sign(
    { id: 0, cognomeNome: "Mode Demo", email: "demo@sam.local", role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" },
  );
  res.json({
    message: "Mode démo",
    token,
    user: { cognomeNome: "Mode Demo", email: "demo@sam.local", role: "admin" },
  });
});

module.exports = router;
