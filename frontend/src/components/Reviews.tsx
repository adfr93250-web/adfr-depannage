import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { REVIEWS } from "@/data/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Reviews() {
    return (
        <section id="avis" className="relative py-20 md:py-28 bg-[#070E1C] border-y border-adfr-chrome/10">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-12 md:mb-16 max-w-3xl"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Avis clients</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Ils sont tombés en panne. Ils s'en souviennent.</h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {REVIEWS.map((r) => (
                        <motion.figure
                            key={r.name}
                            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                            data-testid={`review-card-${r.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                            className="h-full rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/50 p-6 flex flex-col"
                        >
                            <div className="flex gap-1" aria-label={`${r.stars} étoiles sur 5`}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`size-4 ${i < r.stars ? "fill-[#FFC531] text-[#FFC531]" : "text-slate-600"}`} />
                                ))}
                            </div>
                            <blockquote className="mt-4 text-sm leading-relaxed text-slate-200 flex-1">&ldquo;{r.text}&rdquo;</blockquote>
                            <figcaption className="mt-5 pt-4 border-t border-adfr-chrome/10">
                                <span className="text-sm font-bold text-white">{r.name}</span>
                                <span className="ml-2 text-xs text-slate-500">{r.city}</span>
                            </figcaption>
                        </motion.figure>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
