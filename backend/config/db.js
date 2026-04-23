// ─────────────────────────────────────────────
// config/db.js — Connexion SQL Server
// Fonctionne avec Docker ET avec le vrai serveur de l'usine
// ─────────────────────────────────────────────

const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,              // 10.165.150.20/sqlexpress
  database: process.env.DB_DATABASE,          // db_database = SAM_MT_ReservationAuto
  user: process.env.DB_USER,                  // user_milano
  password: process.env.DB_PASSWORD,          //samsam 
  port: parseInt(process.env.DB_PORT) || 1433, 
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Ajouter instanceName seulement si le serveur contient un backslash
// (à l'usine : 10.165.150.20\sqlexpress → instanceName = sqlexpress)
// (Docker : db → pas d'instance)
if (process.env.DB_SERVER && process.env.DB_SERVER.includes('\\')) {
  const parts = process.env.DB_SERVER.split('\\');
  config.server = parts[0];
  config.options.instanceName = parts[1];
}

let pool = null;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('✅ Connecté à SQL Server:', process.env.DB_DATABASE);
    } catch (err) {
      console.error('❌ Erreur connexion SQL Server:', err.message);
      throw err;
    }
  }
  return pool;
}

module.exports = { sql, getPool };