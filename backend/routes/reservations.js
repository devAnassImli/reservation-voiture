// ─────────────────────────────────────────────
// routes/reservations.js — CRUD Réservations
//
// Utilise tes stored procedures :
//   ai_get_reservation_complete          → GET /api/reservations
//   ai_get_progressivo_prenotazione      → numéro auto
//   ai_insert_reservation                → POST /api/reservations
//   ai_insert_voyager                    → POST (avec la réservation)
//   ai_get_voyagers_pour_guid_table      → GET voyageurs
//   ai_get_reservation_complete_pour_idPrenotazione → GET /api/reservations/:id
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../config/db");

// GET /api/reservations — Liste toutes les réservations
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute("ai_get_reservation_complete");

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

    // Pour chaque réservation, récupérer les voyageurs
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

// GET /api/reservations/:id — Une réservation par ID
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

    // Voyageurs
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
// Appelle ai_insert_reservation + ai_insert_voyager pour chaque voyageur
router.post("/", async (req, res) => {
  try {
    const {
      utentePrenotazione,
      dataInizio,
      dataFine,
      giorni,
      kmEstime,
      destinazione,
      usineRiva,
      idAuto,
      voyageurs, // tableau de noms ["DUPONT Jean", "MARTIN Pierre"]
    } = req.body;

    // Validations
    if (!idAuto)
      return res.status(400).json({ error: "CHOISISSEZ UNE VOITURE" });
    if (!dataInizio || !dataFine)
      return res.status(400).json({ error: "ENTREZ LES DATES" });
    if (!destinazione)
      return res.status(400).json({ error: "ENTREZ UNE DESTINATION" });

    const pool = await getPool();

    // Générer le numéro progressif
    // Comme : ai_get_progressivo_prenotazione
    const annoPrenotazione = new Date().getFullYear();
    let progressivo = 1;

    try {
      const progResult = await pool
        .request()
        .input("AnnoPrenotazione", sql.Int, annoPrenotazione)
        .execute("ai_get_progressivo_prenotazione");

      if (
        progResult.recordset.length > 0 &&
        progResult.recordset[0].MaxProgressivo
      ) {
        progressivo = progResult.recordset[0].MaxProgressivo + 1;
      }
    } catch {
      // Si la SP n'existe pas encore, on commence à 1
    }

    // Générer le GuidTable (pour lier les voyageurs)
    const guidTable = "GT" + Date.now().toString().slice(-8);

    // Insérer la réservation
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

    // Insérer les voyageurs
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

module.exports = router;
