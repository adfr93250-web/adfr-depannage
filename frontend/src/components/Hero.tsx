import { useRef, type MouseEvent } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ShieldCheck, BadgeCheck, Clock3 } from "lucide-react";
import { SITE } from "@/data/site";
import { CallButton, WhatsAppButton } from "@/components/CTAButtons";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LINES = ["Une panne ?", "On arrive", "en 20 minutes."];

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const yImg = useTransform(scrollYProgress, [0, 1], [0, 70]);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 18 });
    const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 18 });

    const onMove = (e: MouseEvent) => {
        const r = frameRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <section ref={ref} className="relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 right-[-10%] size-[600px] rounded-full bg-adfr-electric/20 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-[500px] rounded-full bg-adfr-red/10 blur-[140px]" />

            <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-10 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center min-h-[calc(100svh-64px)] md:min-h-[calc(100svh-80px)]">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        data-testid="hero-eyebrow"
                        className="inline-flex items-center gap-2.5 rounded-full border border-adfr-chrome/25 bg-adfr-deep/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300"
                    >
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-adfr-red opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-adfr-red" />
                        </span>
                        Dépannage 24h/24 — Île-de-France
                    </motion.div>

                    <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-white">
                        {LINES.map((line, i) => (
                            <span key={line} className="block overflow-hidden pb-1">
                                <motion.span
                                    className={`block ${i === 2 ? "text-adfr-red" : ""}`}
                                    initial={{ y: "112%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.14 }}
                                >
                                    {line}
                                </motion.span>
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
                        className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-slate-300"
                    >
                        Intervention en 20 minutes partout en Île-de-France. Dépannage sur place ou remorquage toutes marques, de jour comme de nuit, du dimanche au vendredi.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
                        className="mt-8 flex flex-col sm:flex-row gap-3"
                    >
                        <CallButton testId="hero-call-button" className="w-full sm:w-auto" />
                        <WhatsAppButton testId="hero-whatsapp-button" className="w-full sm:w-auto" />
                    </motion.div>

                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
                        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-400"
                    >
                        <li className="flex items-center gap-2">
                            <Clock3 className="size-4 text-adfr-red" /> En moyenne en 20 min
                        </li>
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-adfr-red" /> Tous assureurs
                        </li>
                        <li className="flex items-center gap-2">
                            <BadgeCheck className="size-4 text-adfr-red" /> Paiement sur place
                        </li>
                    </motion.ul>
                </div>

                <motion.div style={{ y: yImg }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }} className="relative">
                    <div className="absolute -inset-8 bg-[radial-gradient(circle_at_60%_40%,rgba(30,79,214,0.25),transparent_65%)]" />
                    <motion.div
                        ref={frameRef}
                        onMouseMove={onMove}
                        onMouseLeave={onLeave}
                        style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }}
                        data-testid="hero-photo-frame"
                        className="relative overflow-hidden rounded-[2rem] border border-adfr-chrome/25 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                    >
                        <img
                            src={SITE.truck}
                            srcSet="/img/depanneuse-800.webp 800w, /img/depanneuse.webp 1600w"
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            alt="La dépanneuse ADFR en intervention dans les rues d'Île-de-France"
                            className="h-[420px] md:h-[540px] w-full object-cover"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-adfr-night/85 via-transparent to-adfr-night/20" />
                        <div className="absolute top-4 left-4 rounded-full bg-adfr-red px-4 py-2 font-display text-xs font-black uppercase tracking-widest text-white shadow-lg" data-testid="hero-badge-247">
                            24h/24
                        </div>
                        <div className="absolute bottom-4 right-4 rounded-2xl border border-adfr-chrome/30 bg-adfr-night/70 px-4 py-3 text-right backdrop-blur-md" data-testid="hero-badge-delay">
                            <p className="font-display text-2xl font-black text-chrome leading-none">≈ 20 min</p>
                            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">Délai moyen IDF</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
