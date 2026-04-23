const jwt = require("jsonwebtoken");

const SECRET = "sam_montereau_reservation_voiture_secret_2026";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(
    "🔍 AUTH CHECK:",
    req.method,
    req.url,
    token ? "token présent" : "PAS DE TOKEN",
  );

  if (!token) {
    return res.status(401).json({ error: "ACCÈS REFUSÉ — Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("🔓 Token OK pour:", decoded.cognomeNome);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("🔴 Token REJETÉ:", err.message);
    return res
      .status(403)
      .json({ error: "ACCÈS REFUSÉ — Token invalide ou expiré" });
  }
}

module.exports = authMiddleware;
