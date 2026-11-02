export interface Zone {
    slug: string;
    type: "dept" | "city" | "paris";
    name: string;
    cp: string;
    dept: string;
    deptName: string;
    deptIn: string;
    lat: number;
    lng: number;
    intro: string;
    spots: string[];
    axes: string;
    neighbors: string[];
}

export const DEPARTMENTS: Zone[] = [
    {
        slug: "75", type: "dept", name: "Paris", cp: "75001 – 75020", dept: "75", deptName: "Paris", deptIn: "à Paris",
        lat: 48.8566, lng: 2.3522,
        intro: "De la Bastille au Trocadéro, du boulevard périphérique aux bois de Vincennes et de Boulogne : ADFR couvre tout Paris et ses 20 arrondissements, 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Le Louvre", "Le Périphérique", "Les Bois de Vincennes et de Boulogne"],
        axes: "le boulevard périphérique et les autoroutes d'entrée d'agglomération (A1, A3, A6, A13)",
        neighbors: ["92", "93", "94", "77", "78", "95"],
    },
    {
        slug: "77", type: "dept", name: "Seine-et-Marne", cp: "", dept: "77", deptName: "Seine-et-Marne", deptIn: "en Seine-et-Marne",
        lat: 48.5406, lng: 2.6594,
        intro: "De Marne-la-Vallée à Melun, le long de l'A4 et de la Francilienne : ADFR couvre la Seine-et-Marne 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Melun", "Meaux", "Chelles"],
        axes: "l'A4, l'A5 et la Francilienne N104",
        neighbors: ["94", "91", "78", "75"],
    },
    {
        slug: "78", type: "dept", name: "Yvelines", cp: "", dept: "78", deptName: "Yvelines", deptIn: "dans les Yvelines",
        lat: 48.8014, lng: 2.1301,
        intro: "De Versailles à Saint-Quentin-en-Yvelines, le long de l'A13 et de la N12 : ADFR couvre les Yvelines 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Versailles", "Saint-Quentin-en-Yvelines", "Poissy"],
        axes: "l'A13, l'A14 et la N12",
        neighbors: ["92", "91", "75"],
    },
    {
        slug: "91", type: "dept", name: "Essonne", cp: "", dept: "91", deptName: "Essonne", deptIn: "en Essonne",
        lat: 48.6333, lng: 2.4442,
        intro: "De Massy à Évry-Courcouronnes, le long de l'A6 et de l'A10 : ADFR couvre l'Essonne 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Évry-Courcouronnes", "Massy", "Palaiseau"],
        axes: "l'A6, l'A10 et la Francilienne N104",
        neighbors: ["94", "77", "78", "92"],
    },
    {
        slug: "92", type: "dept", name: "Hauts-de-Seine", cp: "", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8919, lng: 2.2045,
        intro: "De La Défense à Boulogne-Billancourt, le long de l'A14 et de l'A86 : ADFR couvre les Hauts-de-Seine 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["La Défense", "Nanterre", "Boulogne-Billancourt"],
        axes: "l'A14, l'A86 et les quais de Seine",
        neighbors: ["75", "78", "95"],
    },
    {
        slug: "93", type: "dept", name: "Seine-Saint-Denis", cp: "", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.9142, lng: 2.4386,
        intro: "De Saint-Denis à Montreuil, le long de l'A1, de l'A3 et de l'A86 : ADFR couvre la Seine-Saint-Denis 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Saint-Denis", "Bobigny", "Montreuil"],
        axes: "l'A1, l'A3 et l'A86",
        neighbors: ["75", "95", "77", "94"],
    },
    {
        slug: "94", type: "dept", name: "Val-de-Marne", cp: "", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.7769, lng: 2.4525,
        intro: "De Créteil à Vitry-sur-Seine, le long de l'A86 et de l'A4 : ADFR couvre le Val-de-Marne 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Créteil", "Vitry-sur-Seine", "Saint-Maur-des-Fossés"],
        axes: "l'A86 et l'A4",
        neighbors: ["75", "93", "77", "91"],
    },
    {
        slug: "95", type: "dept", name: "Val-d'Oise", cp: "", dept: "95", deptName: "Val-d'Oise", deptIn: "dans le Val-d'Oise",
        lat: 49.0369, lng: 2.0618,
        intro: "De Cergy à Sarcelles, le long de l'A15 et de la Francilienne : ADFR couvre le Val-d'Oise 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Cergy", "Argenteuil", "Sarcelles"],
        axes: "l'A15 et la Francilienne N104",
        neighbors: ["93", "92", "78"],
    },
];

