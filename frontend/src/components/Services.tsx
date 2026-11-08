import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/site";
import { SITE } from "@/data/site";
import { track, gtagConversion } from "@/lib/api";
import { useLocation } from "react-router-dom";

const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-6", "md:col-span-6"];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ServicesProps {
    eyebrow?: string;
    title?: string;
    sub?: string;
}

export default function Services({ eyebrow = "Nos services", title = "Du dépannage express au remorquage complet", sub = "Un appel suffit : on vous dit tout de suite ce qu'on peut faire et quand un dépanneur peut partir." }: ServicesProps) {
    const { pathname } = useLocation();
    return (
        <section id="services" className="relative py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-12 md:mb-16 max-w-3xl"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">{eyebrow}</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h2>
                    <p className="mt-4 text-slate-400 leading-relaxed">{sub}</p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-5"
                >
                    {SERVICES.map((s, i) => (
                        <motion.article
                            key={s.title}
                            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                            data-testid={`service-card-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                            className={`group relative overflow-hidden rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/50 p-6 md:p-7 transition-colors duration-300 hover:border-adfr-electric/70 hover:bg-adfr-deep2/80 ${SPANS[i]} h-full`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <span className="grid place-items-center size-12 rounded-xl bg-adfr-electric/15 border border-adfr-electric/40 text-adfr-electricLight transition-colors duration-300 group-hover:text-white group-hover:bg-adfr-electric/30">
                                    <s.icon className="size-6" />
                                </span>
                                <span className="font-display font-black text-4xl text-adfr-chrome/15 select-none">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            {s.image && (
                                <img
                                    src={s.image.src}
                                    alt={s.image.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="mt-5 h-44 md:h-52 w-full rounded-xl object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] border border-adfr-chrome/15"
                                    data-testid={`service-image-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                />
                            )}
                            <h3 className="mt-5 font-display text-lg font-bold text-white">{s.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                            <a
                                href={SITE.phoneHref}
                                data-testid={`service-call-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                onClick={() => { track("call", pathname); gtagConversion("call"); }}
                                className="mt-2 inline-flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-widest text-adfr-redLight hover:text-white transition-colors"
                            >
                                Appeler pour ce service <ArrowRight className="size-3.5" />
                            </a>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
