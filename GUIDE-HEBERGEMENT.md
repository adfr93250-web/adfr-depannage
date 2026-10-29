# ADFR — Guide d'hébergement gratuit (5 minutes)

Objectif : mettre le site en ligne sur **adfr-depann.fr** sans payer d'hébergement.
Coût total : **0 € par mois** (hors nom de domaine). Trois services gratuits, aucun code à écrire.

## Vue d'ensemble

| Brique | Service gratuit | Rôle |
|---|---|---|
| Site (React) | **Vercel** | Affiche le site, très rapide |
| Formulaires (FastAPI) | **Render** | Reçoit les demandes de rappel + clics |
| Base de données | **MongoDB Atlas** | Stocke les demandes |

## Étape 1 — MongoDB Atlas (2 min)
1. Créez un compte sur mongodb.com/cloud/atlas (gratuit).
2. Créez un cluster **M0 (Free)**.
3. Database Access → ajoutez un utilisateur (ex. `adfr` + mot de passe solide).
4. Network Access → autorisez `0.0.0.0/0`.
5. Notez l'URL de connexion : `mongodb+srv://adfr:MOTDEPASSE@cluster0.xxxx.mongodb.net/adfr`

## Étape 2 — Le backend sur Render (2 min)
1. Poussez le dossier `backend/` sur GitHub.
2. Sur render.com : New → Web Service → branchez le repo.
3. Réglages : Build `pip install -r requirements.txt` — Start `uvicorn server:app --host 0.0.0.0 --port $PORT`.
4. Variables d'environnement : `MONGO_URL` = l'URL de l'étape 1, `DB_NAME` = `adfr`, `CORS_ORIGINS` = `https://adfr-depann.fr`.
5. Notez l'URL obtenue : `https://adfr-api.onrender.com`

## Étape 3 — Le site sur Vercel (1 min)
1. Sur vercel.com : Add New → Project → le même repo GitHub, dossier `frontend`.
2. Variable d'environnement : `REACT_APP_BACKEND_URL` = `https://adfr-api.onrender.com` (l'URL de l'étape 2, sans slash final).
3. Deploy. Notez l'URL provisoire : `adfr.vercel.app`.

## Étape 4 — Brancher adfr-depann.fr
1. Dans Vercel → Settings → Domains → ajoutez `adfr-depann.fr`.
2. Vercel affiche des enregistrements DNS (A `76.76.21.21` ou CNAME).
3. Chez votre registrar (où vous avez acheté le domaine), collez ces enregistrements dans la zone DNS.
4. Attendez la propagation (souvent 5 à 30 min). Le HTTPS s'active tout seul.

## Récapitulatif
- Site : Vercel (gratuit, illimité en trafic normal)
- API : Render (gratuit, le serveur s'endort après 15 min d'inactivité et se réveille en ~30 s — acceptable pour stocker les rappels)
- Données : MongoDB Atlas M0 (gratuit, 512 Mo — des années de demandes de rappel)
- Domaine : seul coût réel, déjà réglé.

Pour les demandes de rappel reçues : MongoDB Atlas → Browse Collections → base `adfr` → collection `callbacks`. Les clics Appel/WhatsApp sont dans `track_events`.