export const CITIES: Zone[] = [
    {
        slug: "boulogne-billancourt", type: "city", name: "Boulogne-Billancourt", cp: "92100", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8352, lng: 2.2409,
        intro: "En panne à Boulogne-Billancourt, près de la Route de la Reine ou des quais de Seine ? Les dépanneurs ADFR arrivent en moyenne en 20 minutes, 24h/24 et 7j/7, dans toute la ville.",
        spots: ["La Route de la Reine", "Les quais de Seine", "Le Bois de Boulogne"],
        axes: "la N118 et les quais de Seine",
        neighbors: ["issy-les-moulineaux", "rueil-malmaison", "92", "paris-16"],
    },
    {
        slug: "saint-denis", type: "city", name: "Saint-Denis", cp: "93200", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.9362, lng: 2.3574,
        intro: "Que vous soyez du côté du Stade de France ou de la Basilique, ADFR intervient à Saint-Denis jour et nuit, en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["Le Stade de France", "La Basilique de Saint-Denis", "Les quais du canal Saint-Denis"],
        axes: "l'A1 et l'A86",
        neighbors: ["93", "montreuil", "drancy", "95"],
    },
    {
        slug: "argenteuil", type: "city", name: "Argenteuil", cp: "95100", dept: "95", deptName: "Val-d'Oise", deptIn: "dans le Val-d'Oise",
        lat: 48.9478, lng: 2.2476,
        intro: "Batterie morte ou crevaison à Argenteuil, vers le Val d'Argenteuil ou les quais ? ADFR arrive en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["Le centre-ville", "Le Val d'Argenteuil", "Les quais de Seine"],
        axes: "l'A15",
        neighbors: ["95", "colombes", "92"],
    },
    {
        slug: "montreuil", type: "city", name: "Montreuil", cp: "93100", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8638, lng: 2.4432,
        intro: "De la Croix-de-Chavaux aux Murs à Pêches, nos dépanneurs sillonnent Montreuil jour et nuit, avec une intervention moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["La Croix-de-Chavaux", "Les Murs à Pêches", "La route de Vincennes"],
        axes: "l'A3 et les grands axes vers Paris",
        neighbors: ["93", "bagnolet", "rosny-sous-bois", "noisy-le-sec", "fontenay-sous-bois", "paris-20"],
    },
    {
        slug: "nanterre", type: "city", name: "Nanterre", cp: "92000", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8919, lng: 2.2045,
        intro: "À Nanterre, autour de La Défense ou du parc André Malraux, ADFR intervient 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["La Défense", "L'hôtel de ville", "Le parc André Malraux"],
        axes: "l'A14 et l'A86",
        neighbors: ["92", "courbevoie", "rueil-malmaison", "78"],
    },
    {
        slug: "vitry-sur-seine", type: "city", name: "Vitry-sur-Seine", cp: "94400", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.7875, lng: 2.3928,
        intro: "En panne à Vitry-sur-Seine, sur les quais ou au centre-ville ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["Le centre-ville", "Les quais de Seine", "L'hôtel de ville"],
        axes: "l'A86",
        neighbors: ["94", "91", "creteil", "75"],
    },
    {
        slug: "creteil", type: "city", name: "Créteil", cp: "94000", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.7769, lng: 2.4525,
        intro: "Autour du lac de Créteil ou de Créteil-Soleil, ADFR assure le dépannage et le remorquage 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Le lac de Créteil", "Créteil-Soleil", "La préfecture du Val-de-Marne"],
        axes: "l'A86 et la jonction de l'A4",
        neighbors: ["94", "vitry-sur-seine", "77", "93"],
    },
    {
        slug: "vincennes", type: "city", name: "Vincennes", cp: "94300", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.8386, lng: 2.4932,
        intro: "En panne à Vincennes, près du château ou de la place de la Gare ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["Le château de Vincennes", "La place de la Gare", "Le bois de Vincennes"],
        axes: "l'A4 voisine et la D5 (route de Vincennes)",
        neighbors: ["94", "saint-mande", "fontenay-sous-bois", "nogent-sur-marne", "montreuil", "paris-12"],
    },
    {
        slug: "saint-mande", type: "city", name: "Saint-Mandé", cp: "94300", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.8416, lng: 2.4194,
        intro: "En panne à Saint-Mandé, près de l'hôtel de ville ou du lac ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["L'hôtel de ville", "Le lac de Saint-Mandé", "La rue de Paris"],
        axes: "les portes de Paris et l'A4 voisine",
        neighbors: ["94", "vincennes", "fontenay-sous-bois", "montreuil", "paris-12", "paris-20"],
    },
    {
        slug: "villemomble", type: "city", name: "Villemomble", cp: "93250", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8792, lng: 2.5039,
        intro: "En panne à Villemomble, du Raincy aux bords de Marne ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["La gare de Villemomble-Le Raincy", "Les bords de Marne", "Le centre-ville"],
        axes: "la D3 et la Marne",
        neighbors: ["93", "rosny-sous-bois", "le-raincy", "gagny", "neuilly-sur-marne"],
    },
    {
        slug: "fontenay-sous-bois", type: "city", name: "Fontenay-sous-Bois", cp: "94120", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.8511, lng: 2.4762,
        intro: "En panne à Fontenay-sous-Bois, à Val de Fontenay ou en lisière du bois de Vincennes ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["Val de Fontenay", "Le Plateau et le centre-ville", "La lisière du bois de Vincennes"],
        axes: "l'A86 et l'échangeur de Val de Fontenay",
        neighbors: ["94", "vincennes", "montreuil", "nogent-sur-marne", "rosny-sous-bois"],
    },
    {
        slug: "rosny-sous-bois", type: "city", name: "Rosny-sous-Bois", cp: "93110", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8736, lng: 2.4846,
        intro: "Batterie morte au parking de Rosny 2 ou panne à l'échangeur A86/A3 ? ADFR dépanne Rosny-sous-Bois 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["Le centre commercial Rosny 2", "La gare Rosny-Bois-Perrier", "Le plateau d'Avron"],
        axes: "l'A86, l'A3 et l'A103 (échangeur de Rosny)",
        neighbors: ["93", "villemomble", "montreuil", "fontenay-sous-bois", "noisy-le-sec"],
    },
    {
        slug: "gagny", type: "city", name: "Gagny", cp: "93220", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8833, lng: 2.5333,
        intro: "En panne à Gagny, près de la gare, au Chénay ou vers les Abbesses ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["La gare de Gagny", "Le quartier du Chénay", "Le parc Courbet et les Abbesses"],
        axes: "la D370, la D302 et l'A103 toute proche",
        neighbors: ["93", "villemomble", "le-raincy", "neuilly-sur-marne", "77"],
    },
    {
        slug: "bondy", type: "city", name: "Bondy", cp: "93140", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.9022, lng: 2.4828,
        intro: "Panne sur la N3 ou à l'échangeur de Bondy, batterie à plat près de la gare ? ADFR intervient à Bondy 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["La gare de Bondy", "Le canal de l'Ourcq", "L'hôtel de ville et le centre"],
        axes: "l'A3, l'A86 (échangeur de Bondy) et la N3",
        neighbors: ["93", "noisy-le-sec", "le-raincy", "villemomble", "drancy"],
    },
    {
        slug: "noisy-le-sec", type: "city", name: "Noisy-le-Sec", cp: "93130", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8914, lng: 2.4597,
        intro: "En panne à Noisy-le-Sec, vers la gare, le Londeau ou le canal de l'Ourcq ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, 24h/24 et 7j/7.",
        spots: ["La gare de Noisy-le-Sec", "Le canal de l'Ourcq", "Le quartier du Londeau"],
        axes: "l'A3, l'A86 et la N3",
        neighbors: ["93", "bondy", "rosny-sous-bois", "montreuil", "bagnolet"],
    },
    {
        slug: "le-raincy", type: "city", name: "Le Raincy", cp: "93340", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8972, lng: 2.5156,
        intro: "En panne au Raincy, près de la gare ou sur l'allée du Raincy ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["La gare du Raincy-Villemomble-Montfermeil", "L'église Notre-Dame du Raincy", "Le rond-point Thiers"],
        axes: "la D117, la N3 et l'A103 voisines",
        neighbors: ["93", "villemomble", "gagny", "bondy"],
    },
    {
        slug: "nogent-sur-marne", type: "city", name: "Nogent-sur-Marne", cp: "94130", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.8372, lng: 2.4828,
        intro: "Panne sur l'A4 au pont de Nogent, batterie morte sur les bords de Marne ? ADFR dépanne Nogent-sur-Marne 24h/24 et 7j/7, avec une intervention moyenne en 20 minutes.",
        spots: ["La gare Nogent-Le Perreux", "Les bords de Marne et le pavillon Baltard", "Le port de plaisance"],
        axes: "l'A4, l'A86 et le pont de Nogent",
        neighbors: ["94", "fontenay-sous-bois", "vincennes", "champigny-sur-marne", "saint-maur-des-fosses"],
    },
    {
        slug: "neuilly-sur-marne", type: "city", name: "Neuilly-sur-Marne", cp: "93330", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8536, lng: 2.5319,
        intro: "En panne à Neuilly-sur-Marne, sur la N34 ou vers Maison-Blanche ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["L'avenue de Paris (N34)", "Les bords de Marne", "Le quartier de Maison-Blanche"],
        axes: "la N34 et l'A4 toute proche",
        neighbors: ["93", "gagny", "villemomble", "noisy-le-grand", "77"],
    },
    {
        slug: "bagnolet", type: "city", name: "Bagnolet", cp: "93160", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8584, lng: 2.4201,
        intro: "En panne à Bagnolet, vers les Limites ou le Mercadier ? Un dépanneur ADFR arrive en moyenne en 20 minutes, jour et nuit, week-ends et jours fériés.",
        spots: ["L'hôtel de ville", "Le quartier des Limites", "Le Mercadier"],
        axes: "l'A3 et le boulevard périphérique voisin",
        neighbors: ["93", "montreuil", "paris-20"],
    },
    {
        slug: "asnieres-sur-seine", type: "city", name: "Asnières-sur-Seine", cp: "92600", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.9117, lng: 2.2878,
        intro: "Du pont d'Asnières aux quais de Seine, nos dépanneurs interviennent à Asnières-sur-Seine 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["Le pont d'Asnières", "Les quais de Seine", "Le centre-ville"],
        axes: "les quais de Seine et l'A86 voisine",
        neighbors: ["92", "colombes", "courbevoie", "75"],
    },
    {
        slug: "versailles", type: "city", name: "Versailles", cp: "78000", dept: "78", deptName: "Yvelines", deptIn: "dans les Yvelines",
        lat: 48.8014, lng: 2.1301,
        intro: "À Versailles, du château à la gare des Chantiers, ADFR intervient jour et nuit, en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["Le château de Versailles", "La gare Versailles-Chantiers", "Le centre-ville"],
        axes: "l'A86 et la N12",
        neighbors: ["78", "92", "91"],
    },
    {
        slug: "courbevoie", type: "city", name: "Courbevoie", cp: "92400", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8975, lng: 2.2439,
        intro: "À Courbevoie, de La Défense au pont de Courbevoie, un dépanneur ADFR arrive en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["La Défense", "Le pont de Courbevoie", "L'hôtel de ville"],
        axes: "l'A14 et l'A86",
        neighbors: ["92", "nanterre", "asnieres-sur-seine", "75"],
    },
    {
        slug: "colombes", type: "city", name: "Colombes", cp: "92700", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.9244, lng: 2.2539,
        intro: "En panne à Colombes, près du stade Yves-du-Manoir ou au centre-ville ? ADFR intervient 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["Le stade Yves-du-Manoir", "Le centre-ville", "L'hôtel de ville"],
        axes: "l'A86",
        neighbors: ["92", "asnieres-sur-seine", "argenteuil", "95"],
    },
    {
        slug: "rueil-malmaison", type: "city", name: "Rueil-Malmaison", cp: "92500", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8762, lng: 2.2136,
        intro: "Du château de Malmaison aux quais de Seine, ADFR dépanne Rueil-Malmaison jour et nuit, en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["Le château de Malmaison", "Les quais de Seine", "Le centre-ville"],
        axes: "l'A86 et les quais",
        neighbors: ["92", "nanterre", "boulogne-billancourt", "78"],
    },
    {
        slug: "aulnay-sous-bois", type: "city", name: "Aulnay-sous-Bois", cp: "93600", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.9331, lng: 2.5008,
        intro: "À Aulnay-sous-Bois, près de la gare ou du parc du Sausset, un dépanneur ADFR arrive en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["La gare d'Aulnay-sous-Bois", "Le parc du Sausset", "Le centre-ville"],
        axes: "l'A1 et l'A3 tout proches",
        neighbors: ["93", "drancy", "77", "95"],
    },
    {
        slug: "champigny-sur-marne", type: "city", name: "Champigny-sur-Marne", cp: "94500", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.8172, lng: 2.4922,
        intro: "Sur les bords de Marne ou au centre-ville de Champigny, ADFR intervient 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["Les bords de Marne", "Le centre-ville", "Le pont de Champigny"],
        axes: "les quais de Marne et les grands axes vers Paris",
        neighbors: ["94", "saint-maur-des-fosses", "77", "93"],
    },
    {
        slug: "saint-maur-des-fosses", type: "city", name: "Saint-Maur-des-Fossés", cp: "94100", dept: "94", deptName: "Val-de-Marne", deptIn: "dans le Val-de-Marne",
        lat: 48.8386, lng: 2.4994,
        intro: "À Saint-Maur-des-Fossés, d'Adamville aux bords de Marne, nos dépanneurs arrivent en moyenne en 20 minutes, jour et nuit, 24h/24 et 7j/7.",
        spots: ["Les bords de Marne", "Le quartier d'Adamville", "Le centre-ville"],
        axes: "les grands axes de la boucle de Marne",
        neighbors: ["94", "champigny-sur-marne", "creteil", "77"],
    },
    {
        slug: "drancy", type: "city", name: "Drancy", cp: "93700", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.9152, lng: 2.4489,
        intro: "En panne à Drancy, vers la gare ou la Muette ? ADFR intervient 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["La gare de Drancy", "Le quartier de la Muette", "L'hôtel de ville"],
        axes: "les grands axes vers l'A3 et l'A86",
        neighbors: ["93", "aulnay-sous-bois", "saint-denis"],
    },
    {
        slug: "issy-les-moulineaux", type: "city", name: "Issy-les-Moulineaux", cp: "92130", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8242, lng: 2.2688,
        intro: "À Issy-les-Moulineaux, sur les quais ou vers la porte de Versailles, un dépanneur ADFR arrive en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["Les quais de Seine", "Le Val de Seine", "L'hôtel de ville"],
        axes: "les quais de Seine et le périphérique voisin",
        neighbors: ["92", "boulogne-billancourt", "paris-15", "75"],
    },
    {
        slug: "levallois-perret", type: "city", name: "Levallois-Perret", cp: "92300", dept: "92", deptName: "Hauts-de-Seine", deptIn: "dans les Hauts-de-Seine",
        lat: 48.8942, lng: 2.2880,
        intro: "À Levallois-Perret, de la place de la Libération à l'île de la Jatte, ADFR intervient jour et nuit, en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["La place de la Libération", "Le métro Anatole France", "L'île de la Jatte"],
        axes: "le périphérique et les quais",
        neighbors: ["92", "courbevoie", "paris-17", "75"],
    },
    {
        slug: "noisy-le-grand", type: "city", name: "Noisy-le-Grand", cp: "93160", dept: "93", deptName: "Seine-Saint-Denis", deptIn: "en Seine-Saint-Denis",
        lat: 48.8397, lng: 2.5556,
        intro: "À Noisy-le-Grand, du Mont d'Est aux Arènes, nos dépanneurs arrivent en moyenne en 20 minutes, 24h/24 et 7j/7.",
        spots: ["Le quartier du Mont d'Est", "La gare RER A", "Les Arènes"],
        axes: "l'A4",
        neighbors: ["93", "77", "94"],
    },
    {
        slug: "cergy", type: "city", name: "Cergy", cp: "95000", dept: "95", deptName: "Val-d'Oise", deptIn: "dans le Val-d'Oise",
        lat: 49.0369, lng: 2.0618,
        intro: "À Cergy, du port à Cergy-Préfecture, ADFR assure dépannage et remorquage 24h/24 et 7j/7, en moyenne en 20 minutes.",
        spots: ["Le port de Cergy", "Cergy-Préfecture", "La base régionale de loisirs"],
        axes: "l'A15",
        neighbors: ["95", "78", "argenteuil"],
    },
];

