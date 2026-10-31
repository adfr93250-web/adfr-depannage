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
- Optimisations mobile : image hero srcSet (800w 227KB sur mobile vs 1MB), safe-area iPhone (barre rouge + WhatsApp), viewport-fit=cover, suppression délai tap 300ms, prefers-reduced-motion, preloads conditionnels.
- Décision client (30/10/2026) : les textes restent ceux de la version initiale (24/7 — 7j/7, tous assureurs, week-ends et jours fériés). Les expérimentations « fermeture samedi » et « assurances sélectives » ont été annulées. /admin, optimisations mobile et SEO conservés.
- Galerie photos « Sur le terrain » ajoutée sur l'accueil (photos réelles du plateau + combi arrimé, 1 photo d'exemple batterie à remplacer).
- Google Ads : balise gtag AW-18543287149 sur toutes les pages + suivi de conversion branché sur les clics Appel / WhatsApp / envoi formulaire (étiquette en REACT_APP_GOOGLE_ADS_CONVERSION, préfixe AW-18543287149 reconstitué côté code).
- Alerte email (31/10/2026) : cron plateforme toutes les 15 min → POST /api/cron/unhandled-alerts (Bearer WEBHOOK_CRON_SECRET) ; demande du jour non traitée depuis 30 min → email Resend géré à ALERT_EMAIL (adfr93250@gmail.com), marquée alerted_at (1 alerte par demande). Vérifié : 401 sans token, 200 + envoi 202 Accepted + alerted_at posé.
- Site déployé : https://depann-24h.emergent.host (première publication 30/10/2026, vérifiée : formulaire, /admin 401, sitemap, prerender Googlebot actif).

## Vérifié
- curl : /api/health, /api/track, /api/callback (OK + validation rejetée correctement), sitemap/robots 200.
- Screenshots : accueil desktop 1440 + mobile 390, page Boulogne-Billancourt (formulaire rempli → succès), page département 93. Pas d'overflow horizontal.

## Backlog
- P0 : remplacer SIRET/mentions légales (footer) quand fournis ; vrais avis Google.
- P1 : photos réelles de flotte supplémentaires ; page « Mentions légales » complète ; intégration Google Business Profile.
- P2 : admin léger pour lire les rappels ; A/B sur CTA ; statistiques de tracking visualisées.


## Changement 2026-10-31 - Email instantane a chaque demande de rappel
- Avant : aucun email a la soumission ; seulement une alerte si une demande reste sans reponse plus de 30 min (cron toutes les 15 min).
- Apres : POST /api/callback envoie un email IMMEDIAT a ALERT_EMAIL (adfr93250@gmail.com) avec nom, telephone cliquable, lieu, panne (send_new_callback_email + _callback_row partage).
- L alerte 30 min reste active comme filet de securite.
- Verifie par curl : 202 Accepted du service email juste apres soumission.


## Changement 2026-10-31 (2) - Suppression de l'alerte 30 minutes
- Utilisateur demande: garder UNIQUEMENT l email instantane a chaque demande de rappel, supprimer l alerte des demandes sans reponse apres 30 min (trop d emails sur Gmail).
- Fait: crons.yml -> "crons: []" (tache planifiee unhandled-alerts supprimee); server.py: suppression de alert_unhandled_callbacks, _alert_email_html et de l endpoint /api/cron/unhandled-alerts. Email instantane conserve.
- Verifie: curl POST /api/callback -> 202 Accepted (email immediat OK); endpoint cron -> 404 (bien supprime).
- Redeploy lance pour retirer le cron sur le site en ligne (les schedules se synchronisent au deploy).
- Note: integration SMS Twilio proposee mais ignoree par l utilisateur (skipped) - ne pas relancer sans demande.


## Changement 2026-10-31 (3) - FAQ ajoutees + promesses fausses supprimees du site
- Client: il n'annonce PAS les prix avant l'intervention et ne travaille PAS avec les assurances.
- Fait site-wide: CallbackForm (2 puces -> intervention rapide 24h/24, depannage sur place ou remorquage), Hero (badge -> 7j/7 weekends et feries), Process (etape 1 sans prix), TrustMarquee, Footer (devis + assureurs retires), Home.tsx meta, ZonePage.tsx (intro, bloc paiement, meta), Services.tsx + ZonePage sub (-> 'on vous dit tout de suite ce qu'on peut faire et quand un depanneur peut partir').
- site.ts: FAQ accueil 7 questions (FAQ batterie restauree a l'identique + FAQ panne de carburant ajoutees, FAQ assurances supprimee, reponse cout rewordee), faqZone 3 questions (assurance supprimee, prix retire), avis mockes rewordes (plus de mention assurance/prix).
- Verifie: testing agent iteration_1 (1 regression Services trouvee puis corrigee), grep final propre, screenshots desktop+mobile sans overflow, form OK.
- Deploiement lance.


## Changement 2026-10-31 (4) - Section 'Envoyez votre position' avec envoi WhatsApp
- Demande client (inspiree du site tpmdepannage.fr): section geolocalisation pour recevoir la position exacte du client sur WhatsApp. PAS de bouton SMS, garder 'Envoyer par WhatsApp' + 'Ou appeler maintenant'.
- Fait: nouveau composant frontend/src/components/PositionSection.tsx monte dans Home.tsx apres le formulaire de rappel (section #position).
- Flow: bouton 'Partager ma position' -> navigator.geolocation (high accuracy) -> encadre 'Position trouvee. Envoyez-la a ADFR :' + bouton vert wa.me avec message standard + lien maps.google.com/?q=lat,lng + bouton appel. Erreurs geo (refus/indispo/timeout) -> encadre rouge avec conseils + bouton appel. Clics tracks (track + gtagConversion whatsapp/call).
- Verifie: desktop 1440x900 et mobile 390x844, succes (href wa.me/33652664749 + maps + coords), erreur (refus navigateur), pas d'overflow.
- Deploiement lance. SMS Twilio reste en attente (client a skippe la carte des cles).


## Changement 2026-10-31 (5) - Bouton Position dans la barre mobile + section sur pages villes
- Client: 'y a pas le bouton' - il attendait le bouton Position dans la barre du bas (modele tpmdepannage.fr: Appeler | Position | Devis).
- Fait: StickyCallBar.tsx -> 2 segments mobiles: appel rouge (2/3, conserve tracking) + bouton 'Position' (MapPin vert, scrollToId('position') via lenis). Pas de bouton Devis (pas de promesse prix).
- PositionSection montee aussi sur ZonePage (48 pages villes/departements) pour que le bouton marche partout.
- Verifie mobile 390x844: barre ok, scroll vers section ok (accueil + /depannage-92), succes geolocalisation ok.
- Deploiement lance.
