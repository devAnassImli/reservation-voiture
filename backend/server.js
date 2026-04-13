// ============================================================
//  server.js — Point d'entrée de l'API Backend
//
//  C'est l'équivalent du Web.config + IIS de ton projet ASP.NET
//  Sauf qu'ici c'est Express (Node.js) qui fait le travail.
//
//  En ASP.NET :
//    IIS écoute sur un port → route vers les .aspx
//  
//  En Express :
//    Express écoute sur le port 5000 → route vers les fichiers routes/
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 5000;

// ── Middleware ──
// cors() : autorise le React (port 3000) à appeler l'API (port 5000)
// express.json() : permet de lire le body des requêtes POST en JSON
app.use(cors());
app.use(express.json());

// ── Routes ──
// Chaque fichier dans routes/ gère un groupe d'endpoints
// C'est comme avoir plusieurs .aspx, chacun pour une fonctionnalité
app.use('/api/auth', require('./routes/auth'));
app.use('/api/marques', require('./routes/marques'));
app.use('/api/modeles', require('./routes/modeles'));
app.use('/api/voitures', require('./routes/voitures'));
app.use('/api/reservations', require('./routes/reservations'));

// ── Route de test ──
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Réservation de Voiture - SAM Montereau',
    timestamp: new Date().toISOString()
  });
});

// ── Démarrage du serveur ──
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🚗 API Réservation de Voiture');
  console.log('  📍 SAM Montereau - Groupe Riva');
  console.log(`  🌐 http://localhost:${PORT}`);
  console.log(`  💾 Base: ${process.env.DB_DATABASE}`);
  console.log('═══════════════════════════════════════════');
  console.log('');
});