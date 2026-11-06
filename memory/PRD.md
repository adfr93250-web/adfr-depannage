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


## Feature 2026-11-01 (10) - Nouvelle page ville /depannage-vincennes
- Demande client: page depannage Vincennes (Val-de-Marne).
- Fait: zones.ts entree ville (slug vincennes, cp 94300, dept 94, spots: chateau/place de la Gare/bois de Vincennes, axes A4/D5, neighbors 94/creteil/montreuil/paris-12); sitemap.xml +1 URL (50 total); llms.txt 21 grandes villes.
- Verifie preview: page 200, titre + H1 geolocalises, FAQ Vincennes 3 questions, liens voisins, pas d overflow.
- Deploiement lance. Total site: 50 pages ville/dept (8 dept + 42 villes).


## Feature 2026-11-01 (11) - 3 nouvelles pages villes: Saint-Mande, Villemomble, Bagnolet
- Demande client. Fait: zones.ts +3 entrees ville (saint-mande 94300 dept 94; villemomble 93250 dept 93; bagnolet 93160 dept 93, avec spots/axes/voisins reels), sitemap.xml 53 URLs, llms.txt 24 grandes villes.
- Verifie preview: 3 pages HTTP 200, titres/H1 geolocalises, FAQ locales conformes (sans prix/assurance), liens voisins, pas d overflow (screenshot saint-mande OK).
- Deploiement lance. Total site: 53 pages SEO (8 dept + 45 villes).


## Feature 2026-11-01 (12) - Enrichissement anti-doorway des 52 pages zones - TERMINE
- Choix client: TOUT enrichir (8 dept + 20 arrondissements + 24 villes) car contenu duplique = risque doorway pages.
- Fait: nouveau fichier frontend/src/data/zoneContent.ts -> LOCAL_CONTENT (Record slug -> { texte unique, faq4: {q,a} }), 52 entrees redigees avec contenu local reel (quartiers, axes, evenements locaux: Stade de France, chateau de Versailles, bords de Marne, pentes de Montmartre...).
- ZonePage.tsx: import LOCAL_CONTENT, paragraphe unique rendu (data-testid zone-unique-text) dans section Votre depanneur connait X, FAQ = faqZone + faq4 (4 questions), JSON-LD FAQPage mis a jour avec 4 Questions.
- Fix par testing agent (iteration_5): cle saint-maur-des-fosses (slug ASCII sans accent) qui rendait la page sans contenu unique. Verifie 5 pages echantillon: 100% (textes distincts, 4 FAQ, JSON-LD, promesses vraies, formulaire OK).
- Polish applique: titre FAQ des departements -> Questions frequentes + deptIn (ex: dans les Hauts-de-Seine).
- Deploiement lance.


## Mission SEO local complete 2026-11-01 (13) - Rapport des changements - TERMINE
Brief client en 10 points, execute et verifie (testing agent iteration_6: 100%):
1. Pages locales: 52 URLs uniques /depannage-slug (choix ASSUME: canonical SANS slash final, coherent sitemap+GSC).
2. Balises: title + meta description uniques par zone (generes par zone, verifies distincts sur 4 pages).
3. Contenu: H1 unique par page (fix: h1 statique du noscript index.html -> h2), H2 structures (Votre depanneur connait X / Services / Zones voisines / FAQ), contenu local unique (paragraphes + 4e FAQ, 52 entrees zoneContent.ts).
4. Technique: robots.txt (Allow /, Disallow /api/, ligne Sitemap), codes HTTP 200.
5. RENDU/PRERENDU: frontend/scripts/prerender.mjs (puppeteer-core + /usr/bin/google-chrome, PAS de download), lance en postbuild de yarn build: rend les 53 routes dans Chrome, scrolle pour declencher les animations framer-motion, sauve le HTML complet dans build/<route>/index.html. Verifie: 53/53 fichiers avec titre/meta/canonical/JSON-LD/textes uniques + 1 seul h1.
6. Sitemap: 53 URLs valides (namespace 0.9). 7. Maillage: accueil -> 52 liens zones + services; pages villes -> voisins + fil d Ariane. 8. Schema.org: LocalBusiness NETTOYE (suppression priceRange et geo = pas d etablissement/prix inventes; garde nom, tel, url, region IDF, 24/7, areaServed) + FAQPage. 9. Canoniques: 1 par page, sans conflit. 10. Regressions: aucune (formulaire, boutons, position, preview desktop+mobile OK).
- Deploiement lance (le postbuild s executera au build de prod).
- Taches restantes cote client: re-soumission sitemap GSC deja faite; indexation naturelle 2-6 semaines; fiche Google Business (client dit l avoir faite); vrais avis Google a collecter; SIRET/mentions legales a fournir.


