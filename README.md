# Amazon EC2 — Cours interactif (HTML + images + backend JSON)

Ce paquet contient :
- **index.html** : page interactive (sommaire, recherche, lightbox, QCM, code "copier").
- **assets/** : CSS, JS, images extraites du .docx.
- **backend/** : petit serveur Node.js pour **enregistrer les visites** et **scores du QCM** dans des fichiers JSON.

## Lancer en local (avec Node.js ≥ 18)
```bash
cd backend
npm install
npm start
```
Ouvrez ensuite http://localhost:8080

## Remplacer la photo de profil
Remplacez `assets/profile.jpg` par votre photo (jpg/png).

## Où sont stockées les données ?
- `backend/data/visits.json` — chaque visite est enregistrée (date, IP, user-agent, referrer).
- `backend/data/quiz.json` — résultats des QCM (score, réponses).

## Déploiement
- **Static hosting** (GitHub Pages/Netlify/Vercel) ➜ La page fonctionne sans backend (QCM ok), mais **pas d'enregistrement** de visites.
- **Node hosting** (Railway/Render/Heroku/VPS) ➜ `npm start` et exposez le port. Les endpoints:
  - `POST /api/visit` pour log de visite
  - `GET /api/stats` pour stats simples
  - `POST /api/quiz` pour log du score

_Généré le 2025-08-30 17:38 automatiquement à partir de votre fichier Word._