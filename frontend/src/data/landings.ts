/**
 * Pages d'arrivée des annonces Google Ads (ADFR).
 * Chaque page reprend mot pour mot les recherches de son groupe d'annonces : Google les juge plus
 * pertinentes (meilleur niveau de qualité = meilleure position pour un CPC plus bas).
 * Le pré-rendu lit les lignes `path: "..."` de ce fichier : garder ce format.
 */
import type { FaqItem } from "@/data/site";

export interface Landing {
    path: string;
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    h1: string;
    h1Accent: string;
    intro: string;
    points: string[];
    zonesTitle: string;
    zones: string[];
    faq: FaqItem[];
    lieu: string;
}

const PAY = "Le paiement se fait sur place, après l'intervention, par carte bancaire ou en espèces.";

export const LANDINGS: Landing[] = [
    {
        path: "/remorquage-voiture-paris",
        seoTitle: "Remorquage voiture Paris 24h/24 — dépanneuse en moins de 30 min | ADFR",
        seoDescription: "Remorquage voiture à Paris 24h/24 et 7j/7 : une dépanneuse sur place en moins de 30 minutes, remorquage vers le garage de votre choix. Paiement sur place.",
        eyebrow: "Remorquage voiture Paris · 24h/24",
        h1: "Remorquage voiture",
        h1Accent: "à Paris",
        intro: "Votre voiture ne démarre plus ou a eu un accident ? Une dépanneuse plateau arrive en moins de 30 minutes et remorque votre voiture vers le garage de votre choix, jour et nuit.",
        points: [
            "Remorquage vers le garage de votre choix ou votre domicile",
            "Tous les arrondissements de Paris, périphérique compris",
            "Voitures, utilitaires, motos et scooters",
            "Dépanneuse plateau : votre véhicule voyage sans risque",
        ],
        zonesTitle: "Remorquage dans tout Paris",
        zones: Array.from({ length: 20 }, (_, i) => `Paris ${i + 1}${i === 0 ? "er" : "e"}`),
        faq: [
            { q: "En combien de temps la dépanneuse arrive-t-elle à Paris ?", a: "En moyenne en moins de 30 minutes, selon votre arrondissement et la circulation. On vous donne l'heure d'arrivée dès l'appel." },
            { q: "Où remorquez-vous ma voiture ?", a: "Vers le garage de votre choix, votre concessionnaire ou votre domicile, à Paris ou en Île-de-France." },
            { q: "Remorquez-vous la nuit et le week-end ?", a: "Oui, 24h/24 et 7j/7, jours fériés inclus." },
            { q: "Comment se passe le paiement ?", a: PAY },
        ],
        lieu: "Paris",
    },
    {
        path: "/depannage-voiture-paris",
        seoTitle: "Dépannage voiture Paris 24h/24 — dépanneur en moins de 30 min | ADFR",
        seoDescription: "Dépannage voiture et dépanneuse à Paris 24h/24 : un dépanneur sur place en moins de 30 minutes. Batterie, crevaison, panne ou remorquage. Paiement sur place.",
        eyebrow: "Dépannage auto Paris · 24h/24",
        h1: "Dépannage voiture",
        h1Accent: "à Paris",
        intro: "Voiture en panne à Paris ? Un dépanneur arrive en moins de 30 minutes. Quand c'est possible on répare sur place, sinon on remorque votre voiture vers le garage de votre choix.",
        points: [
            "Dépanneuse sur place en moins de 30 minutes en moyenne",
            "Batterie, crevaison, panne de carburant, voiture qui ne démarre plus",
            "Remorquage si la réparation sur place n'est pas possible",
            "Jour et nuit, 7j/7, jours fériés inclus",
        ],
        zonesTitle: "Dépannage dans tout Paris",
        zones: Array.from({ length: 20 }, (_, i) => `Paris ${i + 1}${i === 0 ? "er" : "e"}`),
        faq: [
            { q: "Combien de temps pour avoir un dépanneur à Paris ?", a: "En moyenne moins de 30 minutes. On vous dit à l'appel quand le dépanneur arrive." },
            { q: "Pouvez-vous réparer sur place ?", a: "Oui dans la plupart des cas : batterie, crevaison, carburant. Sinon, on remorque votre voiture vers le garage de votre choix." },
            { q: "Intervenez-vous la nuit ?", a: "Oui, 24h/24 et 7j/7, jours fériés inclus." },
            { q: "Comment se passe le paiement ?", a: PAY },
        ],
        lieu: "Paris",
    },
    {
        path: "/depannage-voiture-banlieue",
        seoTitle: "Dépannage et remorquage voiture banlieue parisienne 24h/24 | ADFR",
        seoDescription: "Dépannage voiture, dépanneuse et remorquage en Seine-Saint-Denis (93), Val-de-Marne (94) et petite couronne, 24h/24. Sur place en moins de 30 minutes.",
        eyebrow: "Dépannage voiture banlieue · 93 · 94",
        h1: "Dépannage et remorquage voiture",
        h1Accent: "en banlieue parisienne",
        intro: "Basés à Villemomble (93), notre dépanneuse part tout de suite vers vous : un dépanneur sur place en moins de 30 minutes, dépannage sur place ou remorquage vers le garage de votre choix.",
        points: [
            "Dépanneuse basée en Seine-Saint-Denis, au plus près de vous",
            "Remorquage vers le garage de votre choix",
            "Batterie, crevaison, désembourbage, voiture qui ne démarre plus",
            "24h/24 et 7j/7, jours fériés inclus",
        ],
        zonesTitle: "Nos villes d'intervention",
        zones: ["Villemomble", "Montreuil", "Saint-Mandé", "Vincennes", "Bagnolet", "Rosny-sous-Bois", "Fontenay-sous-Bois", "Noisy-le-Sec", "Bondy", "Romainville", "Neuilly-Plaisance", "Le Raincy", "Gagny", "Bobigny", "Pantin", "Saint-Denis", "Aubervilliers", "Nogent-sur-Marne", "Le Perreux-sur-Marne", "Champigny-sur-Marne"],
        faq: [
            { q: "Intervenez-vous dans ma ville ?", a: "Nous intervenons dans toute la Seine-Saint-Denis (93), le Val-de-Marne (94) et la petite couronne. Appelez : on vous dit tout de suite quand on peut être là." },
            { q: "En combien de temps arrivez-vous ?", a: "En moyenne en moins de 30 minutes." },
            { q: "Où remorquez-vous ma voiture ?", a: "Vers le garage de votre choix, votre concessionnaire ou votre domicile." },
            { q: "Comment se passe le paiement ?", a: PAY },
        ],
        lieu: "",
    },
    {
        path: "/depanneuse-nuit",
        seoTitle: "Dépanneuse de nuit Paris et banlieue — dépannage voiture urgence | ADFR",
        seoDescription: "Panne de voiture la nuit ? Dépanneuse de nuit à Paris et en banlieue, sur place en moins de 30 minutes. Dépannage et remorquage en urgence, paiement sur place.",
        eyebrow: "Dépanneuse de nuit · urgence",
        h1: "Dépanneuse de nuit",
        h1Accent: "à Paris et en banlieue",
        intro: "En panne la nuit ? Pas besoin d'attendre le matin : un dépanneur part tout de suite et arrive en moins de 30 minutes. Dépannage sur place ou remorquage vers le garage de votre choix.",
        points: [
            "Dépannage voiture en urgence, toute la nuit",
            "Remorquage vers le garage de votre choix ou votre domicile",
            "Paris et banlieue : 93, 94 et petite couronne",
            "Restez en sécurité : on vous guide au téléphone en attendant",
        ],
        zonesTitle: "Dépannage de nuit",
        zones: ["Paris", "Seine-Saint-Denis (93)", "Val-de-Marne (94)", "Petite couronne"],
        faq: [
            { q: "Intervenez-vous vraiment en pleine nuit ?", a: "Oui, toute la nuit, 7j/7, jours fériés inclus. On décroche et un dépanneur part tout de suite." },
            { q: "En combien de temps arrivez-vous la nuit ?", a: "En moyenne en moins de 30 minutes." },
            { q: "Que faire en attendant la dépanneuse ?", a: "Allumez vos feux de détresse, mettez votre gilet, placez le triangle si c'est sans danger et attendez derrière la glissière ou sur le trottoir." },
            { q: "Comment se passe le paiement ?", a: PAY },
        ],
        lieu: "",
    },
];

export function getLanding(path: string): Landing | undefined {
    const clean = path.replace(/\/+$/, "") || "/";
    return LANDINGS.find((l) => l.path === clean);
}
