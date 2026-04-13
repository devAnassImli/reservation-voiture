# ─────────────────────────────────────────────
# Dockerfile — Frontend React
#
# Étape 1 : Build (compile le React en HTML/JS/CSS statiques)
# Étape 2 : Serve (sert les fichiers avec nginx)
#
# C'est une "multi-stage build" — bonne pratique Docker (CP11 !)
# ─────────────────────────────────────────────

# Étape 1 : Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur nginx
FROM nginx:alpine

# Copier les fichiers buildés dans nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configuration nginx pour le routing React (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]