// ─────────────────────────────────────────────
// routes/reservations.js — Avec filtrage par rôle
//
// LOGIQUE :
//   - admin / rh → voit TOUTES les réservations
//   - employe    → voit UNIQUEMENT ses réservations
//   - gardien    → voit les réservations en cours
//
// Le rôle vient du JWT (req.user.role)
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../config/db");

// GET /api/reservations — Filtrées selon le rôle
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const role = req.user.role || "employe";
    const userName = req.user.cognomeNome || "";

    let result;

    if (role === "admin" || role === "rh") {
      // Admin et RH voient TOUT
      result = await pool.request().execute("ai_get_reservation_complete");
    } else if (role === "gardien") {
      // Gardien voit les réservations en cours
      result = await pool.request().execute("ai_visualiser_reservation");
    } else {
      // Employé voit uniquement SES réservations
      result = await pool.request().execute("ai_get_reservation_complete");
      // Filtre côté serveur par le nom de l'utilisateur
      result.recordset = result.recordset.filter(
        (r) => r.UtentePrenotazione && r.UtentePrenotazione.trim() === userName,
      );
    }

    const reservations = result.recordset.map((row) => ({
      IdPrenotazione: row.IdPrenotazione,
      IdAuto: row.IdAuto,
      Marca: row.Marca ? row.Marca.trim() : "",
      Modello: row.Modello ? row.Modello.trim() : "",
      Targa: row.Targa ? row.Targa.trim() : "",
      UtentePrenotazione: row.UtentePrenotazione
        ? row.UtentePrenotazione.trim()
        : "",
      Guidatore: row.Guidatore ? row.Guidatore.trim() : "",
      ProgressivoPrenotazione: row.ProgressivoPrenotazione,
      AnnoPrenotazione: row.AnnoPrenotazione,
      DataInizio: row.DataInizio,
      DataFine: row.DataFine,
      Giorni: row.Giorni,
      KmEstime: row.KmEstime,
      Destinazione: row.Destinazione ? row.Destinazione.trim() : "",
      UsineRiva: row.UsineRiva ? row.UsineRiva.trim() : "N",
      ValidationRH: row.ValidationRH,
      GuidTable: row.GuidTable ? row.GuidTable.trim() : "",
      InsertData: row.InsertData,
    }));

    // Voyageurs pour chaque réservation
    for (let resa of reservations) {
      if (resa.GuidTable) {
        try {
          const voyResult = await pool
            .request()
            .input("GuidTable", sql.NVarChar, resa.GuidTable)
            .execute("ai_get_voyagers_pour_guid_table");
          resa.Voyageurs = voyResult.recordset.map((v) =>
            v.Voyager ? v.Voyager.trim() : "",
          );
        } catch {
          resa.Voyageurs = [];
        }
      } else {
        resa.Voyageurs = [];
      }
    }

    res.json(reservations);
  } catch (err) {
    console.error("Erreur GET reservations:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/:id
router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("IdPrenotazione", sql.Int, parseInt(req.params.id))
      .execute("ai_get_reservation_complete_pour_idPrenotazione");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    const row = result.recordset[0];

    // Vérifier que l'employé ne peut voir que SA réservation
    const role = req.user.role || "employe";
    if (role === "employe") {
      const userName = req.user.cognomeNome || "";
      if (
        row.UtentePrenotazione &&
        row.UtentePrenotazione.trim() !== userName
      ) {
        return res
          .status(403)
          .json({ error: "ACCÈS REFUSÉ — Ce n'est pas votre réservation" });
      }
    }

    const resa = {
      IdPrenotazione: row.IdPrenotazione,
      IdAuto: row.IdAuto,
      Marca: row.Marca ? row.Marca.trim() : "",
      Modello: row.Modello ? row.Modello.trim() : "",
      Targa: row.Targa ? row.Targa.trim() : "",
      UtentePrenotazione: row.UtentePrenotazione
        ? row.UtentePrenotazione.trim()
        : "",
      ProgressivoPrenotazione: row.ProgressivoPrenotazione,
      AnnoPrenotazione: row.AnnoPrenotazione,
      DataInizio: row.DataInizio,
      DataFine: row.DataFine,
      Giorni: row.Giorni,
      KmEstime: row.KmEstime,
      Destinazione: row.Destinazione ? row.Destinazione.trim() : "",
      UsineRiva: row.UsineRiva ? row.UsineRiva.trim() : "N",
      ValidationRH: row.ValidationRH,
      GuidTable: row.GuidTable ? row.GuidTable.trim() : "",
      InsertData: row.InsertData,
    };

    if (resa.GuidTable) {
      try {
        const voyResult = await pool
          .request()
          .input("GuidTable", sql.NVarChar, resa.GuidTable)
          .execute("ai_get_voyagers_pour_guid_table");
        resa.Voyageurs = voyResult.recordset.map((v) =>
          v.Voyager ? v.Voyager.trim() : "",
        );
      } catch {
        resa.Voyageurs = [];
      }
    } else {
      resa.Voyageurs = [];
    }

    res.json(resa);
  } catch (err) {
    console.error("Erreur GET reservations/:id:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations — Créer une réservation
router.post("/", async (req, res) => {
  try {
    const {
      dataInizio,
      dataFine,
      giorni,
      kmEstime,
      destinazione,
      usineRiva,
      idAuto,
      voyageurs,
    } = req.body;

    // Le nom du demandeur vient du JWT (pas du formulaire = plus sécurisé)
    const utentePrenotazione = req.user.cognomeNome || "Inconnu";

    if (!idAuto)
      return res.status(400).json({ error: "CHOISISSEZ UNE VOITURE" });
    if (!dataInizio || !dataFine)
      return res.status(400).json({ error: "ENTREZ LES DATES" });
    if (!destinazione)
      return res.status(400).json({ error: "ENTREZ UNE DESTINATION" });

    const pool = await getPool();

    const annoPrenotazione = new Date().getFullYear();
    let progressivo = 1;

    try {
      const progResult = await pool
        .request()
        .input("AnnoPrenotazione", sql.Int, annoPrenotazione)
        .execute("ai_get_progressivo_prenotazione");
      if (
        progResult.recordset.length > 0 &&
        progResult.recordset[0].ProgressivoPrenotazione
      ) {
        progressivo = progResult.recordset[0].ProgressivoPrenotazione + 1;
      }
    } catch {}

    const guidTable = "GT" + Date.now().toString().slice(-8);

    await pool
      .request()
      .input("UtentePrenotazione", sql.NVarChar, utentePrenotazione)
      .input("ProgressivoPrenotazione", sql.Int, progressivo)
      .input("AnnoPrenotazione", sql.Int, annoPrenotazione)
      .input("DataInizio", sql.DateTime, new Date(dataInizio))
      .input("DataFine", sql.DateTime, new Date(dataFine))
      .input("Giorni", sql.Int, giorni || 1)
      .input("KmEstime", sql.Int, kmEstime || 0)
      .input("Destinazione", sql.NVarChar, destinazione.trim())
      .input("UsineRiva", sql.Char(1), usineRiva || "N")
      .input("GuidTable", sql.NVarChar, guidTable)
      .input("IdAuto", sql.Int, parseInt(idAuto))
      .execute("ai_insert_reservation");

    if (voyageurs && voyageurs.length > 0) {
      for (const voyageur of voyageurs) {
        if (voyageur && voyageur.trim()) {
          try {
            await pool
              .request()
              .input("GuidTable", sql.NVarChar, guidTable)
              .input("Voyager", sql.NVarChar, voyageur.trim())
              .execute("ai_insert_voyager");
          } catch (voyErr) {
            console.error("Erreur insert voyageur:", voyErr.message);
          }
        }
      }
    }

    console.log(
      "✅ Réservation créée par",
      utentePrenotazione,
      "— N°",
      progressivo + "/" + annoPrenotazione,
    );

    res.status(201).json({
      message: `RÉSERVATION N° ${progressivo}/${annoPrenotazione} CRÉÉE AVEC SUCCÈS`,
      progressivo,
      annoPrenotazione,
      guidTable,
    });
  } catch (err) {
    console.error("Erreur POST reservations:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// DELETE /api/reservations/:id — Supprimer une réservation
router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const idPrenotazione = parseInt(req.params.id);
    const role = req.user.role || "employe";
    const userName = req.user.cognomeNome || "";

    // Vérifier que c'est sa réservation (si employé)
    if (role === "employe") {
      const check = await pool
        .request()
        .input("IdPrenotazione", sql.Int, idPrenotazione)
        .query(
          "SELECT UtentePrenotazione FROM utPrenotazioni WHERE IdPrenotazione = @IdPrenotazione",
        );

      if (check.recordset.length === 0) {
        return res.status(404).json({ error: "Réservation non trouvée" });
      }
      if (check.recordset[0].UtentePrenotazione.trim() !== userName) {
        return res.status(403).json({ error: "ACCÈS REFUSÉ" });
      }
    }

    // Supprimer les voyageurs puis la réservation
    await pool.request().input("IdPrenotazione", sql.Int, idPrenotazione)
      .query(`
        DELETE FROM utVoyagers WHERE GuidTable = 
          (SELECT GuidTable FROM utPrenotazioni WHERE IdPrenotazione = @IdPrenotazione);
        DELETE FROM utPrenotazioni WHERE IdPrenotazione = @IdPrenotazione;
      `);

    console.log("✅ Réservation supprimée:", idPrenotazione, "par", userName);
    res.json({ message: "RÉSERVATION SUPPRIMÉE" });
  } catch (err) {
    console.error("Erreur DELETE:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reservations/:id — Modifier une réservation
router.put("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const idPrenotazione = parseInt(req.params.id);
    const { dataInizio, dataFine, giorni, destinazione, kmEstime } = req.body;
    const role = req.user.role || "employe";
    const userName = req.user.cognomeNome || "";

    if (role === "employe") {
      const check = await pool
        .request()
        .input("IdPrenotazione", sql.Int, idPrenotazione)
        .query(
          "SELECT UtentePrenotazione FROM utPrenotazioni WHERE IdPrenotazione = @IdPrenotazione",
        );
      if (
        check.recordset.length === 0 ||
        check.recordset[0].UtentePrenotazione.trim() !== userName
      ) {
        return res.status(403).json({ error: "ACCÈS REFUSÉ" });
      }
    }

    await pool
      .request()
      .input("IdPrenotazione", sql.Int, idPrenotazione)
      .input("DataInizio", sql.DateTime, new Date(dataInizio))
      .input("DataFine", sql.DateTime, new Date(dataFine))
      .input("Giorni", sql.Int, giorni || 1)
      .input("Destinazione", sql.NVarChar, destinazione)
      .input("KmEstime", sql.Int, kmEstime || 0).query(`
        UPDATE utPrenotazioni 
        SET DataInizio = @DataInizio, DataFine = @DataFine, Giorni = @Giorni,
            Destinazione = @Destinazione, KmEstime = @KmEstime
        WHERE IdPrenotazione = @IdPrenotazione
      `);

    console.log("✅ Réservation modifiée:", idPrenotazione);
    res.json({ message: "RÉSERVATION MODIFIÉE" });
  } catch (err) {
    console.error("Erreur PUT:", err.message);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