const PARIS_SPOTS: string[][] = [
    ["Le Louvre", "Palais-Royal", "Rue de Rivoli"],
    ["La Bourse", "Le Sentier", "Grands Boulevards"],
    ["Le Marais", "Haut-Marais", "Musée Picasso"],
    ["Hôtel de Ville", "Le Marais", "Place des Vosges"],
    ["Le Panthéon", "Quartier latin", "Montagne Sainte-Geneviève"],
    ["Saint-Germain-des-Prés", "Jardin du Luxembourg", "Odéon"],
    ["Tour Eiffel", "Invalides", "Musée d'Orsay"],
    ["Champs-Élysées", "Arc de Triomphe", "Place de la Concorde"],
    ["Opéra Garnier", "Grands Boulevards", "Havre-Caumartin"],
    ["Gare du Nord", "Gare de l'Est", "Canal Saint-Martin"],
    ["Bastille", "Oberkampf", "République"],
    ["Gare de Lyon", "Bercy", "Bois de Vincennes"],
    ["Place d'Italie", "BnF", "Tolbiac"],
    ["Gare Montparnasse", "Catacombes", "Observatoire"],
    ["Beaugrenelle", "Vaugirard", "Gare Montparnasse"],
    ["Trocadéro", "Bois de Boulogne", "Porte Maillot"],
    ["Batignolles", "Palais des Congrès", "Place de Clichy"],
    ["Montmartre", "Sacré-Cœur", "Barbès"],
    ["Buttes-Chaumont", "La Villette", "Bassin de l'Ourcq"],
    ["Père-Lachaise", "Belleville", "Gambetta"],
];