## Fix 2026-11-01 (14) - Favicon logo dans les resultats Google + page Creteil
- Client: son resultat Google mobile (requete adfr depannage creteil) montrait un globe generique au lieu du logo, et la page /depannage-93 au lieu de /depannage-creteil.
- Fait: favicon-247.png regenere avec PIL (512x512 carre, fond blanc, vrai logo ADFR centre, 87 Ko, meme nom de fichier -> balises icon/apple-touch-icon intactes dans index.html + 53 pre-rendus). Testing agent iteration_7: 100% (favicon valide visuellement + techniquement, page Creteil pre-rendue avec title/canonical/FAQPage/texte unique, maillage accueil+dept94+dept93 vers creteil OK, sitemap 53 URLs, aucune regression).
- Classement Creteil: tous les signaux techniques en place; le classement reel depend de la re-indexation Google (2-6 semaines). Conseil client: Demander l indexation sur /depannage-creteil dans GSC.
- Deploiement lance.


## Annulation 2026-11-01 (15) - Option QR code annulee par le client
- Le client avait demande loption E (QR codes par depanneuse + page /appeler) puis a ANNULE (execution pausee + Jannule cette option).
- TOUT a ete retire proprement: CallPage.tsx supprime, route /appeler et GlobalCTAs retires de App.tsx (Footer/StickyCallBar/WhatsAppFloat retablis), section QR retiree de AdminPage, PNG qr-camion-*.png supprimes, prerender.mjs retabli (53 routes sans /appeler).
- Verifie: aucune reference residuelle, accueil + pages zones HTTP 200.
- Ne PAS reconstruire loption QR sans nouvelle demande explicite du client.
- Options restantes non construites proposees a lequipe (a, b, c, d) : affectation employe dans le suivi, notes par demande, fiche reflexe depanneur, reponses rapides WhatsApp.


## Feature 2026-11-01 (16) - Animation hero spectaculaire - TERMINE
- Client: pas de video IA, rendre l entree du texte du hero plus spectaculaire.
- Fait (Hero.tsx, framer-motion pur, texte toujours dans le DOM = SEO safe): badge en blur-in; lignes du titre glissent avec rotation 3deg + scale 0.96; rayon de lumiere (sweep) traverse le titre une fois (delay 0.6s); ligne rouge EN 20 MINUTES pulse dun halo rouge (textShadow keyframes delay 0.95s); barre rouge de 1.5px se dessine sous le titre (scaleX, delay 1.0s); sous-titre blur-in (0.75s); boutons ressort spring pop (0.95s); badges fade-up (1.1s). Total ~1.7s.
- Verifie: desktop + mobile, etat final correct (titre visible, barre rouge presente, pas d overflow, pas de decalage).
- Deploiement lance.


## Support 2026-11-02 (17) - Conseil Google Ads (session sans code) + Flyer digital
- Session conseil Google Ads pour le client (non-technique, FR): structure campagne (campagne Recherche "adfr 2" 15->10 EUR/j; PMax "Dépannage Auto 24/24" mise en veille), 24 groupes d annonces par ville + groupe urgence, correspondance Expression, exclusions (prix/emploi/assurance/vente/bricolage...), ajustement enchères mobile +30%, extension appel 0185800061, liens annexes villes, modèle titres/descriptions fournis pour 53 zones.
- Aide GSC: pas d indexation manuelle des 53 pages nécessaire (sitemap complet vérifié, 53 URLs); demande d indexation manuelle seulement accueil + villes prioritaires; vérification annonceur "en cours" n empêche pas la diffusion.
- Corrections conseillées dans son compte Ads: supprimer "combien coute un remorquage de voiture", passer "dépannage auto" et "voiture en panne" en Expression, URL finale accueil correcte (chemin d affichage cosmétique seulement).
- Créé: flyer digital 1080x1080 (WhatsApp/réseaux) — /app/frontend/public/flyer.html (source) + /app/frontend/public/flyer-adfr.png (image), couleurs bleu nuit/rouge, logo, promesse 20 min, services, 53 zones IDF, tel 01 85 80 00 61 + WhatsApp 06 52 66 47 49. Vérifié par capture (1080x1080, pas d overflow). Sera livré sur adfr-depannage.fr/flyer-adfr.png au prochain deploy.
- Données Ads client au 1er nov: 336 impressions, 6 clics, CTR 1,79%, ~2,40 EUR/clic, 0 appel encore (apprentissage, échantillon faible). Prochain jalon: termes de recherche à filtrer ensemble.

