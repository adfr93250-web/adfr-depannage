# PRD — ADFR Auto Dépann France Remorquage

## Problème initial (verbatim utilisateur)
Site de génération d'appels : « Faire sonner le téléphone. Tout le site est conçu pour un seul clic : appeler ou WhatsApp. » Site React optimisé conversion téléphonique + SEO local Île-de-France, service d'urgence 24/7. React (pas Shopify) + guide d'hébergement gratuit. Domaine adfr-depann.fr.

## Architecture réalisée
- **Frontend** : React 19 + TypeScript + TailwindCSS + framer-motion + lenis (scroll fluide), CRA/craco.
  - Page d'accueil conversion : hero cinétique (révélation ligne par ligne) avec vraie photo de dépanneuse, marquee éditorial lent (confiance), bento 7 services, carte IDF SVG cliquable (8 départements), processus 3 étapes, 6 avis, FAQ (accordéon shadcn), formulaire de rappel 4 champs.
  - 48 pages SEO locales générées depuis /app/frontend/src/data/zones.ts : 8 départements (/depannage-75 etc.), 20 grandes villes, 20 arrondissements de Paris. Chaque page : H1 géolocalisé, contenu unique (repères, axes), CTA appel + WhatsApp pré-rempli, FAQ locale, formulaire avec lieu pré-rempli, maillage interne (voisins + département).
  - SEO : sitemap.xml (49 URLs), robots.txt, meta/OG/canonical dynamiques (composant Seo), JSON-LD LocalBusiness + FAQPage + WebSite, favicon 24/7 extrait du logo réel.
  - Mobile-first : barre d'appel sticky rouge (tel:+33185800061), WhatsApp flottant (wa.me/33652664749), tracking des clics fire-and-forget.
- **Backend** : FastAPI (server.py) — POST /api/callback (validation pydantic), POST /api/track (call|whatsapp|form), GET /api/health.
- **DB** : MongoDB — collections `callbacks` et `track_events` (base = DB_NAME).

## Personas
1. **Automobiliste en urgence (mobile, stressé)** : veut un numéro à un clic, délai clair, barre sticky.
2. **Client assurance** : veut l'attestation, la mention « tous assureurs », paiement sur place.

## Exigences cœur (statique)
Numéro 01 85 80 00 61 cliquable partout ; WhatsApp +33 6 52 66 47 49 pré-rempli ; promesse « 20 min » ; zones 75/77/78/91/92/93/94/95 ; 48 pages locales ; formulaire 4 champs (nom, tél, lieu, type de panne) ; tracking clics.

## Implémenté (29/10/2026)
Structure complète + header/footer, sticky bar + WhatsApp flottant, hero, marquee confiance, 7 services, carte IDF cliquable, processus, avis (6 placeholders), FAQ, formulaire + tracking FastAPI/MongoDB, 48 pages SEO locales, sitemap/robots/JSON-LD/OG, logo détourné + favicon 24/7, guide d'hébergement (GUIDE-HEBERGEMENT.md).

## Implémenté (30/10/2026)
- SEO complet (skill farm-seo-setup) : canonical + og:url/adfr-depann.fr, robots.txt avec groupe crawlers IA + Disallow /api/, llms.txt, sitemap 49 URLs simplifié, noscript riche, titres 50-60 chars uniques par route, og:image 1200x630 réelle.
- Espace interne /admin (auth JWT bcrypt selon playbook, seed unique, brute force 5/15min) : suivi des demandes de rappel du jour, compteur "en retard (+30 min)", bouton Traité/Réouvrir, callback records avec champ handled.

## Vérifié
- curl : /api/health, /api/track, /api/callback (OK + validation rejetée correctement), sitemap/robots 200.
- Screenshots : accueil desktop 1440 + mobile 390, page Boulogne-Billancourt (formulaire rempli → succès), page département 93. Pas d'overflow horizontal.

## Backlog
- P0 : remplacer SIRET/mentions légales (footer) quand fournis ; vrais avis Google.
- P1 : photos réelles de flotte supplémentaires ; page « Mentions légales » complète ; intégration Google Business Profile.
- P2 : admin léger pour lire les rappels ; A/B sur CTA ; statistiques de tracking visualisées.
