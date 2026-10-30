import { motion } from "framer-motion";

// PHOTOS D'EXEMPLE (Unsplash) — à remplacer par les photos réelles de la flotte ADFR dès réception
const PHOTOS = [
    {
        src: "/img/flotte-plateau.webp",
        alt: "La dépanneuse plateau ADFR prête à partir en intervention dans une rue d'Île-de-France",
        caption: "Plateau prêt à partir",
        span: "md:col-span-6",
    },
    {
        src: "https://images.unsplash.com/photo-1693718641851-fd3ac0b7af4e?q=80&w=1200&auto=format&fit=crop",
        alt: "Démarrage d'une voiture avec câbles de batterie",
        caption: "Batterie & démarrage",
        span: "md:col-span-6",
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
                    className="grid grid-cols-1 md:grid-cols-12 gap-4"
                    data-testid="gallery"
                >
                    {PHOTOS.map((p) => (
                        <motion.figure
                            key={p.src}
                            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                            data-testid={`gallery-photo-${p.caption.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                            className={`group relative overflow-hidden rounded-2xl border border-adfr-chrome/15 ${p.span} h-56 md:h-72`}
                        >
                            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-adfr-night/60 via-transparent to-transparent" />
                            <figcaption className="absolute bottom-3 left-3 rounded-full bg-adfr-night/70 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                                {p.caption}
                            </figcaption>
                        </motion.figure>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
