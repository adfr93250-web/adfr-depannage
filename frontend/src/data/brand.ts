export type BrandId = "adfr" | "sos";

export interface Brand {
    id: BrandId;
    name: string;
    fullName: string;
    legalLine: string;
    domain: string;
    phoneDisplay: string;
    phoneHref: string;
    phoneIntl: string;
    whatsappNumber: string;
    logo: string;
    favicon: string;
    ogImage: string;
    truck: string;
    truckSrcSet?: string;
    heroLines: string[];
    heroText: string;
    /** Délai annoncé : ADFR "en moins de 30 minutes", SOS "en 20 minutes" */
    delay: { long: string; short: string };
    showGallery: boolean;
    /** Formulaire de rappel + section "comment ça marche" : SOS Dépannage = appel direct uniquement */
    showCallbackForm: boolean;
    showProcess: boolean;
}

function phoneFromDigits(raw: string) {
    const d = raw.replace(/\D/g, "");
    const national = d.startsWith("33") ? `0${d.slice(2)}` : d;
    const intl = d.startsWith("33") ? `+${d}` : `+33${d.replace(/^0/, "")}`;
    return {
        phoneDisplay: national.replace(/(\d{2})(?=\d)/g, "$1 ").trim(),
        phoneHref: `tel:${intl}`,
        phoneIntl: intl,
    };
}

const ADFR: Brand = {
    id: "adfr",
    name: "ADFR",
    fullName: "ADFR — Auto Dépann France Remorquage",
    legalLine: "ADFR — Auto Dépann France Remorquage. Toute l'Île-de-France.",
    domain: "https://adfr-depannage.fr",
    ...phoneFromDigits("0185800061"),
    whatsappNumber: "33652664749",
    logo: "/img/logo-adfr.png",
    favicon: "/img/favicon-247.png",
    ogImage: "/img/og-cover.jpg",
    truck: "/img/hero-adfr.webp",
    truckSrcSet: "/img/hero-adfr-800.webp 800w, /img/hero-adfr.webp 1600w",
    heroLines: ["Une panne ?", "On arrive", "en moins de 30 minutes."],
    heroText: "Intervention en moins de 30 minutes partout en Île-de-France. Dépannage sur place ou remorquage toutes marques, de jour comme de nuit, week-ends et jours fériés.",
    delay: { long: "en moins de 30 minutes", short: "moins de 30 min" },
    showGallery: true,
    showCallbackForm: true,
    showProcess: true,
};

const SOS: Brand = {
    id: "sos",
    name: "SOS Dépannage",
    fullName: "SOS Dépannage — Dépanneuse 24h/24 Île-de-France",
    legalLine: "SOS Dépannage — Dépanneuse et remorquage 24h/24 en Île-de-France.",
    domain: "https://sos-depann.fr",
    ...phoneFromDigits("0184160923"),
    whatsappNumber: "33652664749",
    logo: "/img/logo-sos.png",
    favicon: "/img/favicon-sos.png",
    ogImage: "/img/og-cover-sos.jpg",
    truck: "/img/depanneuse-sos.jpg",
    heroLines: ["En panne ?", "Appelez.", "On arrive en 20 min."],
    heroText: "Voiture en panne, batterie à plat, accident : un dépanneur part immédiatement et vous rejoint en 20 minutes en moyenne, 24h/24, partout en Île-de-France.",
    delay: { long: "en 20 minutes", short: "20 min" },
    showGallery: false,
    showCallbackForm: false,
    showProcess: false,
};

const BRANDS: Record<BrandId, Brand> = { adfr: ADFR, sos: SOS };

function resolveBrand(): Brand {
    const id: BrandId = process.env.REACT_APP_BRAND === "sos" ? "sos" : "adfr";
    const base = BRANDS[id];
    const phone = process.env.REACT_APP_PHONE;
    const wa = process.env.REACT_APP_WHATSAPP;
    const domain = process.env.REACT_APP_SITE_URL;
    return {
        ...base,
        ...(phone ? phoneFromDigits(phone) : {}),
        ...(wa ? { whatsappNumber: wa.replace(/\D/g, "") } : {}),
        ...(domain ? { domain: domain.replace(/\/$/, "") } : {}),
    };
}

export const BRAND: Brand = resolveBrand();

/** Adapte les textes rédigés (zones) à la marque active : nom de marque et délai annoncé. */
export function brandText(text: string): string {
    if (BRAND.id !== "adfr") return text.replace(/\bADFR\b/g, BRAND.name);
    return text
        .replace(/intervention moyenne en 20 minutes/g, "intervention en moins de 30 minutes en moyenne")
        .replace(/en 20 minutes/g, "en moins de 30 minutes")
        .replace(/20 min\b/g, "moins de 30 min");
}
