import { useEffect, useState } from "react";
import { useLang } from "@/lib/urgence";

/**
 * Mesure d'audience Google Analytics (GA4), uniquement après accord du visiteur.
 * La balise Google Ads d'index.html n'est pas touchée : ce fichier ne fait qu'ajouter Analytics.
 * Le choix est gardé sur l'appareil ; le lien « Gérer les cookies » du pied de page rouvre le bandeau.
 */
const GA_ID = "G-CYNG867555";
const KEY = "adfr_cookies";
const OPEN_EVENT = "adfr:cookies";
type Choice = "yes" | "no" | null;

function readChoice(): Choice {
    try {
        const v = window.localStorage.getItem(KEY);
        return v === "yes" || v === "no" ? v : null;
    } catch {
        return null;
    }
}

function saveChoice(choice: "yes" | "no") {
    try {
        window.localStorage.setItem(KEY, choice);
    } catch {
        // stockage indisponible : le choix vaut pour cette visite seulement
    }
}

const flags = () => window as unknown as Record<string, unknown>;

let started = false;
function startAnalytics() {
    flags()[`ga-disable-${GA_ID}`] = false;
    if (started || typeof window.gtag !== "function") return;
    started = true;
    window.gtag("config", GA_ID);
}

function stopAnalytics() {
    flags()[`ga-disable-${GA_ID}`] = true;
    // On retire les cookies Analytics déjà posés (_ga, _ga_XXXX)
    try {
        const host = window.location.hostname;
        const domains = ["", `; domain=${host}`, `; domain=.${host.replace(/^www\./, "")}`];
        document.cookie.split(";").forEach((c) => {
            const name = c.split("=")[0].trim();
            if (!name.startsWith("_ga")) return;
            domains.forEach((d) => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
            });
        });
    } catch {
        // rien à nettoyer
    }
}

/** Rouvre le bandeau (lien du pied de page). */
export function openCookieBanner() {
    window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieBanner() {
    const { t } = useLang();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const choice = readChoice();
        if (choice === "yes") startAnalytics();
        else if (choice === null) setOpen(true);
        const reopen = () => setOpen(true);
        window.addEventListener(OPEN_EVENT, reopen);
        return () => window.removeEventListener(OPEN_EVENT, reopen);
    }, []);

    if (!open) return null;

    const choose = (choice: "yes" | "no") => {
        saveChoice(choice);
        if (choice === "yes") startAnalytics();
        else stopAnalytics();
        setOpen(false);
    };

    const button = "flex-1 rounded-full border border-adfr-chrome/40 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/5";

    return (
        <div
            role="dialog"
            aria-label={t("Cookies", "Cookies")}
            data-testid="cookie-banner"
            className="glass fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[85] rounded-2xl p-4 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm"
        >
            <p className="text-xs leading-relaxed text-slate-300">
                {t(
                    "Nous utilisons des cookies Google Analytics pour mesurer la fréquentation du site. Vous pouvez accepter ou refuser, et changer d'avis à tout moment en bas de page.",
                    "We use Google Analytics cookies to measure site traffic. You can accept or decline, and change your mind at any time at the bottom of the page.",
                )}
            </p>
            <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => choose("no")} data-testid="cookie-refuse" className={button}>
                    {t("Refuser", "Decline")}
                </button>
                <button type="button" onClick={() => choose("yes")} data-testid="cookie-accept" className={button}>
                    {t("Accepter", "Accept")}
                </button>
            </div>
        </div>
    );
}
