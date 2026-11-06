import { BRAND } from "@/data/brand";
const ITEMS = [
    "24/7 — 7j/7",
    `Intervention ${BRAND.delay.long}`,
    "Dépannage sur place ou remorquage",
    "Paiement sur place",
    "Toute l'Île-de-France",
    "Week-ends et jours fériés",
];

export default function TrustMarquee() {
    return (
        <section className="relative border-y border-adfr-chrome/15 bg-adfr-night2 py-4 md:py-5" data-testid="trust-marquee" aria-label="Nos engagements">
            <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 md:px-8">
                {ITEMS.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-chrome font-display font-extrabold uppercase tracking-[0.16em] text-[11px] md:text-sm whitespace-nowrap">
                        <span className="size-1.5 rotate-45 rounded-[1px] bg-adfr-red shrink-0" aria-hidden="true" />
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    );
}
