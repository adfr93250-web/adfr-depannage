import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BatteryCharging, CircleDot, Fuel, Siren, Tractor, Wrench, MapPin, Loader2, MessageCircle, PhoneCall, CreditCard, Banknote, Contact, WifiOff, ShieldAlert, Shirt, Lightbulb } from "lucide-react";
import { SITE } from "@/data/site";
import { track, gtagConversion } from "@/lib/api";
import { availability, GEO_ERRORS, locate, useGeo, useLang, waLink } from "@/lib/urgence";

const PANNES = [
    { icon: BatteryCharging, fr: "Batterie", en: "Battery" },
    { icon: CircleDot, fr: "Crevaison", en: "Flat tyre" },
    { icon: Fuel, fr: "Carburant", en: "Fuel" },
    { icon: Siren, fr: "Accident", en: "Accident" },
    { icon: Tractor, fr: "Enlisé", en: "Stuck" },
    { icon: Wrench, fr: "Autre panne", en: "Other" },
];

const BOX = "min-w-0 rounded-2xl border border-adfr-chrome/20 bg-adfr-deep2/40 p-4 md:p-6";

/**
 * Voyant de disponibilité (heure de Paris), recalculé chaque minute.
 * Pendant le pré-rendu des pages (navigateur automatisé), on garde le libellé fixe d'origine :
 * une heure figée dans le HTML statique serait fausse.
 */
