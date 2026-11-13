import { motion } from "framer-motion";
import { Clock3, ShieldCheck, BadgeCheck, PhoneCall } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SITE } from "@/data/site";
import { BRAND } from "@/data/brand";
import { WhatsAppButton } from "@/components/CTAButtons";
import { track, gtagConversion } from "@/lib/api";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Hero SOS Dépannage : plein écran, photo en fond, numéro géant — un seul objectif : l'appel. */
export default function HeroSos() {
    const { pathname } = useLocation();
    return (
        <section className="relative overflow-hidden min-h-[calc(100svh-64px)] md:min-h-[calc(100svh-80px)] flex flex-col" data-testid="hero-sos">
            <div className="hazard h-3 md:h-4 w-full" aria-hidden />
            <img src={BRAND.truck} alt={`Dépanneuse ${SITE.name} chargeant une voiture en panne`} className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-r from-adfr-night via-adfr-night/85 to-adfr-night/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-adfr-night via-transparent to-adfr-night/40" />

            <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8 py-14 md:py-24 flex-1 flex flex-col justify-center">
                <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }} data-testid="hero-eyebrow" className="inline-flex w-fit items-center gap-3 border-l-4 border-adfr-electric pl-4 text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-adfr-electricLight">
                    Dépanneuse 24h/24 — Île-de-France
                </motion.p>

                <h1 className="mt-6 font-display font-black uppercase leading-[0.9] text-white text-6xl sm:text-7xl lg:text-[8.5rem]">
                    {BRAND.heroLines.map((line, i) => (
                        <motion.span key={line} className={`block ${i === BRAND.heroLines.length - 1 ? "text-adfr-red" : ""}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.12 }}>
                            {line}
                        </motion.span>
                    ))}
                </h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }} className="mt-6 max-w-xl text-base md:text-lg text-slate-300">
                    {BRAND.heroText}
                </motion.p>

                <motion.a
                    href={SITE.phoneHref}
                    data-testid="hero-call-button"
                    onClick={() => { track("call", pathname, "Haut de page"); gtagConversion("call"); }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
                    className="mt-10 inline-flex w-full sm:w-fit items-center gap-4 sm:gap-6 bg-adfr-red hover:bg-adfr-redDark text-white px-6 sm:px-10 py-5 sm:py-6 shadow-[0_0_60px_rgba(var(--c-red-c),0.45)] transition-colors active:scale-[0.98]"
                >
                    <PhoneCall className="size-9 sm:size-12 animate-ring shrink-0" />
                    <span className="flex flex-col leading-none">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/80">Appeler maintenant</span>
                        <span className="mt-1 font-display text-4xl sm:text-6xl font-black tracking-wide whitespace-nowrap">{SITE.phoneDisplay}</span>
                    </span>
                </motion.a>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.85 }} className="mt-4">
                    <WhatsAppButton testId="hero-whatsapp-button" className="w-full sm:w-auto !rounded-[3px]" />
                </motion.div>

                <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 max-w-3xl">
                    {[
                        [Clock3, "≈ 20 min", "délai moyen d'arrivée"],
                        [ShieldCheck, "24h/24 · 7j/7", "nuits, week-ends, fériés"],
                        [BadgeCheck, "Paiement sur place", "carte ou espèces, aucune avance"],
                    ].map(([Icon, big, small]) => {
                        const I = Icon as typeof Clock3;
                        return (
                            <li key={big as string} className="bg-adfr-night/80 backdrop-blur px-5 py-4 flex items-center gap-3">
                                <I className="size-6 text-adfr-electric shrink-0" />
                                <span>
                                    <span className="block font-display text-xl font-black uppercase text-white leading-none">{big as string}</span>
                                    <span className="block text-xs text-slate-400 mt-1">{small as string}</span>
                                </span>
                            </li>
                        );
                    })}
                </motion.ul>
            </div>
            <div className="hazard h-3 md:h-4 w-full" aria-hidden />
        </section>
    );
}