## Feature 2026-11-02 (18) - Flyer Story 1080x1920 + logo visible
- Client: version verticale 1080x1920 du flyer pour statuts WhatsApp/stories Instagram + logo plus visible.
- Cree: /app/frontend/public/flyer-story.html (source) + /app/frontend/public/flyer-story.png (image finale). Logo sur pastille blanche sur les 2 flyers (flyer.html + flyer-story.html). Verifie captures 1080x1920 et 1080x1080: pas d overflow, tout lisible.
- Liens publics: /flyer-adfr.png (carre) et /flyer-story.png (story), HTTP 200. Livres sur adfr-depannage.fr au prochain deploy.

## Support + Feature 2026-11-02 (19) - Conseil CPC Google Ads + 8 pages villes Zone 1 (Est parisien)
- Conseil client (FR, non-technique): pourquoi CPC eleve (secteur depannage tres concurrentiel IDF, compte neuf = niveau de qualite bas, +30% mobile, petit budget, mots-cles larges). Recommandations: CPC max 5-6 EUR, mobile ramene a 0%, tablettes -100%, ordinateurs -70%, NE PAS activer "Application automatique des recommandations" (decocher "Ajoutez de nouveaux mots cles"), Reseau Display decoche, partenaires de recherche decoches, option zone "Presence" uniquement, rayon 10 km Saint-Mande + 8 km Villemomble, composant Appel + annonce Appel uniquement.
- Client base a Saint-Mande (94) et Villemomble (93). Liste villes Zone 1/Zone 2 fournie.
- Fait: 8 nouvelles pages villes (slug -> /depannage-<slug>): fontenay-sous-bois (94120), rosny-sous-bois (93110), gagny (93220), bondy (93140), noisy-le-sec (93130), le-raincy (93340), nogent-sur-marne (94130), neuilly-sur-marne (93330). zones.ts (+8 entrees avec lat/lng, spots, axes, voisins) ; zoneContent.ts (+8 textes uniques + FAQ locale) ; voisins de saint-mande/vincennes/montreuil/villemomble mis a jour pour le maillage ; sitemap.xml 61 URLs. Prerender automatique (regex slug dans prerender.mjs) => 61 routes au prochain build/deploy.
- Total site: 61 pages SEO (8 dept + 53 villes/arrondissements hors Paris... = 8 dept + 20 arr. Paris + 33 villes).

## Feature 2026-11-02 (20) - Compteur clics Appel / WhatsApp / Formulaire par jour (admin)
- Backend: GET /api/track/stats?days=7|14|30 (auth admin, cookie) -> rows par jour (fuseau Europe/Paris) {date, call, whatsapp, form, total} + totals. Agrege db.track_events (event in call/whatsapp/form).
- Frontend: /app/frontend/src/components/ClicksStats.tsx (3 totaux + tableau par jour + barres), monte dans AdminPage sous les stats rappels, selecteur 7/14/30 j, rafraichi par le bouton refresh. data-testid: clicks-stats, clicks-range-7/14/30, clicks-total-call/whatsapp/form, clicks-table, clicks-row-<date>.
- But client: comparer les clics factures Google Ads aux clics Appel/WhatsApp reels du site.
- Teste: curl (401 sans auth, 200 avec cookie, buckets corrects) + capture admin. Deploiement lance ensuite (8 pages villes + compteur).


