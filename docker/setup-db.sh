#!/bin/bash
echo "⏳ Attente du démarrage de SQL Server..."

for i in {1..60}; do
    /opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ SQL Server est prêt !"
        break
    fi
    echo "   Tentative $i/60..."
    sleep 1
done

echo "📦 Initialisation de la base SAM_MT_ReservationAuto..."
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -C -i /docker-entrypoint-initdb/init-db.sql

if [ $? -eq 0 ]; then
    echo "✅ Base de données initialisée avec succès !"
else
    echo "❌ Erreur lors de l'initialisation"
fi