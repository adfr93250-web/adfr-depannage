import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SERVICES, SITE, type ServiceItem } from "@/redesign/data";
import { track } from "@/redesign/api";
import { SplitLines, Reveal, useTilt } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

interface ServicesProps {
    eyebrow?: string;
    title?: string;
    sub?: string;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

function Card({ s, i }: { s: ServiceItem; i: number }) {
    const { pathname } = useLocation();
    const { t, tr } = useT();
    const ref = useTilt<HTMLElement>(5);
    return (
        <article ref={ref} data-testid={`service-card-${slug(s.title)}`} className="svc-card h-[24rem] w-full md:h-[27rem]">
            <img src={s.image.src} alt={tr(s.image.alt)} loading="lazy" decoding="async" className="svc-card__img" style={{ objectPosition: s.pos }} data-testid={`service-image-${slug(s.title)}`} />
            <div className="svc-card__glare" />
            <div className="absolute inset-0 z-[2] flex flex-col justify-between p-6 md:p-8" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-start justify-between">
                    <span className="glass grid size-14 place-items-center rounded-2xl text-white">
                        <s.icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="display text-outline text-6xl md:text-7xl" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                    </span>
                </div>
                <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[1.75rem]">{tr(s.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{tr(s.desc)}</p>
                    <a href={SITE.phoneHref} data-testid={`service-call-${slug(s.title)}`} data-cursor="Appeler" onClick={() => track("call", pathname, "Services")} className="mt-5 inline-flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-[0.18em] text-adfr-redLight transition-colors hover:text-white">
                        {t("Appeler pour ce service", "Call for this service")} <ArrowRight className="svc-card__arrow size-4" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </article>
    );
}

/** Services : une grille que l'on parcourt d'un coup d'œil, sans défilement bloqué. */
export default function Services({ eyebrow = "Nos services", title = "Du dépannage express au remorquage complet", sub = "Un appel suffit : on vous dit tout de suite ce qu'on peut faire et quand un dépanneur peut partir." }: ServicesProps) {
    const { tr } = useT();
    return (
        <section id="services" className="sheet py-16 md:py-24">
            <div className="wrap">
                <header className="max-w-3xl">
                    <p className="eyebrow">{tr(eyebrow)}</p>
                    <SplitLines className="h-section mt-5 text-white">{tr(title)}</SplitLines>
                    <p className="mt-5 max-w-xl leading-relaxed text-slate-400">{tr(sub)}</p>
                </header>
                <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.04} y={16}>
                    {SERVICES.map((s, i) => (
                        <div key={s.title}>
                            <Card s={s} i={i} />
                        </div>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
