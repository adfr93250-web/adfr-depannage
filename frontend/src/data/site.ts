import { Truck, Wrench, BatteryCharging, CircleDot, Fuel, Siren, KeyRound, type LucideIcon } from "lucide-react";

export const SITE = {
    name: "ADFR",
    fullName: "ADFR — Auto Dépann France Remorquage",
    phoneDisplay: "01 85 80 00 61",
    phoneHref: "tel:+33185800061",
    phoneIntl: "+33185800061",
    whatsappNumber: "33652664749",
    whatsappBase: "Bonjour ADFR, j'ai besoin d'un dépannage.",
    domain: "https://adfr-depann.fr",
    area: "Île-de-France",
    truck: "/img/depanneuse.webp",
    logo: "/img/logo-adfr.png",
    ogImage: "/img/og-cover.jpg",
};

export function whatsappUrl(place?: string) {
    const msg = place ? `${SITE.whatsappBase} Je suis à ${place}.` : SITE.whatsappBase;
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export interface ServiceItem {
    icon: LucideIcon;
    title: string;
    desc: string;
}

export const SERVICES: ServiceItem[] = [
    {
        icon: Truck,
        title: "Remorquage",
        desc: "Votre véhicule est immobilisé ? Nous le remorquons vers le garage de votre choix, partout en Île-de-France, de jour comme de nuit.",
    },
    {
        icon: Wrench,
        title: "Dépannage sur place",
        desc: "La plupart des pannes se règlent sur place : démarrage, réparation rapide, vous repartez sans passer par le garage.",
    },
    {
        icon: BatteryCharging,
        title: "Batterie",
        desc: "Batterie à plat ? Démarrage avec booster, test de charge et remplacement si besoin, directement chez vous.",
    },
    {
        icon: CircleDot,
        title: "Crevaison",
        desc: "Roue de secours posée sur place ou remorquage rapide vers le pneumaticien le plus proche.",
    },
    {
        icon: Fuel,
        title: "Panne de carburant",
        desc: "Essence ou diesel, on vous livre le carburant nécessaire pour rejoindre la pompe sans stress.",
    },
    {
        icon: Siren,
        title: "Véhicule accidenté",
        desc: "Enlèvement et remorquage de votre véhicule accidenté, avec les documents pour votre dossier assurance.",
    },
    {
        icon: KeyRound,
        title: "Sortie de fourrière",
        desc: "Votre voiture a été emmenée en fourrière ? On vous aide à la récupérer et à la remettre en état de circuler.",
    },
];

export interface Review {
    name: string;
    city: string;
    stars: number;
    text: string;
}

export const REVIEWS: Review[] = [
    {
        name: "Karim B.",
        city: "Vitry-sur-Seine",
        stars: 5,
        text: "Crevaison sur l'A86 à 23h. Dépanneur arrivé en 20 minutes, remorquage jusqu'à mon garage. Le prix annoncé au téléphone, respecté à l'euro près.",
    },
    {
        name: "Sophie M.",
        city: "Boulogne-Billancourt",
        stars: 5,
        text: "Batterie morte un lundi matin. Appel à 7h15, voiture démarrée à 7h40 pendant que je prenais mon café. Rapide, souriant, sérieux.",
    },
    {
        name: "Jean-Luc D.",
        city: "Paris 12e",
        stars: 5,
        text: "Panne sur le périphérique en pleine heure de pointe. Prise en charge impeccable, voiture remorquée jusqu'au garage et dossier transmis à mon assurance.",
    },
    {
        name: "Amina T.",
        city: "Créteil",
        stars: 4,
        text: "Panne de carburant sur la route du travail. Carburant livré sur place en 25 minutes. J'ai pu rejoindre la station sans problème. Un peu d'attente au téléphone, mais un service solide.",
    },
    {
        name: "Marc P.",
        city: "Saint-Denis",
        stars: 5,
        text: "Accident près du Stade de France, voiture non roulante. Remorquage le soir même, tout expliqué simplement, attestation fournie pour l'assurance.",
    },
    {
        name: "Nadia K.",
        city: "Nanterre",
        stars: 5,
        text: "Service 24/7 vérifié : appel à 3h du matin après une panne sur l'A14, dépanneur là à 3h20. On n'est jamais mieux servi qu'en pleine nuit.",
    },
];

export interface FaqItem {
    q: string;
    a: string;
}

export const FAQ_HOME: FaqItem[] = [
    {
        q: "Combien coûte un dépannage ou un remorquage ?",
        a: "Chaque intervention est différente : le prix dépend du type de panne et de la distance. On vous annonce un tarif précis et gratuit au téléphone avant tout départ, sans surprise. Vous ne payez qu'à la fin de l'intervention, sur place.",
    },
    {
        q: "En combien de temps arrivez-vous ?",
        a: "En moyenne, nos dépanneurs arrivent en 20 à 30 minutes partout en Île-de-France. Le délai exact vous est confirmé au téléphone selon votre position et le trafic.",
    },
    {
        q: "Travaillez-vous avec les assurances ?",
        a: "Oui, on travaille avec toutes les assurances. On voit ça sur place, au moment du dépannage.",
    },
    {
        q: "Quelles zones couvrez-vous ?",
        a: "Toute l'Île-de-France : Paris, Seine-et-Marne, Yvelines, Essonne, Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne et Val-d'Oise. Jour et nuit, week-ends et jours fériés.",
    },
    {
        q: "Comment se passe le paiement ?",
        a: "Le paiement se fait sur place, après l'intervention, par carte bancaire ou en espèces. Aucun paiement à distance, aucune avance.",
    },
    {
        q: "Que faire en cas d'accident ?",
        a: "Mettez-vous en sécurité (gilet, triangle) puis appelez-nous. Nous prenons en charge le véhicule accidenté et son remorquage vers le garage de votre choix. Appelez-nous d'abord : on vous explique ce qui peut être fait.",
    },
];

export function faqZone(name: string): FaqItem[] {
    return [
        {
            q: `Intervenez-vous vraiment 24h/24 à ${name} ?`,
            a: `Oui. À ${name} comme partout en Île-de-France, un dépanneur ADFR peut partir vous rejoindre de jour comme de nuit, le week-end et les jours fériés.`,
        },
        {
            q: `En combien de temps un dépanneur arrive-t-il à ${name} ?`,
            a: `En moyenne en 20 à 30 minutes à ${name} et dans les communes voisines. Le délai exact vous est confirmé au téléphone selon votre position et le trafic.`,
        },
        {
            q: `Puis-je payer sur place à ${name} ?`,
            a: `Oui. Le paiement se fait après l'intervention, sur place, par carte bancaire ou en espèces. Le prix vous est annoncé avant le départ du dépanneur.`,
        },
        {
            q: `Pouvez-vous passer par mon assurance à ${name} ?`,
            a: `Oui, on travaille avec toutes les assurances. À ${name}, on voit ça sur place, au moment du dépannage.`,
        },
    ];
}

export function interventions(name: string): string[] {
    return [
        `Batterie à plat le matin, devant chez vous ou sur votre parking à ${name}`,
        "Crevaison sur un axe rapide ou au bord de la route",
        "Panne de carburant loin d'une station-service",
        "Voiture en panne dans un parking souterrain ou dans un trafic dense",
        "Véhicule accidenté à évacuer vers un garage",
        "Voiture immobilisée par une panne mécanique ou électrique",
    ];
}
