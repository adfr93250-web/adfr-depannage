const ITEMS = [
    "24/7 — 7j/7",
    "Intervention en 20 min",
    "Dépannage sur place ou remorquage",
    "Paiement sur place",
    "Toute l'Île-de-France",
    "Week-ends et jours fériés",
];

function Track() {
    return (
        <div className="flex items-center gap-10 pr-10 w-max animate-marquee">
            {ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-10">
                    <span className="text-chrome font-display font-extrabold uppercase tracking-[0.18em] text-sm md:text-base whitespace-nowrap">{item}</span>
                    <span className="size-1.5 rotate-45 rounded-[1px] bg-adfr-red shrink-0" />
                </span>
            ))}
        </div>
    );
}

export default function TrustMarquee() {
    return (
        <section className="marquee relative overflow-hidden border-y border-adfr-chrome/15 bg-[#070E1C] py-5" data-testid="trust-marquee" aria-label="Nos engagements">
            <div className="flex w-max animate-marquee">
                <Track />
                <div aria-hidden="true" className="flex">
                    <Track />
                </div>
            </div>
        </section>
    );
}
