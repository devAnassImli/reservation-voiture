// ─────────────────────────────────────────────
// middleware/authMiddleware.js — Vérification du token JWT
//
// Ce middleware est comme un "vigile" devant chaque route.
// Il vérifie que la requête contient un token JWT valide.
//
// En ASP.NET tu avais :
//   if (Session["S_CognomeNome"] == null)
//       Server.Transfer("session_expire.aspx");
//
// En Express avec JWT :
//   Si pas de token → 401 Non autorisé
//   Si token invalide → 403 Interdit
//   Si token OK → on continue vers la route
//
// COMMENT ÇA MARCHE :
//   1. Le client envoie le token dans le header "Authorization"
//   2. Le middleware vérifie le token avec la clé secrète
//   3. Si OK, il ajoute les infos user à req.user
//   4. La route peut alors utiliser req.user.cognomeNome etc.
// ─────────────────────────────────────────────

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Récupérer le token du header Authorization
  // Format : "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // enlève "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'ACCÈS REFUSÉ — Token manquant' });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajoute les infos utilisateur à la requête
    // Maintenant toutes les routes peuvent faire req.user.cognomeNome
    req.user = decoded;
    
    next(); // continue vers la route
  } catch (err) {
    return res.status(403).json({ error: 'ACCÈS REFUSÉ — Token invalide ou expiré' });
  }
}

module.exports = authMiddleware;