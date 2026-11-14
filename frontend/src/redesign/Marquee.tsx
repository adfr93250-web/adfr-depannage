import { TRUST_ITEMS } from "@/redesign/data";

function Row({ outline }: { outline?: boolean }) {
    return (
        <>
            {[0, 1].map((k) => (
                <ul key={k} className="flex shrink-0" aria-hidden={k === 1}>
                    {TRUST_ITEMS.map((item) => (
                        <li key={item} className={`marquee__item display ${outline ? "text-outline" : "text-chrome"}`}>
                            {item}
                            <span className="diamond" aria-hidden="true" />
                        </li>
                    ))}
                </ul>
            ))}
        </>
    );
}

/** Engagements en deux bandes qui défilent en sens inverse ; la vitesse et l'inclinaison suivent le défilement. */
export default function Marquee() {
    return (
        <section className="sheet overflow-hidden border-y border-adfr-chrome/10 bg-adfr-night2 py-4 md:py-6" data-testid="trust-marquee" aria-label="Nos engagements">
            <div className="marquee marquee--run">
                <Row />
            </div>
                    </section>
    );
}
