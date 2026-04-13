#!/bin/bash
# ─────────────────────────────────────────────
# setup-db.sh — Attend que SQL Server démarre puis initialise la base
# Ce script est exécuté automatiquement au démarrage du conteneur
# ─────────────────────────────────────────────

echo "⏳ Attente du démarrage de SQL Server..."

# Attendre que SQL Server soit prêt (max 60 secondes)
for i in {1..60}; do
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ SQL Server est prêt !"
        break
    fi
    echo "   Tentative $i/60..."
    sleep 1
done

# Exécuter le script d'initialisation
echo "📦 Initialisation de la base SAM_MT_ReservationAuto..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -i /docker-entrypoint-initdb/init-db.sql

if [ $? -eq 0 ]; then
    echo "✅ Base de données initialisée avec succès !"
    echo "   - Tables créées"
    echo "   - Stored procedures créées"
    echo "   - Données de démonstration insérées"
else
    echo "❌ Erreur lors de l'initialisation de la base"
fi