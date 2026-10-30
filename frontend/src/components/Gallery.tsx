import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { SITE } from "@/data/site";
import { track } from "@/lib/api";

// PHOTOS RÉELLES ADFR (plateau + combi arrimé) + 1 photo d'exemple batterie à remplacer
const PHOTOS = [
    {
        src: "/img/flotte-plateau.webp",
        alt: "La dépanneuse plateau ADFR prête à partir en intervention dans une rue d'Île-de-France",
        caption: "Plateau prêt à partir",
        span: "md:col-span-7",
        frame: "h-56 md:h-full",
    },
    {
        src: "/img/flotte-van.webp",
        alt: "Un combi Volkswagen chargé et arrimé sur le plateau de la dépanneuse ADFR",
        caption: "Arrimage sécurisé",
        span: "md:col-span-5 md:row-span-2",
        frame: "h-96 md:h-full",
    },
    {
        src: "https://images.unsplash.com/photo-1693718641851-fd3ac0b7af4e?q=80&w=1200&auto=format&fit=crop",
        alt: "Démarrage d'une voiture avec câbles de batterie",
        caption: "Batterie & démarrage",
        span: "md:col-span-7",
        frame: "h-56 md:h-full",
    },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Gallery() {
    return (
        <section id="flotte" className="relative py-20 md:py-28 bg-[#070E1C] border-y border-adfr-chrome/10">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-12 md:mb-16 max-w-3xl"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Sur le terrain</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">En intervention, jour et nuit, dans toute l'Île-de-France.</h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{ show: { transition: { staggerChildren: 0.09 } } }}
                    className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[272px] gap-4"
                    data-testid="gallery"
                >
                    {PHOTOS.map((p) => (
                        <motion.figure
                            key={p.src}
                            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                            data-testid={`gallery-photo-${p.caption.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                            className={`group relative overflow-hidden rounded-2xl border border-adfr-chrome/15 ${p.span} ${p.frame}`}
                        >
                            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-adfr-night/60 via-transparent to-transparent" />
                            <figcaption className="absolute bottom-3 left-3 rounded-full bg-adfr-night/70 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                                {p.caption}
                            </figcaption>
                        </motion.figure>
                    ))}

                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                        className="md:col-span-12 h-56 md:h-auto md:py-8 rounded-2xl border border-adfr-red/40 bg-gradient-to-br from-adfr-deep2 to-adfr-deep px-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        data-testid="gallery-cta"
                    >
                        <div>
                            <p className="font-display text-xl md:text-2xl font-extrabold text-white">Une panne maintenant ?</p>
                            <p className="mt-1 text-sm text-slate-300 leading-relaxed">Le dépanneur le plus proche part immédiatement, jour et nuit.</p>
                        </div>
                        <a
                            href={SITE.phoneHref}
                            data-testid="gallery-call-button"
                            onClick={() => track("call", "/galerie")}
                            className="inline-flex w-fit items-center gap-2.5 bg-adfr-red hover:bg-[#c00511] text-white font-display font-extrabold uppercase tracking-wide rounded-full px-6 py-3.5 text-sm md:text-base shadow-[0_0_24px_rgba(227,6,19,0.35)] transition-colors active:scale-[0.97]"
                        >
                            <PhoneCall className="size-4 animate-ring" />
                            {SITE.phoneDisplay}
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
