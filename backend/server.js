// ============================================================
//  server.js — API Backend avec sécurité JWT
// ============================================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.API_PORT || 5000;

// ── Middleware globaux ──
app.use(cors());
app.use(express.json());

// ── Routes PUBLIQUES (pas besoin de token) ──
app.use("/api/auth", require("./routes/auth"));

// ── Route de test (publique) ──
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API Réservation de Voiture - SAM Montereau",
    security: "JWT enabled",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes PROTÉGÉES (token JWT obligatoire) ──
// Le authMiddleware vérifie le token AVANT d'exécuter la route
// C'est comme if (Session["S_CognomeNome"] == null) redirect...
app.use("/api/marques", authMiddleware, require("./routes/marques"));
app.use("/api/modeles", authMiddleware, require("./routes/modeles"));
app.use("/api/voitures", authMiddleware, require("./routes/voitures"));
app.use("/api/reservations", authMiddleware, require("./routes/reservations"));

// ── Démarrage ──
app.listen(PORT, () => {
  console.log("");
  console.log("═══════════════════════════════════════════");
  console.log("  🚗 API Réservation de Voiture");
  console.log("  📍 SAM Montereau - Groupe Riva");
  console.log(`  🌐 http://localhost:${PORT}`);
  console.log("  🔒 Sécurité: JWT activé");
  console.log(`  💾 Base: ${process.env.DB_DATABASE}`);
  console.log("═══════════════════════════════════════════");
  console.log("");
});
