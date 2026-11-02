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
    truck: "/img/depanneuse.webp",
    truckSrcSet: "/img/depanneuse-800.webp 800w, /img/depanneuse.webp 1600w",
    heroLines: ["Une panne ?", "On arrive", "en 20 minutes."],
    heroText: "Intervention en 20 minutes partout en Île-de-France. Dépannage sur place ou remorquage toutes marques, de jour comme de nuit, week-ends et jours fériés.",
    showGallery: true,
    showCallbackForm: true,
    showProcess: true,
};

const SOS: Brand = {
    id: "sos",
    name: "SOS Dépannage",
    fullName: "SOS Dépannage — Dépanneuse 24h/24 Île-de-France",
    legalLine: "SOS Dépannage — Dépanneuse et remorquage 24h/24 en Île-de-France.",
    domain: "https://sos-depannage-idf.fr",
    ...phoneFromDigits("0652664749"),
    whatsappNumber: "33652664749",
    logo: "/img/logo-sos.png",
    favicon: "/img/favicon-sos.png",
    ogImage: "/img/og-cover-sos.jpg",
    truck: "/img/depanneuse-sos.jpg",
    heroLines: ["En panne ?", "Appelez.", "On arrive en 20 min."],
    heroText: "Voiture en panne, batterie à plat, accident : un dépanneur part immédiatement et vous rejoint en 20 minutes en moyenne, 24h/24, partout en Île-de-France.",
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

/** Remplace la marque ADFR dans les textes rédigés pour la marque active. */
export function brandText(text: string): string {
    return BRAND.id === "adfr" ? text : text.replace(/\bADFR\b/g, BRAND.name);
}
