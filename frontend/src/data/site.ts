import { Truck, Wrench, BatteryCharging, CircleDot, Fuel, Siren, KeyRound, Tractor, type LucideIcon } from "lucide-react";
import { BRAND } from "@/data/brand";

export const SITE = {
    name: BRAND.name,
    fullName: BRAND.fullName,
    phoneDisplay: BRAND.phoneDisplay,
    phoneHref: BRAND.phoneHref,
    phoneIntl: BRAND.phoneIntl,
    whatsappNumber: BRAND.whatsappNumber,
    whatsappBase: "Bonjour 👋, j'ai besoin d'un dépannage et je souhaiterais obtenir une intervention.\n\nPouvez-vous me contacter pour que je vous explique le problème ?",
    domain: BRAND.domain,
    area: "Île-de-France",
    truck: BRAND.truck,
    logo: BRAND.logo,
    ogImage: BRAND.ogImage,
};

export function whatsappUrl(place?: string) {
    const msg = place ? `${SITE.whatsappBase} Je suis à ${place}.` : SITE.whatsappBase;
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export interface ServiceItem {
    icon: LucideIcon;
    title: string;
    desc: string;
    image?: { src: string; alt: string };
}

const SERVICES_ALL: ServiceItem[] = [
    {
        icon: Truck,
        title: "Remorquage",
        desc: "Votre véhicule est immobilisé ? Nous le remorquons vers le garage de votre choix, partout en Île-de-France, de jour comme de nuit.",
        image: BRAND.id === "adfr" ? { src: "/img/service-remorquage.webp", alt: "Chargement d'un véhicule sur plateau ADFR" } : undefined,
    },
    {
        icon: Wrench,
        title: "Dépannage sur place",
        desc: "La plupart des pannes se règlent sur place : démarrage, réparation rapide, vous repartez sans passer par le garage.",
        image: BRAND.id === "adfr" ? { src: "/img/service-depannage.webp", alt: "Dépanneur ADFR remplaçant une batterie sur place" } : undefined,
    },
    {
        icon: BatteryCharging,
        title: "Batterie",
        desc: "Batterie à plat ? Démarrage avec booster, test de charge et remplacement si besoin, directement chez vous.",
        image: BRAND.id === "adfr" ? { src: "/img/service-batterie.webp", alt: "Dépannage batterie voiture sur place ADFR" } : undefined,
    },
    {
        icon: CircleDot,
        title: "Crevaison",
        desc: "Roue de secours posée sur place ou remorquage rapide vers le pneumaticien le plus proche.",
        image: BRAND.id === "adfr" ? { src: "/img/service-crevaison.webp", alt: "Remorquage d'une voiture crevée sur dépanneuse plateau ADFR" } : undefined,
    },
    {
        icon: Fuel,
        title: "Panne de carburant",
        desc: "Essence ou diesel, on vous livre le carburant nécessaire pour rejoindre la pompe sans stress.",
    },
    {
        icon: Tractor,
        title: "Désembourbage",
        desc: "Véhicule enlisé dans la boue, le sable ou la neige ? Treuillage et sangles de traction pour vous sortir de là sans dégât.",
        image: BRAND.id === "adfr" ? { src: "/img/service-desembourbage.webp", alt: "Désembourbage d'un 4x4 enlisé par un dépanneur ADFR" } : undefined,
    },
    {
        icon: Siren,
        title: "Véhicule accidenté",
        desc: "Enlèvement et remorquage de votre véhicule accidenté, vers le garage de votre choix.",
    },
    {
        icon: KeyRound,
        title: "Sortie de fourrière",
        desc: "Votre voiture a été emmenée en fourrière ? On vous aide à la récupérer et à la remettre en état de circuler.",
    },
];

/** ADFR : 5 services (sans sortie de fourrière ni véhicule accidenté) ; SOS Dépannage garde les 7. */
export const SERVICES: ServiceItem[] = BRAND.id === "adfr" ? SERVICES_ALL.filter((s) => s.title !== "Sortie de fourrière" && s.title !== "Véhicule accidenté") : SERVICES_ALL;

export interface Review {
    name: string;
    city: string;
    stars: number;
    text: string;
}

const REVIEWS_ADFR: Review[] = [
    {
        name: "Karim B.",
        city: "Vitry-sur-Seine",
        stars: 5,
        text: "Crevaison à 23h en sortant du parking, pas de roue de secours. Dépanneur arrivé en moins de 30 minutes, remorquage jusqu'à mon garage. Rapide et efficace.",
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
        text: "Panne porte de Bagnolet en pleine heure de pointe. Prise en charge impeccable, voiture remorquée jusqu'au garage du début à la fin.",
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
        text: "Accident près du Stade de France, voiture non roulante. Remorquage le soir même, tout expliqué simplement.",
    },
    {
        name: "Nadia K.",
        city: "Nanterre",
        stars: 5,
        text: "Service 24/7 vérifié : appel à 3h du matin, voiture qui ne démarre plus devant chez moi à Nanterre, dépanneur là à 3h25. On n'est jamais mieux servi qu'en pleine nuit.",
    },
];

const REVIEWS_SOS: Review[] = [
    {
        name: "Yacine R.",
        city: "Rosny-sous-Bois",
        stars: 5,
        text: "Voiture morte sur le parking de Rosny 2 un samedi. J'ai appelé, la dépanneuse était là 18 minutes plus tard. Prix annoncé au téléphone, respecté sur place.",
    },
    {
        name: "Claire V.",
        city: "Vincennes",
        stars: 5,
        text: "Batterie à plat devant l'école à 8h30. Le dépanneur a redémarré la voiture en 10 minutes, j'ai pu déposer les enfants presque à l'heure. Merci !",
    },
    {
        name: "Thomas L.",
        city: "Nogent-sur-Marne",
        stars: 5,
        text: "Voiture qui cale en plein carrefour à Nogent en pleine heure de pointe, stress total. Ils m'ont guidé pour me mettre en sécurité et sont arrivés très vite. Remorquage jusqu'à mon garage.",
    },
    {
        name: "Fatou D.",
        city: "Bondy",
        stars: 4,
        text: "Crevaison sur la N3, pas de roue de secours. Remorquage rapide vers un pneumaticien ouvert. Un peu plus de 20 minutes d'attente mais très pro.",
    },
    {
        name: "Julien M.",
        city: "Montreuil",
        stars: 5,
        text: "Panne de carburant bête à 23h. Ils m'ont apporté de quoi rejoindre la station. Simple, rapide, pas de jugement.",
    },
    {
        name: "Sandrine P.",
        city: "Paris 12e",
        stars: 5,
        text: "Accrochage à Bercy, voiture non roulante. Enlèvement le soir même, tout expliqué calmement. Exactement ce qu'on attend d'un service d'urgence.",
    },
];

export const REVIEWS: Review[] = BRAND.id === "sos" ? REVIEWS_SOS : REVIEWS_ADFR;

export interface FaqItem {
    q: string;
    a: string;
}

const FAQ_HOME_SOS: FaqItem[] = [
    {
        q: "Combien coûte un dépannage ou un remorquage ?",
        a: "Chaque intervention est différente : le prix dépend du type de panne et de la distance. Vous ne payez qu'à la fin de l'intervention, sur place, par carte bancaire ou en espèces.",
    },
    {
        q: "Ma batterie est à plat : pouvez-vous redémarrer ma voiture sur place ?",
        a: "Oui. Nous intervenons avec un booster professionnel pour redémarrer votre véhicule sur place. Si la batterie est morte, nous pouvons la remplacer directement.",
    },
    {
        q: "Je suis en panne de carburant : pouvez-vous dépanner sur place ?",
        a: "Oui. Nous vous apportons le carburant qu'il faut (essence ou gazole) pour rejoindre la station la plus proche. Si le véhicule ne redémarre pas, nous prenons en charge son remorquage.",
    },
    {
        q: "En combien de temps arrivez-vous ?",
        a: "En moyenne, nos dépanneurs arrivent en 20 à 30 minutes partout en Île-de-France. Le délai exact vous est confirmé au téléphone selon votre position et le trafic.",
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

const FAQ_HOME_ADFR: FaqItem[] = [
    { q: "Combien coûte un dépannage ou un remorquage ?", a: "Le prix dépend de la distance et du type d'intervention. Il vous est annoncé au téléphone avant le départ, sans engagement." },
    { q: "Ma batterie est à plat : pouvez-vous redémarrer ma voiture sur place ?", a: "Oui, nous démarrons votre véhicule sur place et pouvons remplacer la batterie si nécessaire." },
    { q: "Je suis en panne de carburant : pouvez-vous dépanner sur place ?", a: "Oui, nous vous livrons du carburant sur place." },
    { q: "En combien de temps arrivez-vous ?", a: "En moins de 30 minutes en moyenne à Paris et en petite couronne, selon la circulation." },
    { q: "Quelles zones couvrez-vous ?", a: "Paris et toute l'Île-de-France : 75, 77, 78, 91, 92, 93, 94, 95." },
    { q: "Comment se passe le paiement ?", a: "Paiement sur place à la fin de l'intervention, par carte bancaire ou en espèces." },
    { q: "Que faire en cas d'accident ?", a: `Mettez-vous en sécurité derrière la glissière avec gilet et triangle, puis appelez-nous au ${SITE.phoneDisplay}. Nous enlevons le véhicule et le remorquons vers le garage de votre choix.` },
];

export const FAQ_HOME: FaqItem[] = BRAND.id === "adfr" ? FAQ_HOME_ADFR : FAQ_HOME_SOS;

export function faqZone(name: string): FaqItem[] {
    return [
        {
            q: `Intervenez-vous vraiment 24h/24 à ${name} ?`,
            a: `Oui. À ${name} comme partout en Île-de-France, un dépanneur ${BRAND.name} peut partir vous rejoindre de jour comme de nuit, le week-end et les jours fériés.`,
        },
        {
            q: `En combien de temps un dépanneur arrive-t-il à ${name} ?`,
            a: BRAND.id === "adfr" ? `En moins de 30 minutes en moyenne à ${name} et dans les communes voisines, selon la circulation.` : `En moyenne en 20 à 30 minutes à ${name} et dans les communes voisines. Le délai exact vous est confirmé au téléphone selon votre position et le trafic.`,
        },
        {
            q: `Puis-je payer sur place à ${name} ?`,
            a: `Oui. Le paiement se fait après l'intervention, sur place, par carte bancaire ou en espèces.`,
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