export function StatusPill({ className = "" }: { className?: string }) {
    const { t } = useLang();
    const [a, setA] = useState<ReturnType<typeof availability> | null>(null);
    useEffect(() => {
        if (navigator.webdriver) return;
        setA(availability());
        const id = setInterval(() => setA(availability()), 30000);
        return () => clearInterval(id);
    }, []);
    return (
        <p className={`inline-flex items-center gap-2.5 rounded-full border border-adfr-chrome/25 bg-adfr-deep/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-200 sm:text-[11px] sm:tracking-[0.16em] ${className}`} data-testid="status-pill" role="status">
            <span className="relative flex size-2.5 shrink-0">
                {(!a || a.open) && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${a ? "bg-adfr-wa" : "bg-adfr-red"}`} />}
                <span className={`relative inline-flex size-2.5 rounded-full ${!a ? "bg-adfr-red" : a.open ? "bg-adfr-wa" : "bg-amber-400"}`} />
            </span>
            <span>
                {!a
                    ? "Dépannage 24h/24 — Île-de-France"
                    : a.open
                      ? t("Dépanneur disponible maintenant", "Driver available now")
                      : t("Fermé le samedi — retour dimanche", "Closed Saturday — back Sunday")}
                {a && <span className="tabular-nums text-slate-400"> · {a.time}</span>}
            </span>
        </p>
    );
}

/** Demande la position puis, sur téléphone, ouvre directement WhatsApp avec le message prêt. */
export async function sendPosition(lang: "fr" | "en", page: string) {
    const g = await locate();
    if (g.kind === "found") {
        track("whatsapp", page, "Position en un geste");
        gtagConversion("whatsapp");
        if (window.matchMedia("(pointer: coarse)").matches) window.location.assign(waLink({ geo: g, lang }));
    }
    return g;
}

export function SafetyList({ className = "" }: { className?: string }) {
    const { t } = useLang();
    return (
        <div className={className} data-testid="safety-list">
            <p className="flex items-center gap-2 font-display text-sm font-extrabold text-white">
                <ShieldAlert className="size-5 shrink-0 text-adfr-redLight" /> {t("En attendant le dépanneur", "While you wait")}
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                <li className="flex items-center gap-2"><Lightbulb className="size-4 shrink-0 text-amber-400" /> {t("Allumez vos feux de détresse.", "Switch on your hazard lights.")}</li>
                <li className="flex items-center gap-2"><Shirt className="size-4 shrink-0 text-amber-400" /> {t("Enfilez le gilet avant de sortir.", "Put on the hi-vis vest before getting out.")}</li>
                <li className="flex items-center gap-2"><ShieldAlert className="size-4 shrink-0 text-amber-400" /> {t("Mettez-vous à l'écart de la circulation, triangle posé.", "Stand well away from traffic, warning triangle out.")}</li>
            </ul>
        </div>
    );
}

/**
 * Panneau d'urgence : demander de l'aide sans parler ni taper — type de panne en un geste,
 * position — puis les consignes de sécurité, le prix et le paiement.
 */
export default function Urgence() {
    const { lang, t } = useLang();
    const geo = useGeo();
    const { pathname } = useLocation();

    return (
        <section id="urgence" className="relative border-y border-adfr-chrome/10 bg-adfr-night2 py-12 md:py-16" data-testid="urgence">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-adfr-red">{t("Sans parler, en un geste", "No call needed, one tap")}</p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t("Quel est le problème ?", "What is the problem?")}</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{t("Touchez votre panne : WhatsApp s'ouvre avec le message déjà écrit. Vous n'avez plus qu'à envoyer.", "Tap your problem: WhatsApp opens with the message already written. Just press send.")}</p>

                <ul className="mt-6 grid grid-cols-3 gap-2.5 md:grid-cols-6 md:gap-4">
                    {PANNES.map((p) => (
                        <li key={p.fr}>
                            <a
                                href={waLink({ panne: lang === "en" ? p.en : p.fr, geo, lang })}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid={`panne-${p.fr.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                onClick={() => { track("whatsapp", pathname, `Panne : ${p.fr}`); gtagConversion("whatsapp"); }}
                                className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-adfr-chrome/20 bg-adfr-deep2/50 px-2 py-4 text-center transition-colors hover:border-adfr-red hover:bg-adfr-red/15 active:scale-[0.97] md:py-6"
                            >
                                <p.icon className="size-7 text-adfr-redLight md:size-8" />
                                <span className="font-display text-xs font-extrabold text-white md:text-sm">{lang === "en" ? p.en : p.fr}</span>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className={`mt-4 ${BOX}`} aria-live="polite">
                    {geo.kind !== "found" && (
                        <button type="button" onClick={() => sendPosition(lang, pathname)} disabled={geo.kind === "loading"} data-testid="urgence-position" className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-adfr-electric px-5 py-4 text-center font-display text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-adfr-electricDark active:scale-[0.98] disabled:opacity-70 md:text-base">
                            {geo.kind === "loading" ? <Loader2 className="size-5 shrink-0 animate-spin" /> : <MapPin className="size-5 shrink-0" />}
                            {geo.kind === "loading" ? t("Recherche de votre position…", "Finding your position…") : t("Envoyer ma position", "Send my position")}
                        </button>
                    )}
                    {geo.kind === "error" && (
                        <p className="mt-3 text-sm font-semibold text-adfr-redLight" data-testid="urgence-position-error" role="alert">
                            {GEO_ERRORS[geo.code]?.[lang === "en" ? 1 : 0] ?? GEO_ERRORS[2][0]}
                        </p>
                    )}
                    {geo.kind === "found" && (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-white" data-testid="urgence-position-found">{t(`Position trouvée. Envoyez-la à ${SITE.name} :`, `Position found. Send it to ${SITE.name}:`)}</p>
                            <a
                                href={waLink({ geo, lang })}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="urgence-position-wa"
                                onClick={() => { track("whatsapp", pathname, "Position"); gtagConversion("whatsapp"); }}
                                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-adfr-wa px-5 py-4 text-center font-display text-sm font-bold text-white transition-colors hover:bg-[#1eb856] md:text-base"
                            >
                                <MessageCircle className="size-5 shrink-0" /> {t("Envoyer ma position par WhatsApp", "Send my position on WhatsApp")}
                            </a>
                        </div>
                    )}
                    {geo.kind !== "found" && <p className="mt-3 text-xs text-slate-500">{t("Rien n'est envoyé sans votre accord : vous validez le message dans WhatsApp.", "Nothing is sent without your consent: you confirm the message in WhatsApp.")}</p>}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
                    <SafetyList className={BOX} />
                    <div className={BOX}>
                        <p className="font-display text-sm font-extrabold text-white">{t("Prix annoncé au téléphone avant le départ, sans engagement.", "Price given on the phone before we leave, no commitment.")}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300" data-testid="payment-icons">
                            <span className="inline-flex items-center gap-1.5"><CreditCard className="size-4 text-adfr-electricLight" /> {t("Carte bancaire", "Card")}</span>
                            <span className="inline-flex items-center gap-1.5"><Banknote className="size-4 text-adfr-wa" /> {t("Espèces", "Cash")}</span>
                            <span>{t("Paiement sur place, à la fin.", "Paid on site, at the end.")}</span>
                        </p>
                        <a href="/adfr.vcf" download="ADFR-depannage.vcf" data-testid="add-contact" className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full border border-adfr-chrome/30 px-5 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-white/5">
                            <Contact className="size-5 shrink-0 text-adfr-electricLight" /> {t("Ajouter ADFR à mes contacts", "Save ADFR to my contacts")}
                        </a>
                        <a href="/urgence.html" data-testid="light-page" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 underline-offset-4 hover:underline">
                            <WifiOff className="size-4" /> {t("Page ultra-légère (peu de réseau)", "Ultra-light page (weak signal)")}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Après un appel : les consignes de sécurité remontent en bas d'écran. */
export function SafetySheet() {
    const { t } = useLang();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const on = (e: Event) => {
            if ((e as CustomEvent).detail === "call") setOpen(true);
        };
        window.addEventListener("adfr:action", on);
        return () => window.removeEventListener("adfr:action", on);
    }, []);
    if (!open) return null;
    return (
        <div className="fixed inset-x-3 bottom-[calc(84px+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md rounded-2xl border border-adfr-chrome/30 bg-adfr-deep p-4 shadow-2xl md:bottom-6 md:left-6 md:right-auto" role="dialog" aria-label={t("Consignes de sécurité", "Safety advice")} data-testid="safety-sheet">
            <SafetyList />
            <div className="mt-3 flex items-center justify-between gap-3">
                <a href={SITE.phoneHref} className="inline-flex items-center gap-2 text-xs font-bold text-white">
                    <PhoneCall className="size-4 text-adfr-red" /> {SITE.phoneDisplay}
                </a>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-adfr-chrome/30 px-4 py-2 text-xs font-bold text-white" data-testid="safety-close">
                    {t("J'ai compris", "Got it")}
                </button>
            </div>
        </div>
    );
}
