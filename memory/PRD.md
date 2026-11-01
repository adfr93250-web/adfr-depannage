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


## CORRECTION MAJEURE 2026-10-31 (6) - Le vrai domaine est adfr-depannage.fr
- ATTENTION fork futur: le handoff precedent indiquait adfr-depann.fr -> ERRONE. Le vrai domaine du client est ADIFR... non ADFR: https://adfr-depannage.fr (avec 'age'). Ne plus verifier adfr-depann.fr (n'existe pas au registre AFNIC, 404 RDAP confirme).
- Etat verifie: https://adfr-depannage.fr -> HTTP/2 200, TLS valide, contenu ADFR servi. www.adfr-depannage.fr -> 308 vers la racine. DNS: @ -> 162.159.142.117 OK; www -> 162.159.142.117 + 162.159.142.113 (2e IP probablement mal saisie, sans impact - la plateforme route les deux hotes). Redondance @ -> 172.66.2.113 optionnelle.
- Fait (SEO): correction du domaine partout ou il etait code en dur: site.ts SITE.domain, public/index.html (canonical, og:url, og:image, twitter:image, JSON-LD), robots.txt (ligne Sitemap), sitemap.xml (tous les <loc>), llms.txt. Verifie servi: canonical = https://adfr-depannage.fr/. Restart frontend requis (le dev server ne rechargait pas index.html).
- SITE_PUBLIC_URL backend = ancienne URL technique depann-24h.emergent.host (bouton 'Ouvrir le suivi' des emails d'alerte) -> carte secrets proposee, CLIENT A SKIPPE. A re-proposer plus tard (valeur souhaitee: https://adfr-depannage.fr). Ne JAMAIS editer .env soi-meme.
- Deploiement lance.


## Changement 2026-11-01 (7) - Balise Google Ads format officiel
- Client a colle les instructions gtag: ID AW-18543287149 (deja bon dans index.html) + action de conversion Contact (label masque dans son message).
- Fait: lib/api.ts gtagConversion() -> format officiel Google: window.gtag(event,conversion,send_to,event_label) au lieu dun push dataLayer en objet plat (risque que les conversions ne soient pas comptees avant). Verifie en preview: clic appel -> evenement conversion correct vers AW-18543287149 avec label env actuel.
- Label: client a SKIPPE la carte secrets 2x -> env garde lancienne valeur. Si ses campagnes utilisent la nouvelle action Contact, refaire la carte secrets plus tard (ne jamais coller le label dans le code/chat).
- Pas de pages AMP (site React) - section AMP ignoree.
- Deploiement lance. Restant: stats admin (a) clics, (b) stats semaine, (c) export CSV, (d) notes - client na pas tranche.


## Changement 2026-11-01 (8) - Etiquette de conversion Contact branchee - TERMINE
- Client a enregistre la nouvelle etiquette via la carte securisee (REACT_APP_GOOGLE_ADS_CONVERSION mise a jour, ancienne valeur remplacee). Valeur jamais affichee dans le chat.
- Frontend redemarre, verifie par test de clic: evenement conversion au format officiel Google, send_to AW-18543287149/<nouvelle etiquette> -> action Contact.
- Deploiement lance pour la prod. Google Ads validera laction Contact sous quelques heures (apres quelques clics/visites).
- Etat final suivi Google Ads: gtag.js AW-18543287149 sur toutes les pages + conversions (call/whatsapp/form) vers laction Contact. Ne rien re-modifier sans demande.


## Changement 2026-11-01 (9) - Action Annonce Appel Direct branchee - TERMINE
- Client a colle le snippet gtag_report_conversion de sa nouvelle action Google Ads Annonce Appel Direct (label masque, enregistre via carte securisee REACT_APP_GOOGLE_ADS_CONVERSION_CALL - jamais affiche dans le chat).
- Fait: lib/api.ts -> helper sendConversion + gtagConversion: sur clic dappel, DEUX conversions partent (Contact + Appel Direct, value 1.0 EUR). WhatsApp et formulaire: Contact uniquement. Pas devent_callback (liens tel: natifs, navigation non bloquee).
- Verifie en preview: 1 clic appel -> 2 evenements conversion au format officiel (appel-direct 1 EUR + call). gtag.js AW-18543287149 deja en place, rien a ajouter.
- Deploiement lance. Google Ads validera les deux actions sous quelques heures apres clics/visites.


## Bug resolu 2026-11-01 - Erreur 1034 sur adfr-depannage.fr
- Cause racine (RCA test agent): le client avait saisi 162.159.142.113 (IP edge Cloudflare restreinte) au lieu de 172.66.2.113 sur les A de @ et www chez IONOS -> Cloudflare repondait 403 Error 1034 Edge IP Restricted sur ~50% des requetes.
- Correctif client (IONOS): @ et www -> [162.159.142.117 + 172.66.2.113]. Le site marchait avant uniquement via 162.159.142.117.
- Verifie par testing agent (iteration_2): 5 requettes espacees toutes 200 servies alternativement par les DEUX IPs, aucun 1034; www 308 vers racine; /depannage-92 200; robots.txt + sitemap.xml 200 avec domaines corrects; TLS valide; home complete (titre, boutons, section position, formulaire, FAQ). 100% OK, aucun bug reste.
- Etat final DNS IONOS: @ -> 162.159.142.117 + 172.66.2.113; www -> 162.159.142.117 + 172.66.2.113; enregistrements mail IONOS (MX/SPF/DKIM/dmarc) intacts.


## Verifie 2026-11-01 - Sitemap conforme (message GSC adresse incorrecte = erreur de saisie client)
- testing agent iteration_3: sitemap https://adfr-depannage.fr/sitemap.xml 100% conforme protocole sitemaps.org 0.9 (HTTP 200, content-type application/xml, pas de BOM, namespace officiel, 49 URL absolues https, 0 doublon, lastmod YYYY-MM-DD valides, robots.txt avec ligne Sitemap correcte). Aucune modif de fichier requise.
- Cause du message GSC 'adresse sitemap incorrecte': saisie client dans le champ (probable URL complete collee alors que le champ prefixe deja https://adfr-depannage.fr/). Instruction: taper uniquement sitemap.xml (ou /sitemap.xml si refuse).


## Verifie 2026-11-01 - GSC impossible de lire le sitemap = statut transitoire
- testing agent iteration_4: 7/7 PASS. Sitemap lisible par Googlebot AUJOURDHUI: 5/5 fetchs HTTP 200 (0,35-0,5s), les deux IPs edge OK (contenu identique), aucun challenge/blocage Cloudflare, 0 redirection, XML valide 49 URLs, robots.txt conforme.
- RCA: GSC a fetché pendant la fenetre DNS erronee (162.159.142.113 -> 1034). Statut GSC residuel, cycle de re-fetch asynchrone 24-72h.
- Recommandation client: re-soumettre (bouton Soumettre a nouveau) + attendre 24-72h. Aucune action technique requise.


## Etape SEO 2026-11-01 - Sitemap ACCEPTE dans Google Search Console
- Client: sitemap.xml accepte dans GSC (propriete DOMAINE adfr-depannage.fr verifiee via TXT auto IONOS/Domain Connect).
- Restant SEO: demander l indexation (accueil + 2-3 pages villes) via l outil d inspection d URL; indexation complete attendue sous 3-10 jours; a suivre dans GSC > Pages.
- Prochaine grande etape proposee mais non confirmee par le client: fiche Google Business (Maps) - tres important pour un depanneur (recherches locales 'depannage pres de moi').
