import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ShieldCheck, BadgeCheck, Clock3, CreditCard, Banknote, Star, MapPin, Loader2, MessageSquareOff } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { SITE } from "@/redesign/data";
import { gsap, REDUCED, scrollToId } from "@/redesign/motion";
import { useGeo, useLang } from "@/lib/urgence";
import { StatusPill, sendPosition } from "@/redesign/Urgence";
import { CallButton, WhatsAppButton } from "@/redesign/CTAButtons";

/**
 * Hero pensé pour l'urgence : numéro et boutons visibles dès la première image, sans attente.
 * La vraie dépanneuse ADFR (détourée de la photo) entre par la gauche devant le décor fixe,
 * avec le titre qui se compose lettre par lettre. La photo suit légèrement la souris et
 * part en parallaxe au défilement.
 */
export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const { lang, t } = useLang();
    const geo = useGeo();
    const { pathname } = useLocation();
    const heroLines = lang === "en" ? ["Broken down?", "We're coming", "in under 30 minutes."] : SITE.heroLines;

    // Hauteur d'écran figée au chargement : sur téléphone, la barre du navigateur qui se replie
    // au défilement ne doit ni agrandir ni recadrer la photo. On ne recalcule que si la largeur change (rotation).
    useLayoutEffect(() => {
        let width = window.innerWidth;
        const set = () => document.documentElement.style.setProperty("--hero-vh", `${window.innerHeight / 100}px`);
        const onResize = () => {
            if (window.innerWidth === width) return;
            width = window.innerWidth;
            set();
        };
        set();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useGSAP(
        () => {
            if (REDUCED) return;
            // Le titre, le numéro et les boutons sont affichés immédiatement.
            // Seule la dépanneuse bouge : elle entre par la gauche en moins d'une seconde, sans rien bloquer.
            gsap.fromTo(".hero-truck", { xPercent: -108 }, { xPercent: 0, duration: 0.95, ease: "power3.out" });
            gsap.fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.5, delay: 0.2 });
        },
        { scope: ref },
    );

    return (
        <section ref={ref} className="sheet hero-sheet relative flex flex-col justify-end overflow-hidden" data-testid="hero">
            {/* Vraie photo de la dépanneuse ADFR : plein écran sur ordinateur, bandeau haut sur mobile (cabine + logo cadrés) */}
            <div className="hero-photo absolute inset-x-0 top-0 min-h-[320px] overflow-hidden lg:inset-0" data-testid="hero-photo-frame">
                <div className="hero-zoom h-full w-full">
                    <div className="hero-drift relative -m-[3%] h-[106%] w-[106%]">
                        {/* Décor reconstitué sans le camion + camion détouré, issus de la même photo : ils se superposent exactement */}
                        <img src="/img/hero-decor.webp" alt="" width={1600} height={800} fetchPriority="high" decoding="sync" className="hero-decor absolute inset-0 h-full w-full max-w-none object-cover object-[84%_center] lg:object-right" />
                        <img src="/img/hero-camion.webp" alt="Dépanneuse ADFR dépannage remorquage Paris" width={1600} height={800} fetchPriority="high" decoding="sync" className="hero-truck absolute inset-0 h-full w-full max-w-none object-cover object-[84%_center] lg:object-right" />
                    </div>
                </div>
                <div className="hero-sweep pointer-events-none invisible absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-adfr-night/45 via-adfr-night/5 to-adfr-night lg:hidden" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-adfr-night via-adfr-night/60 to-transparent to-70% lg:block" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-adfr-night via-transparent to-adfr-night/55 lg:block" aria-hidden="true" />
            </div>
            <div className="hero-shade pointer-events-none invisible absolute inset-0 bg-adfr-night opacity-0" aria-hidden="true" />

            <div className="wrap relative grid items-end gap-10 pb-28 pt-32 md:pb-16 lg:pb-20">
                <div className="hero-copy max-w-[58rem]">
                    <div className="flex flex-wrap items-center gap-3">
                    {/* Sur téléphone, la pastille est masquée pour alléger le premier écran */}
                    <StatusPill className="max-lg:hidden" />
                    <div className="hero-fade hidden rounded-full bg-adfr-red lg:block px-4 py-2 font-display text-xs font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(227,6,19,0.5)]" data-testid="hero-badge-247">
                        {t("24h/24 — dim. au ven.", "24/7 — Sun. to Fri.")}
                    </div>
                    <div className="hero-fade glass hidden items-center gap-3 lg:flex rounded-full px-5 py-2" data-testid="hero-badge-delay">
                        <p className="display text-chrome text-2xl">
                            &lt; <span data-delay>30</span> <span className="text-base">min</span>
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">{t("Délai moyen IDF", "Average delay")}</p>
                    </div>
                    </div>

                    <h1 className={`display hero-title mt-6 text-white ${lang === "en" ? "hero-title--en" : ""}`} aria-label={heroLines.join(" ")}>
                        <span className="hero-line block overflow-hidden pb-[0.08em]" aria-hidden="true">{heroLines[0]}</span>
                        <span className="hero-line hero-chrome text-chrome block overflow-hidden pb-[0.08em] pr-[0.1em] italic" aria-hidden="true">{heroLines[1]}</span>
                        <span className="hero-line hero-red mt-1 block overflow-hidden pb-[0.1em] text-[0.5em] leading-[1.02] sm:text-[0.47em]" aria-hidden="true">{heroLines[2]}</span>
                    </h1>
                    <div className="hero-rule mt-4 h-1.5 w-40 origin-left rounded-full bg-adfr-red shadow-[0_0_30px_rgba(227,6,19,0.8)] sm:w-64" aria-hidden="true" />

                    <p className="hero-fade mt-6 hidden max-w-xl text-[0.95rem] leading-relaxed text-slate-300 sm:block md:text-lg">{t(SITE.heroText, "On site in under 30 minutes anywhere in the Paris region. Roadside repair or towing for all makes, day and night, Sunday to Friday, public holidays included.")}</p>

                    <div className="hero-fade mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                        <CallButton testId="hero-call-button" className="w-full sm:w-auto" />
                        <WhatsAppButton testId="hero-whatsapp-button" className="w-full sm:w-auto" label={t("WhatsApp — envoyer ma panne", "WhatsApp — send my problem")} />
                        <button type="button" onClick={() => sendPosition(lang, pathname)} disabled={geo.kind === "loading"} data-testid="hero-position-button" className="btn btn-ghost px-6 py-[1.15rem] text-base !normal-case !tracking-normal max-lg:!hidden">
                            {geo.kind === "loading" ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <MapPin className="size-5 text-adfr-wa" aria-hidden="true" />}
                            {t("Envoyer ma position", "Send my position")}
                        </button>
                    </div>
                    {/* Les deux freins à l'appel, levés sous le bouton : le prix et le paiement */}
                    <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-200" data-testid="hero-reassurance">
                        <span className="inline-flex items-center gap-1.5"><BadgeCheck className="size-4 text-adfr-wa" aria-hidden="true" /> {t("Prix annoncé avant le départ", "Price given before we leave")}</span>
                        <span className="inline-flex items-center gap-1.5"><CreditCard className="size-4 text-adfr-electricLight" aria-hidden="true" /> {t("Carte", "Card")}</span>
                        <span className="inline-flex items-center gap-1.5"><Banknote className="size-4 text-adfr-wa" aria-hidden="true" /> {t("Espèces", "Cash")}</span>
                        <a href={SITE.googleReviewsUrl} target="_blank" rel="noopener noreferrer" data-testid="hero-google" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                            <Star className="size-4 fill-[#FFC531] text-[#FFC531]" aria-hidden="true" /> {t("Avis clients sur Google", "Customer reviews on Google")}
                        </a>
                    </p>

                    <ul className="hero-fade mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-300">
                        <li className="flex items-center gap-2"><Clock3 className="size-4 text-adfr-red" aria-hidden="true" /> {t(`En moyenne ${SITE.delay.short}`, "Under 30 min on average")}</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-adfr-red" aria-hidden="true" /> {t("Dimanche au vendredi, jours fériés inclus", "Sunday to Friday, holidays included")}</li>
                        <li>
                            <button type="button" onClick={() => scrollToId("urgence")} data-testid="hero-no-call" className="inline-flex items-center gap-2 font-bold text-white underline underline-offset-4">
                                <MessageSquareOff className="size-4 text-adfr-red" aria-hidden="true" /> {t("Je ne peux pas parler : tout par message", "I can't talk: do it all by message")}
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
}
