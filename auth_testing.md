# Auth Testing Playbook — ADFR (admin unique)

## Stack auth
- bcrypt + JWT (httpOnly cookies) selon le playbook d'intégration Emergent
- Admin unique seedé au démarrage (collection `users`, role "admin") — seed seulement si absent, ne réconcilie jamais avec .env
- Brute force : 5 tentatives échouées = verrou 15 min (collection `login_attempts`)
- Endpoints : POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout, GET /api/auth/me
- Endpoints protégés : GET /api/callbacks?scope=today|all, PATCH /api/callbacks/{id}

## Étapes de test
1. Login :
```
curl -c /tmp/cookies.txt -X POST "$API_URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@adfr-depann.fr","password":"<ADMIN_PASSWORD>"}'
```
→ doit retourner {"ok":true,...} et poser les cookies access_token + refresh_token.

2. Session :
```
curl -b /tmp/cookies.txt "$API_URL/api/auth/me"
```
→ {"email":"admin@adfr-depann.fr","role":"admin"}

3. Données protégées :
```
curl -b /tmp/cookies.txt "$API_URL/api/callbacks?scope=today"
curl -b /tmp/cookies.txt -X PATCH "$API_URL/api/callbacks/<id>" -H "Content-Type: application/json" -d '{"handled":true}'
```

4. Sans cookie → 401. Mauvais mot de passe → 401. 6e tentative → 429.

## Identifiants
Voir /app/memory/test_credentials.md (ADMIN_EMAIL / ADMIN_PASSWORD dans backend/.env).
