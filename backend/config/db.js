// ─────────────────────────────────────────────
// config/db.js — Connexion à SQL Server
//
// Équivalent de ConfigurationHelper.cs + DataConfiguration.xml
//
// En C# tu avais :
//   SqlConnection connessione_db = new SqlConnection(@"Data Source=10.165.150.20\sqlexpress;...");
//   connessione_db.Open();
//
// En Node.js avec mssql :
//   const pool = await getPool();
//   const result = await pool.request().execute('ma_procedure');
//
// La différence : mssql gère un "pool" de connexions automatiquement
// (pas besoin de Open/Close à chaque fois)
// ─────────────────────────────────────────────

const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,                // pas de chiffrement pour le réseau local
    trustServerCertificate: true,  // nécessaire pour SQL Server Express
    instanceName: 'sqlexpress',    // nom de l'instance
  },
  pool: {
    max: 10,    // max 10 connexions simultanées
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Pool de connexions (singleton)
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