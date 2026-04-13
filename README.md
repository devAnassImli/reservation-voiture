# 🚗 Réservation de Voiture — SAM Montereau

**Application de gestion de réservation de véhicules d'entreprise**
Groupe Riva — Usine SAM Montereau — France

[![CI/CD Pipeline](https://github.com/devAnassImli/reservation-voiture/actions/workflows/ci.yml/badge.svg)](https://github.com/TON-PSEUDO/reservation-voiture/actions)

---

## 📋 Description

Application web full-stack permettant la gestion complète du parc automobile et des réservations de véhicules pour les employés de l'usine SAM Montereau (Groupe Riva).

### Fonctionnalités

- **Authentification sécurisée** avec JWT (JSON Web Token)
- **Gestion du parc auto** : marques, modèles, véhicules
- **Réservation de véhicules** avec vérification de disponibilité
- **Gestion des voyageurs** par réservation
- **Contrôle de disponibilité** croisé avec la maintenance
- **Validation RH** des réservations

---

## 🏗️ Architecture

Architecture **3 couches** (three-tier architecture) :

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FRONTEND      │     │   BACKEND       │     │   BASE DE       │
│   React         │────▶│   Node.js       │────▶│   DONNÉES       │
│   (port 3000)   │     │   Express       │     │   SQL Server    │
│                 │     │   JWT           │     │                 │
│   - Login       │     │   (port 5000)   │     │   7 tables      │
│   - Dashboard   │     │                 │     │   28 PS         │
│   - CRUD        │     │   5 routes API  │     │                 │
│   - Réservation │     │   Middleware    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Technologies utilisées

| Couche             | Technologies                                   |
| ------------------ | ---------------------------------------------- |
| Frontend           | React 18, CSS3, JavaScript ES6+                |
| Backend            | Node.js 20, Express.js, JWT, bcrypt            |
| Base de données    | Microsoft SQL Server 2022, Stored Procedures   |
| DevOps             | Docker, Docker Compose, GitHub Actions (CI/CD) |
| Tests              | Jest, Supertest                                |
| Gestion de version | Git, GitHub                                    |

---

## 🚀 Démarrage rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé

### Lancement (une seule commande)

```bash
git clone https://github.com/devAnassImli/reservation-voiture.git
cd reservation-voiture
docker-compose up --build
```

L'application est accessible sur : **http://localhost:3000**

### Arrêt

```bash
docker-compose down
```

---

## 🔧 Développement local (sans Docker)

### Prérequis

- Node.js 20+
- SQL Server (accès au serveur de l'usine ou instance locale)

### Installation

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cp .env.example .env   # Configurer la connexion SQL Server
```

### Lancement

```bash
# Terminal 1 : Backend
cd backend
node server.js

# Terminal 2 : Frontend
npm start
```

---

## 🧪 Tests

```bash
cd backend
npm test
```

Les tests couvrent :

- Authentification (login, token JWT)
- Sécurité (accès refusé sans token, token expiré)
- CRUD Marques (création, doublon, suppression)
- Validation des entrées (injection SQL, XSS)

---

## 📂 Structure du projet

```
reservation-voiture/
├── .github/workflows/     CI/CD GitHub Actions
├── backend/
│   ├── config/            Configuration base de données
│   ├── middleware/         Middleware JWT
│   ├── routes/            Routes API REST
│   ├── tests/             Tests unitaires
│   ├── Dockerfile
│   └── server.js          Point d'entrée API
├── docker/
│   ├── init-db.sql        Script initialisation BDD
│   └── setup-db.sh        Script démarrage Docker
├── src/
│   ├── api/               Service d'appels API
│   ├── components/        Composants réutilisables
│   ├── context/           AuthContext (gestion session)
│   └── pages/             Pages de l'application
├── docker-compose.yml     Orchestration Docker
├── Dockerfile             Build frontend
└── nginx.conf             Configuration serveur web
```

---

## 🔒 Sécurité

- **JWT** : Toutes les routes API sont protégées par token
- **Stored Procedures** : Prévention injection SQL (requêtes paramétrées)
- **CORS** : Configuration des origines autorisées
- **Validation** : Contrôle des entrées côté serveur
- **RGPD** : Pas de stockage de données personnelles sensibles

---

## 📊 Base de données

### Tables principales

| Table           | Description               |
| --------------- | ------------------------- |
| utMarche        | Marques de véhicules      |
| utModelli       | Modèles de véhicules      |
| utAuto          | Parc automobile           |
| utPrenotazioni  | Réservations              |
| utVoyagers      | Voyageurs par réservation |
| utManutenzioni  | Maintenances véhicules    |
| utFicheControle | Fiches de contrôle        |

### Stored Procedures (extrait)

| Procédure                                     | Description                      |
| --------------------------------------------- | -------------------------------- |
| ai_insert_reservation                         | Créer une réservation            |
| ai_get_voiture_flotte_complete                | Liste des véhicules par priorité |
| ai_get_control_disponibilite_pour_reservation | Vérifier disponibilité           |
| ai_insert_voyager                             | Ajouter un voyageur              |
| ai_get_reservation_complete                   | Toutes les réservations          |

---

## 👤 Auteur

**IMLI Anass** — Apprenti Concepteur Développeur d'Applications
Usine SAM Montereau — Groupe Riva — France
Bachelor CDA — 2025/2026

---

## 📄 Licence

Projet réalisé dans le cadre d'un bachelor Concepteur Développeur d'Applications (CDA).
Usage interne — Groupe Riva.
