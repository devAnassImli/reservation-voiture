# ─────────────────────────────────────────────
# Dockerfile — Backend API (Node.js/Express)
# 
# Ce Dockerfile crée un conteneur avec l'API.
# Il installe les dépendances et lance le serveur.
# ─────────────────────────────────────────────

FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances d'abord (optimisation cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du code
COPY . .

# Port exposé
EXPOSE 5000

# Commande de démarrage
CMD ["node", "server.js"]
