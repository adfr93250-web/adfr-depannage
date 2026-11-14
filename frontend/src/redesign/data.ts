/**
 * Données du nouveau design ADFR. Les textes viennent de @/data/site et @/data/brand (source unique,
 * aussi utilisée par le référencement) ; ce fichier n'ajoute que la mise en forme propre au design.
 */
import { BRAND, brandText } from "@/data/brand";
import { SITE as BASE, SERVICES as BASE_SERVICES, REVIEWS as BASE_REVIEWS, GOOGLE_REVIEWS_URL } from "@/data/site";

export { whatsappUrl, FAQ_HOME, faqZone, interventions } from "@/data/site";
export type { FaqItem } from "@/data/site";
export { brandText };

export const SITE = {
    ...BASE,
    legalLine: BRAND.legalLine,
    whatsappDisplay: "+33 6 52 66 47 49",
    heroLines: BRAND.heroLines,
    heroText: BRAND.heroText,
    delay: BRAND.delay,
    hours: BRAND.hours,
    googleReviewsUrl: GOOGLE_REVIEWS_URL ?? "https://maps.app.goo.gl/CWL43ZqWWHRJwpJ99",
};

/** Cadrage de certaines photos dans les cartes */
const POS: Record<string, string> = { Batterie: "50% 60%" };
export const SERVICES = BASE_SERVICES.filter((s) => s.image).map((s) => ({ ...s, image: s.image!, pos: POS[s.title] as string | undefined }));
export type ServiceItem = (typeof SERVICES)[number];

export const REVIEWS = BASE_REVIEWS.filter((r) => r.photo).map((r) => ({ ...r, meta: r.city, photo: r.photo! }));

export const TRUST_ITEMS = [BRAND.hours.long, `Intervention ${BRAND.delay.long}`, "Dépannage sur place ou remorquage", "Paiement sur place", "Toute l'Île-de-France", "Jours fériés inclus"];

export const PROCESS_STEPS = [
    { num: "01", title: "Vous appelez", desc: "Un coup de fil ou un message WhatsApp : dites-nous où vous êtes et ce qui s'est passé. On vous dit tout de suite quand un dépanneur peut partir." },
    { num: "02", title: "Le dépanneur part", desc: "Le dépanneur le plus proche de votre position part immédiatement, jour et nuit, 7j/7, jours fériés inclus." },
    { num: "03", title: "Prise en charge", desc: "Dépannage sur place ou remorquage vers le garage de votre choix. Vous payez sur place, à la fin." },
];

export const GALLERY = [
    { src: "/img/flotte-plateau.webp", alt: "La dépanneuse plateau prête à partir pour une intervention en Île-de-France", caption: "Plateau prêt à partir" },
    { src: "/img/flotte-van.webp", alt: "Combi Volkswagen arrimé sur le plateau de la dépanneuse", caption: "Véhicule arrimé, départ vers le garage" },
    { src: "/img/intervention-pluie.webp", alt: "Intervention de dépannage sous la pluie en Île-de-France", caption: "Intervention sous la pluie" },
];

export const PANNE_TYPES = ["Remorquage", "Batterie", "Crevaison", "Panne de carburant", "Véhicule accidenté", "Désembourbage", "Autre panne"];