## Feature 2026-11-02 (21) - Marque interchangeable : 2e site "SOS Dépannage" (meme code, meme compte Ads, nouvelle campagne)
- Contexte client : veut un 2e site sans son nom (SOS Dépannage), memes villes, meme compte Google Ads (nouvelle campagne), numero appel 01 84 16 09 23 (WhatsApp 06 52 66 47 49). Prevenu : 1 seule annonce par compte par recherche (pas 2 places), interet = test de marque.
- Architecture : /app/frontend/src/data/brand.ts -> BRAND (adfr | sos) choisi par REACT_APP_BRAND au build. Overrides env : REACT_APP_PHONE (chiffres), REACT_APP_WHATSAPP (336...), REACT_APP_SITE_URL (domaine), REACT_APP_THEME (flamme | neon | gyrophare ; defaut = alerte). site.ts (SITE) derive de BRAND ; brandText() remplace "ADFR" dans les intros zones ; REVIEWS differents par marque.
- Theme : couleurs Tailwind adfr-* passees en variables CSS (--c-*) dans index.css ; :root = ADFR, html[data-brand="sos"] = SOS "Alerte" (noir-rouge sang, rouge total) + variantes data-theme. Polices via --font-display/--font-sans (ADFR Montserrat/Inter, SOS Barlow Condensed/Barlow). SOS : angles nets (override .rounded-*), bandes .hazard, bouton appel qui pulse (sosPulse). data-brand pose dans index.tsx (capture par le prerender).
- SOS : HeroSos.tsx (plein ecran, photo fond, numero geant), pas de Gallery, pas de Process, PAS de formulaire de rappel (Home + ZonePage) -> appel direct uniquement. Assets : /img/logo-sos.png, favicon-sos.png, depanneuse-sos.jpg, og-cover-sos.jpg (generes).
- Backend : champ source ("adfr"|"sos") sur callbacks et track_events (envoye par lib/api.ts) ; callback_out renvoie source ; email alerte prefixe par la marque ; GET /api/track/stats?source=adfr|sos filtre ; admin : badge ADFR/SOS par demande + filtre Tous/ADFR/SOS dans ClicksStats.
- Prerender (scripts/prerender.mjs) : lit .env pour REACT_APP_* ; genere build/sitemap.xml + reecrit robots.txt/llms.txt pour le domaine de la marque ; brandify() remplace les restes ADFR du index.html statique (JSON-LD, noscript, tel) pour SOS. Verifie : build SOS 61/61, titres/canonical/sitemap SOS, 0 "ADFR" dans build/index.html.
- Deploiement SOS (a faire par le client, voir support) : dupliquer le projet -> nouveau job, secrets REACT_APP_BRAND=sos (+ REACT_APP_SITE_URL=https://sos-depann.fr (deja valeur par defaut dans brand.ts)), REACT_APP_BACKEND_URL = https://adfr-depannage.fr pour partager backend/admin (CORS a ouvrir au nouveau domaine) OU meme MONGO_URL/DB_NAME ; attacher le domaine ; nouvelle campagne Ads vers ce domaine. Preview actuel = ADFR (REACT_APP_BRAND retire de .env).

## Modifs contenu ADFR 2026-11-06 (22) - NON DEPLOYEES (client veut valider avant)
- Delai : "en 20 minutes" -> "en moins de 30 minutes" partout cote ADFR via BRAND.delay {long, short} (brand.ts) et brandText() qui reecrit les intros zones/zoneContent a l'affichage (SOS garde 20 min). H1 hero, Home description, ZonePage h2 + description (meta/OG/Twitter via Seo), Footer, TrustMarquee, Hero pills/badge "< 30 min", avis ADFR, index.html statique (meta + noscript ; prerender brandify remet "20 minutes" pour SOS).
- FAQ : Faq.tsx rendu complet en <dl> (reponses dans le DOM, plus d'accordeon). FAQ_HOME_ADFR = 7 Q/R fournies par le client ; FAQ_HOME_SOS = ancienne liste. faqZone delai ADFR "En moins de 30 minutes en moyenne a {ville}... selon la circulation".
- Mentions legales (Footer, ADFR uniquement) : ADFR AUTO DEPANN FRANCE REMORQUAGE SAS, 30 bd Carnot 93250 Villemomble, RCS Bobigny 131 872 509, SIRET 131 872 509 00016, tel, email adfr93250@gmail.com. Hebergeur (choix client) : IONOS SARL, 7 place de la Gare, BP 70109, 57201 Sarreguemines Cedex, tel 0970 808 911.
- TrustMarquee : bandeau statique en une seule occurrence (plus de piste dupliquee aria-hidden pour le defilement).
- ZonesMap : "Huit departements, des centaines de communes" -> "Paris et toute l'Ile-de-France".
- whatsappBase : "Pouvez-vous".
- Gallery : photo Unsplash retiree, 2 vraies photos (plateau col-7 row-2 + combi col-5 row-2).
- Non modifie : flyers (public/flyer*.html/png) mentionnent encore "20 minutes".

## Correctif contenu 2026-11-06 (23) - Pas d'intervention sur autoroute (regle metier client) - NON DEPLOYE
- Client : "on n'intervient pas sur l'autoroute" (reserve aux depanneurs agrees). Corrige : 4 avis (A86, peripherique, A14, A4 -> situations urbaines), intros zones (Rosny, Nogent, Bondy, Paris), textes/FAQ locales (Bagnolet, Rosny, Bondy, Nogent : reponse = non sur autoroute, borne/112, relais des la sortie), ZonePage : "nos equipes connaissent {axes} et leurs sorties" + phrase generique "sur autoroute, depannage reserve aux societes agreees... relais des la sortie".
- A rappeler au client : retirer les mots-cles Ads "depanneuse A86/A4/A3", "panne autoroute/peripherique" et ajouter "autoroute" en negatif.

## Modif 2026-11-06 (24) - ADFR : plus de "Sortie de fourriere" - NON DEPLOYE
- site.ts : SERVICES = SERVICES_ALL filtre pour ADFR (6 cartes, numerotation auto 01-06) ; SOS garde les 7. CallbackForm PANNE_TYPES sans fourriere ; backend PANNE_TYPES sans fourriere (plus accepte). Footer : "... Carburant · Accident" pour ADFR (SOS : "· Fourriere"). llms.txt : ligne retiree. Aucune mention dans zones/zoneContent/FAQ/Seo (verifie grep + rendu home, /depannage-93, villemomble, paris-12).
