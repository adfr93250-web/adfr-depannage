import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ShieldCheck, BadgeCheck, Clock3 } from "lucide-react";
import { SITE } from "@/data/site";
import { BRAND } from "@/data/brand";
import { CallButton, WhatsAppButton } from "@/components/CTAButtons";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LINES = BRAND.heroLines;

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const yImg = useTransform(scrollYProgress, [0, 1], [0, 70]);



    return (
        <section ref={ref} className="relative overflow-hidden">
            {/* Photo pleine largeur : cabine + logo à droite ; recadrage mobile sur la cabine (object-position 82 %) */}
            <motion.div style={{ y: yImg }} className="absolute inset-x-0 top-0 h-[46svh] min-h-[300px] lg:inset-0 lg:h-auto" data-testid="hero-photo-frame" aria-hidden="true">
                <img
                    src={SITE.truck}
                    srcSet={BRAND.truckSrcSet}
                    sizes="100vw"
                    alt=""
                    className="h-full w-full object-cover object-right lg:object-center scale-[1.04]"
                    fetchPriority="high"
                    decoding="async"
                />
                {/* Dégradé sombre à gauche pour la lisibilité du titre et du bouton d'appel */}
                {/* Mobile : photo en bandeau haut (cabine + logo cadrés), fondu vers le fond sous le titre */}
                <div className="absolute inset-0 bg-gradient-to-b from-adfr-night/35 via-adfr-night/10 to-adfr-night lg:hidden" />
                {/* Desktop : dégradé sombre à gauche pour la lisibilité du titre et du bouton d'appel */}
                <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-adfr-night via-adfr-night/70 to-transparent" />
                <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-adfr-night via-transparent to-adfr-night/40" />
            </motion.div>
            <img src={SITE.truck} alt="Dépanneuse ADFR dépannage remorquage Paris" className="sr-only" width="1600" height="800" loading="eager" />

            <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-[34svh] lg:pt-16 pb-16 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center min-h-[calc(100svh-64px)] md:min-h-[calc(100svh-80px)]">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.55, ease: EASE }}
                        data-testid="hero-eyebrow"
                        className="inline-flex items-center gap-2.5 rounded-full border border-adfr-chrome/25 bg-adfr-deep/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300"
                    >
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-adfr-red opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-adfr-red" />
                        </span>
                        Dépannage 24/7 — Île-de-France
                    </motion.div>

                    <h1 className="relative mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-white">
                        {LINES.map((line, i) => (
                            <span key={line} className="block overflow-hidden pb-1">
                                <motion.span
                                    className={`block ${i === 2 ? "text-adfr-red" : ""}`}
                                    initial={{ y: "112%", rotate: 3, scale: 0.96 }}
                                    animate={{
                                        y: 0,
                                        rotate: 0,
                                        scale: 1,
                                        ...(i === 2
                                            ? { textShadow: ["0 0 0px rgba(var(--c-red-c),0)", "0 0 34px rgba(var(--c-red-c),0.85)", "0 0 0px rgba(var(--c-red-c),0)"] }
                                            : {}),
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: [0.22, 1, 0.36, 1],
                                        delay: 0.12 + i * 0.18,
                                        ...(i === 2 ? { textShadow: { delay: 0.95, duration: 1.5 } } : {}),
                                    }}
                                >
                                    {line}
                                </motion.span>
                            </span>
                        ))}
                        <motion.span
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 -left-8 w-20 skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: 860, opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.15, delay: 0.6, ease: "easeInOut" }}
                        />
                    </h1>
                    <motion.div
                        aria-hidden
                        className="relative -mt-1.5 h-1.5 w-40 rounded-full bg-adfr-red sm:w-56"
                        style={{ transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.55, delay: 1.0, ease: EASE }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
                        className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-slate-300"
                    >
                        {BRAND.heroText}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 210, damping: 20, delay: 0.95 }}
                        className="mt-8 flex flex-col sm:flex-row gap-3"
                    >
                        <CallButton testId="hero-call-button" className="w-full sm:w-auto" />
                        <WhatsAppButton testId="hero-whatsapp-button" className="w-full sm:w-auto" />
                    </motion.div>

                    <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 1.1 }}
                        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-400"
                    >
                        <li className="flex items-center gap-2">
                            <Clock3 className="size-4 text-adfr-red" /> En moyenne {BRAND.delay.short}
                        </li>
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-adfr-red" /> 7j/7, week-ends et fériés
                        </li>
                        <li className="flex items-center gap-2">
                            <BadgeCheck className="size-4 text-adfr-red" /> Paiement sur place
                        </li>
                    </motion.ul>
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.6 }} className="relative hidden lg:flex h-[540px] items-end justify-end gap-4">
                    <div className="rounded-full bg-adfr-red px-4 py-2 font-display text-xs font-black uppercase tracking-widest text-white shadow-lg" data-testid="hero-badge-247">
                        24/7 — 7j/7
                    </div>
                    <div className="rounded-2xl border border-adfr-chrome/30 bg-adfr-night/70 px-4 py-3 text-right backdrop-blur-md" data-testid="hero-badge-delay">
                        <p className="font-display text-2xl font-black text-chrome leading-none">{BRAND.id === "adfr" ? "< 30 min" : "≈ 20 min"}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">Délai moyen IDF</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
