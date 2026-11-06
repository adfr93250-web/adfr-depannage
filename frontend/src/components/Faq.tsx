import { motion } from "framer-motion";
import type { FaqItem } from "@/data/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FaqProps {
    items: FaqItem[];
    title?: string;
}

/** FAQ entièrement visible : questions et réponses sont dans le HTML rendu (pas de contenu chargé au clic). */
export default function Faq({ items, title = "Vos questions, nos réponses directes." }: FaqProps) {
    return (
        <section id="faq" className="relative py-20 md:py-28">
            <div className="mx-auto max-w-3xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-10 md:mb-12"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">FAQ</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h2>
                </motion.div>

                <dl className="divide-y divide-adfr-chrome/15 rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/40 px-6" data-testid="faq-list">
                    {items.map((it, i) => (
                        <motion.div
                            key={it.q}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
                            className="py-5 md:py-6"
                            data-testid={`faq-item-${i}`}
                        >
                            <dt className="flex items-start gap-3 text-white font-display font-bold text-base md:text-lg">
                                <span className="mt-2 size-1.5 rotate-45 rounded-[1px] bg-adfr-red shrink-0" aria-hidden="true" />
                                {it.q}
                            </dt>
                            <dd className="mt-2 pl-[18px] text-sm md:text-base leading-relaxed text-slate-300">{it.a}</dd>
                        </motion.div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