const ORDINAL = (n: number) => (n === 1 ? "1er" : `${n}e`);

export const PARIS_ARR: Zone[] = PARIS_SPOTS.map((spots, i) => {
    const n = i + 1;
    const name = `Paris ${ORDINAL(n)}`;
    const neighbors = [
        n > 1 ? `paris-${n - 1}` : null,
        n < 20 ? `paris-${n + 1}` : null,
        "75",
    ].filter(Boolean) as string[];
    return {
        slug: `paris-${n}`,
        type: "paris" as const,
        name,
        cp: `750${String(n).padStart(2, "0")}`,
        dept: "75",
        deptName: "Paris",
        deptIn: "à Paris",
        lat: 48.8566,
        lng: 2.3522,
        intro: `Panne, batterie morte ou crevaison dans le ${ORDINAL(n)} arrondissement, autour de ${spots[0]} ? Les dépanneurs ADFR arrivent en moyenne en 20 minutes, 24h/24 et 7j/7.`,
        spots,
        axes: "le boulevard périphérique et les grands axes",
        neighbors,
    };
});

export const ALL_ZONES: Zone[] = [...DEPARTMENTS, ...CITIES, ...PARIS_ARR];

export function getZone(slug: string): Zone | undefined {
    return ALL_ZONES.find((z) => z.slug === slug);
}

export function zoneUrl(z: Zone): string {
    return `/depannage-${z.slug}`;
}

export function citiesOfDept(num: string): Zone[] {
    return [...PARIS_ARR, ...CITIES].filter((z) => z.dept === num);
}

export function deptOf(num: string): Zone | undefined {
    return DEPARTMENTS.find((d) => d.dept === num);
}
