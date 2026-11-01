export interface LocalInfo {
    texte: string;
    faq4: { q: string; a: string };
}

export const LOCAL_CONTENT: Record<string, LocalInfo> = {
    "75": {
        texte: "À Paris, la moitié des interventions se joue sur le périphérique et aux portes : batterie morte après une nuit au bord du boulevard, crevaison à la sortie d'un parking souterrain, panne en pleine heure de pointe sur les grands boulevards. Nos dépanneurs connaissent les quais fermés, les plans de circulation et les arrondissements par cœur.",
        faq4: { q: "Intervenez-vous dans tous les arrondissements de Paris ?", a: "Oui, du 1er au 20e arrondissement, y compris les deux bois. Chaque dépanneur connaît son secteur et les chemins les plus rapides, même la nuit." },
    },
    "77": {
        texte: "La Seine-et-Marne, c'est un département où l'on roule longtemps : l'A4 vers Marne-la-Vallée, l'A5 vers Melun, la Francilienne à Chelles. Une panne loin de chez soi, sur route nationale ou en zone rurale, c'est notre quotidien — nos équipes savent aussi quel garage reste ouvert tard.",
        faq4: { q: "Vous venez même en zone rurale, loin des grandes villes ?", a: "Oui. Entre Melun, Meaux, Chelles et les petits villages, nos dépanneurs parcourent le département chaque jour. Précisez votre lieu-dit au téléphone, on vous retrouve." },
    },
    "78": {
        texte: "Dans les Yvelines, on roule beaucoup : l'A13 vers Poissy, la N12 vers Saint-Quentin-en-Yvelines, et de longues nationales autour de Versailles. Batteries fatiguées par les trajets domicile-travail, crevaisons sur routes rapides : nos dépanneurs connaissent les bouchons de la D10 et les raccourcis entre communes.",
        faq4: { q: "Intervenez-vous du côté de Saint-Quentin-en-Yvelines ?", a: "Oui, de Versailles à Trappes et Montigny-le-Bretonneux, nos équipes couvrent tout l'ouest francilien, 24h/24 et 7j/7." },
    },
    "91": {
        texte: "L'Essonne, c'est le grand sud : l'A6 qui file vers Lyon, l'A10 vers Orléans, et des banlieues étendues de Massy à Évry-Courcouronnes. En panne sur la Francilienne un dimanche soir ou batterie morte au parking du centre commercial, on connaît les accès et les stations les plus proches.",
        faq4: { q: "Vous intervenez du côté d'Évry et de Courcouronnes ?", a: "Oui, tout le secteur d'Évry-Courcouronnes, Corbeil-Essonnes et les communes autour sont dans notre zone, 24h/24 et 7j/7." },
    },
    "92": {
        texte: "Les Hauts-de-Seine, c'est le département le plus dense : les quais de Seine côté Boulogne, les tours de La Défense et leur parking géant, les rues étroites d'Asnières et de Colombes. Nos dépanneurs connaissent les sorties d'A14, les accès livraison des immeubles de bureaux et les heures où le trafic se débloque.",
        faq4: { q: "Vous pouvez venir jusqu'à La Défense ?", a: "Oui, y compris dans les parkings souterrains des tours et sur les quais. Précisez votre niveau et votre place, on vous retrouve directement." },
    },
    "93": {
        texte: "La Seine-Saint-Denis roule dur : l'A1 vers Roissy, l'A3 et son échangeur de Bagnolet, l'A86 au sud. Batteries qui lâchent le matin à Saint-Denis, crevaisons à Montreuil après les chantiers, remorquages de véhicules accidentés à Drancy : nos équipes tournent 24h/24 dans le 93.",
        faq4: { q: "Vous couvrez tout le département du 93 ?", a: "Oui, de Saint-Denis à Saint-Maur, en passant par Montreuil, Bagnolet, Villemomble et Drancy. Un seul numéro, jour et nuit." },
    },
    "94": {
        texte: "Le Val-de-Marne, c'est la croisée des grands axes : l'A4 qui traverse, l'A86 au sud, les bords de Marne plein est. Batterie morte à Créteil le matin, crevaison à Vitry-sur-Seine, remorquage d'un véhicule accidenté à Saint-Maur : nos dépanneurs connaissent chaque sortie d'autoroute et chaque pont de la Marne.",
        faq4: { q: "Intervenez-vous près des bords de Marne ?", a: "Oui, de Saint-Maur à Joinville, en passant par Champigny : les quais et les routes de berge ne posent aucun problème à nos équipes." },
    },
    "95": {
        texte: "Le Val-d'Oise, c'est le grand nord francilien : l'A15 vers Cergy, la Francilienne vers Sarcelles, et de longues nationales entre les communes. En panne au bord de la D14 un dimanche matin ou batterie morte au parking de la gare d'Argenteuil, on connaît les accès et les garages ouverts le week-end.",
        faq4: { q: "Vous venez jusqu'à Cergy et Pontoise ?", a: "Oui, tout le Val-d'Oise est couvert : Cergy, Pontoise, Argenteuil, Sarcelles et les communes autour, 24h/24 et 7j/7." },
    },
    "paris-1": {
        texte: "Le 1er arrondissement, c'est le Louvre, la rue de Rivoli et les Halles : des rues souvent embouteillées, des parkings souterrains étroits et peu de places pour s'arrêter. En panne ici, on vous retrouve directement, même devant un site bondé de touristes.",
        faq4: { q: "Pouvez-vous intervenir devant le Louvre ou aux Halles ?", a: "Oui, même en plein afflux touristique. Nos dépanneurs connaissent les accès et les emplacements autorisés du secteur pour vous rejoindre sans perdre de temps." },
    },
    "paris-2": {
        texte: "Le 2e arrondissement, c'est le Sentier et la Bourse : des rues de bâti ancien, peu de parkings et un trafic de livraison permanent. Batterie morte rue Montorgueil ou panne près de la Bourse, nos dépanneurs savent se faufiler et travailler même en double file.",
        faq4: { q: "Les rues du Sentier sont si étroites, vous arrivez quand même ?", a: "Oui. Nos dépanneuses légères passent partout, et en cas de remorquage délicat, on organise la manœuvre avec vous par téléphone." },
    },
    "paris-3": {
        texte: "Le 3e, c'est le Marais : rues pavées, piétonnes le week-end, et des places rares comme des jours de soldes. Panne devant le Musée des Arts et Métiers ou batterie plate rue de Bretagne, on connaît les entrées de livraison et les accès autorisés pour vous sortir de là.",
        faq4: { q: "Vous intervenez dans les rues piétonnes du Marais ?", a: "Oui, aux heures autorisées et par les accès adaptés. Appelez-nous, on vous guide vers le point exact où passer sans contravention." },
    },
    "paris-4": {
        texte: "Le 4e, c'est l'Hôtel de Ville, le Marais sud et la place de la Bastille : beaucoup de touristes, beaucoup de vélos, et des quais de Seine fermés par moments. En panne ici, on connaît les itinéraires bis et les heures où la circulation redevient fluide.",
        faq4: { q: "Les quais de Seine sont fermés parfois, vous venez quand même ?", a: "Oui. Nos dépanneurs suivent les fermetures en temps réel et arrivent par les axes parallèles, sans retard inutile." },
    },
    "paris-5": {
        texte: "Le 5e, c'est le Quartier Latin : le Panthéon, les rues en pente de la Montagne Sainte-Geneviève, et des parkings exigus. Une voiture qui refuse de démarrer en côte, c'est le pire endroit — nos dépanneurs montent avec le bon matériel et repartent vite.",
        faq4: { q: "Les rues en pente du 5e posent-elles un problème ?", a: "Aucun souci : nos véhicules sont adaptés aux pentes et aux manœuvres serrées du Quartier Latin." },
    },
    "paris-6": {
        texte: "Le 6e, c'est Saint-Germain-des-Prés et le jardin du Luxembourg : des rues chics, étroites, souvent barrées. Batterie morte devant un café ou crevaison en sortant d'un parking discret, on connaît le secteur et ses horaires de livraison.",
        faq4: { q: "Vous connaissez les accès autour du jardin du Luxembourg ?", a: "Oui, y compris les horaires des voies ouvertes et les entrées de parking les plus proches de vous." },
    },
    "paris-7": {
        texte: "Le 7e, c'est la tour Eiffel et les Invalides : un flux touristique permanent, des embouteillages devant les sites, et des quais souvent bloqués. En panne ici, on sait par où arriver sans se faire piéger par le trafic.",
        faq4: { q: "Vous venez jusqu'à la tour Eiffel malgré le monde ?", a: "Oui, même en pleine saison. Nos dépanneurs connaissent les rues desservies et les emplacements réglementaires du secteur." },
    },
    "paris-8": {
        texte: "Le 8e, c'est les Champs-Élysées et la place de l'Étoile : l'un des carrefours les plus denses d'Europe. Une panne ici, c'est stressant — on vous retrouve vite, que vous soyez avenue Montaigne, rue du Faubourg-Saint-Honoré ou sur la place.",
        faq4: { q: "Intervenez-vous sur la place de l'Étoile ?", a: "Oui, c'est un secteur que nos équipes connaissent par cœur, rond-point et giratoires compris." },
    },
    "paris-9": {
        texte: "Le 9e, c'est l'Opéra et les grands magasins : livraisons, taxis, bus, et des parkings pleins dès le matin. Batterie morte au sous-sol d'un centre commercial ou panne devant la gare Saint-Lazare, on connaît les accès par niveau.",
        faq4: { q: "Vous intervenez dans les parkings de grands magasins ?", a: "Oui, précisez le niveau et la rangée au téléphone : nos dépanneurs montent directement à votre place." },
    },
    "paris-10": {
        texte: "Le 10e, c'est la gare du Nord et le canal Saint-Martin : des cars, des taxis, des vélos et des quais étroits. Batterie à plat après une nuit sur les quais ou panne en sortant d'une gare, on connaît les plans de circulation du secteur.",
        faq4: { q: "Vous venez jusqu'aux quais du canal Saint-Martin ?", a: "Oui, quai de Valmy comme quai de Jemmapes : on connaît les accès et les places où s'arrêter sans gêner." },
    },
    "paris-11": {
        texte: "Le 11e, c'est Bastille, Oberkampf et la Roquette : des rues vivantes tard le soir, des terrasses qui débordent et des places de parking rares. Batterie morte au petit matin après une soirée, on connaît le secteur et ses horaires.",
        faq4: { q: "Vous intervenez tard la nuit dans le 11e ?", a: "Oui, 24h/24 : les rues animées du secteur ne changent rien pour nos équipes de nuit." },
    },
    "paris-12": {
        texte: "Le 12e, c'est la gare de Lyon, Bercy et le bois de Vincennes : des échangeurs complexes, les quais de la Rapée et de longues allées d'arbres. Panne en sortant de Bercy ou batterie morte côté Daumesnil, on connaît les raccourcis.",
        faq4: { q: "Vous couvrez le bois de Vincennes côté Paris ?", a: "Oui, y compris les voies du bois et les abords du lac : appelez, on vous retrouve où que vous soyez." },
    },
    "paris-13": {
        texte: "Le 13e, c'est la BnF, le quartier asiatique et les tours de Tolbiac : de grandes avenues larges, mais des quais de gare et des parkings profonds. Batterie morte au sous-sol ou panne avenue de France, on connaît chaque accès.",
        faq4: { q: "Vous connaissez les parkings profonds du 13e ?", a: "Oui : donnez-nous le niveau et la place, nos dépanneurs arrivent directement à côté de vous." },
    },
    "paris-14": {
        texte: "Le 14e, c'est l'Observatoire, les Catacombes et la rue d'Alésia : des axes très fréquentés et des rues résidentielles en pente. Batterie faible après un mois de froid ou crevaison avenue du Général-Leclerc, on arrive vite.",
        faq4: { q: "Vous intervenez du côté d'Alésia et de Port-Royal ?", a: "Oui, tout le 14e est couvert, de la place Denfert-Rochereau à la porte d'Orléans." },
    },
    "paris-15": {
        texte: "Le 15e, c'est le plus grand arrondissement : Montparnasse, Vaugirard, les immenses parkings de Beaugrenelle. Batterie morte dans un sous-sol à trois étages ou panne sur les voies Georges-Pompidou, on connaît le terrain.",
        faq4: { q: "Vous venez jusqu'à Beaugrenelle et ses parkings ?", a: "Oui, y compris les sous-sols du centre commercial : précisez le niveau, on vous retrouve là où vous êtes." },
    },
    "paris-16": {
        texte: "Le 16e, c'est le Trocadéro, Passy et le bois de Boulogne : des rues feutrées, des bouchons du matin, et des voies rapides en bord de Seine. Panne sur l'allée des Cygnes ou batterie plate avenue Victor-Hugo, on connaît chaque entrée.",
        faq4: { q: "Vous intervenez dans le bois de Boulogne ?", a: "Oui, y compris sur les voies qui le traversent. Précisez le lieu-dit ou la porte la plus proche, on arrive direct." },
    },
    "paris-17": {
        texte: "Le 17e, c'est les Batignolles, Wagram et Ternes : des quartiers différents, un même niveau d'exigence. Batterie morte près du parc Monceau ou panne aux Ternes en heure de pointe, on connaît les itinéraires qui gagnent du temps.",
        faq4: { q: "Vous couvrez le quartier des Batignolles ?", a: "Oui, de la place de Clichy au parc Martin-Luther-King, nos dépanneurs connaissent chaque rue." },
    },
    "paris-18": {
        texte: "Le 18e, c'est Montmartre et le Sacré-Cœur : des ruelles en escalier, des buttes, et des rues en forte pente. La plupart des véhicules se remettent en marche sur place — et si c'est un remorquage, on connaît les accès bas du secteur.",
        faq4: { q: "Montmartre est en pente, vous arrivez quand même ?", a: "Oui. On vous retrouve au point le plus proche accessible, et la majorité des pannes se règlent sur place, sans remorquage." },
    },
    "paris-19": {
        texte: "Le 19e, c'est la Villette, les Buttes-Chaumont et les quais de la Marne : des parcs, des canaux et des voies rapides. Batterie morte au parking de la Cité des Sciences ou panne près du périphérique, on connaît les sorties.",
        faq4: { q: "Vous intervenez du côté de la Villette ?", a: "Oui, parc et alentours compris : appelez, donnez le portail le plus proche, on arrive." },
    },
    "paris-20": {
        texte: "Le 20e, c'est le Père-Lachaise, Belleville et Gambetta : des rues en pente, des parkings rares, et des rues vivantes. Batterie à plat en haut de Belleville ou crevaison rue de Bagnolet, on monte avec le bon matériel.",
        faq4: { q: "Les pentes de Belleville posent-elles un souci ?", a: "Aucun : nos dépanneurs interviennent régulièrement dans tout le 20e, pentes et rues étroites comprises." },
    },
    "boulogne-billancourt": {
        texte: "À Boulogne-Billancourt, on roule beaucoup : la Route de la Reine aux heures de pointe, les quais où l'on roule vite, et le bois de Boulogne à côté. Batterie morte au parking des Passages ou crevaison après un trottoir dégradé, on connaît la ville de fond en comble.",
        faq4: { q: "Vous intervenez près du Bois de Boulogne côté Boulogne ?", a: "Oui, toutes les rues limitrophes du bois et les accès du parc sont dans notre secteur immédiat." },
    },
    "saint-denis": {
        texte: "À Saint-Denis, les matchs au Stade de France bouchent tout le secteur : nos dépanneurs connaissent les plans de circulation des soirs de match et les sorties d'A1. Batterie morte près de la Basilique ou remorquage sur les quais du canal, c'est le quotidien.",
        faq4: { q: "Vous intervenez pendant les matchs du Stade de France ?", a: "Oui, même ces soirs-là : on adapte l'itinéraire et on vous retrouve, quel que soit le trafic autour du stade." },
    },
    "argenteuil": {
        texte: "À Argenteuil, la Seine coupe la ville et les ponts se bouchent vite : nos dépanneurs savent quand passer par le pont de Bezons ou celui d'Argenteuil. Batterie morte côté Val Notre-Dame ou crevaison après la D14, on arrive en 20 minutes.",
        faq4: { q: "Vous couvrez les deux côtés de la Seine à Argenteuil ?", a: "Oui, du côté d'Orgemont aux bords de Seine : un seul numéro pour toute la ville, jour et nuit." },
    },
    "asnieres-sur-seine": {
        texte: "À Asnières-sur-Seine, les rues sont étroites et les parkings rares : la plupart des interventions se font sur place en quelques minutes. Batterie morte près du marché ou panne avenue de la République, nos dépanneurs connaissent chaque accès.",
        faq4: { q: "Vous intervenez près du parc Bécon ?", a: "Oui, tout le quartier de Bécon-les-Bruyères et les bords de Seine sont couverts, 24h/24." },
    },
    "aulnay-sous-bois": {
        texte: "À Aulnay-sous-Bois, on roule entre la N2 et les grandes avenues : batterie morte au parking de la gare ou panne vers les Petits-Ponts, nos dépanneurs connaissent les raccourcis du secteur et les heures creuses.",
        faq4: { q: "Vous couvrez Aulnay-sous-Bois Nord comme Sud ?", a: "Oui, des Sablons à la Cité de l'Europe : toute la ville, 24h/24 et 7j/7." },
    },
    "bagnolet": {
        texte: "À Bagnolet, l'échangeur de l'A3 domine tout : le matin, le trafic s'étire sur la D38 et vers les Limites. En panne près du Mercadier ou batterie à plat rue de Noisy, nos dépanneurs connaissent les sorties et les petites rues qui sauvent.",
        faq4: { q: "Vous intervenez près de l'échangeur de l'A3 ?", a: "Oui, côté ville comme sur les accès de l'autoroute voisine : précisez votre position exacte au téléphone, on arrive." },
    },
    "cergy": {
        texte: "À Cergy, la ville nouvelle se parcourt par ses boulevards et ses grands parkings : batterie morte aux Trois-Fontaines ou panne vers le port, nos dépanneurs connaissent les accès, les niveaux de sous-sol et les sorties d'A15.",
        faq4: { q: "Vous intervenez dans toute la ville nouvelle de Cergy ?", a: "Oui, tous les quartiers de Cergy et les communes autour, 24h/24 et 7j/7." },
    },
    "champigny-sur-marne": {
        texte: "À Champigny-sur-Marne, la Marne borde la ville et l'A4 passe juste au-dessus : crevaison après un nid de poule des quais ou batterie morte au parking du RER, nos dépanneurs connaissent les ponts et les rues de berge.",
        faq4: { q: "Vous venez près des bords de Marne à Champigny ?", a: "Oui, du côté du village parisien comme vers les Moulins : on vous retrouve où que vous soyez." },
    },
    "colombes": {
        texte: "À Colombes, le stade Yves-du-Manoir ferme des rues les soirs de match et le trafic se reporte ailleurs : nos dépanneurs connaissent les itinéraires de remplacement. Batterie morte boulevard de Valmy ou panne rue Gabriel-Péri, on arrive vite.",
        faq4: { q: "Vous connaissez les restrictions autour du stade Yves-du-Manoir ?", a: "Oui, on adapte l'itinéraire les soirs de match et on vous retrouve sans détour inutile." },
    },
    "courbevoie": {
        texte: "À Courbevoie, La Défense est à deux pas : parkings profonds, quais de Seine et rues résidentielles étroites. Batterie morte au sous-sol des 4 Temps ou panne avenue de la Foulérie, nos dépanneurs connaissent les niveaux par cœur.",
        faq4: { q: "Vous intervenez dans les tours de La Défense côté Courbevoie ?", a: "Oui : donnez la tour, le niveau et la place de parking, nos dépanneurs montent directement." },
    },
    "creteil": {
        texte: "À Créteil, le lac et la préfecture dessinent la ville : l'A86 au sud, la D1 au nord, et de grands parkings. Batterie morte au marché du Crêté-de-Fontenay ou panne vers Créteil-Soleil, on connaît les accès par cœur.",
        faq4: { q: "Vous intervenez autour du lac de Créteil ?", a: "Oui, tout le quartier du lac et les résidences autour : appelez, on arrive en 20 minutes." },
    },
    "drancy": {
        texte: "À Drancy, la ville s'étire entre la N302 et les grands ensembles : batterie morte près de la gare de Drancy ou panne avenue Libération, nos dépanneurs connaissent les rues internes et les sorties d'A86 voisines.",
        faq4: { q: "Vous couvrez tout Drancy ?", a: "Oui, du quartier des Oiseaux à la gare de Drancy : 24h/24, 7j/7, un seul numéro." },
    },
    "issy-les-moulineaux": {
        texte: "À Issy-les-Moulineaux, l'île Saint-Germain et les grands parkings d'entreprises rythment la ville : batterie morte au sous-sol du Val de Seine ou panne vers le fort, on connaît les accès et les niveaux.",
        faq4: { q: "Vous intervenez près de l'île Saint-Germain ?", a: "Oui, l'île et les quais sont dans notre secteur immédiat : appelez, on arrive en 20 minutes." },
    },
    "levallois-perret": {
        texte: "À Levallois-Perret, les rues sont denses et les parkings rares : la plupart des pannes se règlent sur place. Batterie morte près de la place de la Liberté ou panne rue Anatole-France, nos dépanneurs connaissent les entrées de sous-sol par cœur.",
        faq4: { q: "Vous arrivez dans les petites rues de Levallois ?", a: "Oui : nos dépanneuses sont adaptées aux rues étroites, et on vous guide par téléphone si besoin." },
    },
    "montreuil": {
        texte: "À Montreuil, les Murs à Pêches et la Grande-Prairie respirent le calme, mais l'A3 et la D38 bouillonnent : batterie morte près de la Mairie de Montreuil ou panne vers Croix-de-Chavaux, on connaît le secteur et ses horaires.",
        faq4: { q: "Vous intervenez près des Murs à Pêches ?", a: "Oui, tout le secteur est couvert : les ruelles étroites ne nous font pas peur." },
    },
    "nanterre": {
        texte: "À Nanterre, l'université, La Défense voisine et l'A86 font tourner le trafic : batterie morte au parking du RER Nanterre-Université ou panne vers la Folie, nos dépanneurs connaissent les accès et les sorties.",
        faq4: { q: "Vous couvrez le secteur de l'université de Nanterre ?", a: "Oui, campus et quartiers autour : 24h/24, 7j/7, intervention en 20 minutes." },
    },
    "noisy-le-grand": {
        texte: "À Noisy-le-Grand, les Arènes de Picasso et le Mont d'Est structurent la ville : grands parkings, espaces piétons et l'A4 à côté. Batterie morte au sous-sol des Arènes ou panne vers Bry-sur-Marne, on connaît les niveaux et les sorties.",
        faq4: { q: "Vous intervenez au Mont d'Est et aux Arènes ?", a: "Oui, y compris dans les parkings profonds : donnez le niveau, nos dépanneurs arrivent à côté de vous." },
    },
    "rueil-malmaison": {
        texte: "À Rueil-Malmaison, le château attire les visiteurs et l'A86 passe au-dessus : batterie morte vers le centre ou panne côté Seine, nos dépanneurs connaissent les bouchons de la N13 et les ponts du secteur.",
        faq4: { q: "Vous intervenez près du château de Malmaison ?", a: "Oui, tout l'ouest de la ville et les routes vers la Seine sont couverts, jour et nuit." },
    },
    "saint-maur-des-fossés": {
        texte: "À Saint-Maur-des-Fossés, la Marne fait une boucle complète autour de la ville : les ponts se bouchent et les quais sont étroits. Batterie morte vers Adamville ou panne à La Varenne, on connaît les ponts et les raccourcis de la boucle.",
        faq4: { q: "Vous couvrez toute la boucle de Saint-Maur ?", a: "Oui, d'Adamville à La Varenne-Chennevières : les ponts et les quais ne nous font pas perdre de temps." },
    },
    "saint-mande": {
        texte: "À Saint-Mandé, tout est compact : le lac, l'hôtel de ville, et des rues très fréquentées aux heures de pointe. Batterie morte près de la porte de Vincennes ou panne avenue de la République, nos dépanneurs connaissent chaque place.",
        faq4: { q: "Vous intervenez vite malgré la densité de Saint-Mandé ?", a: "Oui : la ville est petite, nos dépanneurs proches arrivent en une poignée de minutes, même en heure de pointe." },
    },
    "versailles": {
        texte: "À Versailles, le château bouche tout : les soirs de spectacles et les week-ends, la ville change de rythme. Batterie morte au parking du marché Notre-Dame ou panne vers Saint-Quentin, nos dépanneurs connaissent les plans de circulation spéciaux.",
        faq4: { q: "Vous intervenez pendant les gros événements au château ?", a: "Oui : on suit les fermetures et les déviations, et on vous retrouve même les soirs de grands feux." },
    },
    "villemomble": {
        texte: "À Villemomble, la gare Villemomble-Le Raincy et les coteaux rythment la ville : batterie morte au parking de la gare ou panne vers Neuilly-Plaisance, nos dépanneurs connaissent les pentes et les raccourcis.",
        faq4: { q: "Vous intervenez près des bords de Marne à Villemomble ?", a: "Oui, du côté de Gournay comme vers Neuilly-Plaisance : on vous retrouve où que vous soyez." },
    },
    "vincennes": {
        texte: "À Vincennes, le château et le bois structurent tout : les rues autour du château se bouchent aux sorties d'écoles, et le bois attire les promeneurs du dimanche. Batterie morte près de la place de la Gare ou panne vers le lac des Minimes, on connaît chaque accès.",
        faq4: { q: "Vous intervenez jusqu'au lac des Minimes ?", a: "Oui, tout le bois côté Vincennes est couvert : précisez le chemin ou le parking, on arrive en 20 minutes." },
    },
    "vitry-sur-seine": {
        texte: "À Vitry-sur-Seine, les quais de Seine et l'A86 structurent la ville : batterie morte vers la porte de Choisy ou panne sur la D5, nos dépanneurs connaissent les accès du port et les rues internes des grands ensembles.",
        faq4: { q: "Vous couvrez les quais et le port de Vitry ?", a: "Oui, des Carrières aux quais : appelez, on vous retrouve où que vous soyez." },
    },
};