import { SITE } from "@/redesign/data";
import { Reveal } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

const STATS = [
    { value: 30, prefix: "< ", suffix: " min", label: "Délai moyen en Île-de-France" },
    { value: 24, prefix: "", suffix: "h/24", label: "Du dimanche au vendredi" },
    { value: 8, prefix: "", suffix: "", label: "Départements couverts" },
];

/** La photo du plateau, le texte d'accroche et les chiffres clés — sans blocage du défilement. */
export default function Manifesto() {
    const { t, tr } = useT();
    return (
        <section className="sheet" data-testid="manifesto" aria-label={t("ADFR en quelques chiffres", "ADFR in figures")}>
            <div className="relative flex min-h-[70svh] items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img className="h-full w-full object-cover object-[30%_center] md:object-center" src="/img/flotte-plateau.webp" alt={tr("La dépanneuse plateau prête à partir pour une intervention en Île-de-France")} width={1200} height={720} loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-adfr-night via-adfr-night/75 to-adfr-night/20 md:bg-gradient-to-r md:from-adfr-night md:via-adfr-night/75 md:to-transparent" />
                </div>
                <Reveal className="wrap relative py-16 md:py-24">
                    <p className="eyebrow">ADFR — Auto Dépann France Remorquage</p>
                    <p className="mt-5 max-w-4xl font-display text-[1.45rem] font-extrabold leading-[1.18] tracking-tight text-white sm:text-3xl md:text-[2.6rem] md:leading-[1.12]">{t(SITE.heroText, "On site in under 30 minutes anywhere in the Paris region. Roadside repair or towing for all makes, day and night, Sunday to Friday, public holidays included.")}</p>
                    <dl className="mt-8 grid max-w-3xl grid-cols-3 gap-3 md:mt-12 md:gap-6">
                        {STATS.map((s) => (
                            <div key={s.label} className="border-l border-adfr-red pl-3 md:pl-5">
                                <dd className="display text-chrome whitespace-nowrap text-[1.7rem] sm:text-4xl md:text-6xl">
                                    {s.prefix}
                                    {s.value}
                                    <span className="text-[0.5em]">{s.suffix === "h/24" ? t("h/24", "/7") : s.suffix}</span>
                                </dd>
                                <dt className="mt-2 text-[9px] font-bold uppercase leading-snug tracking-[0.16em] text-slate-300 md:text-[11px] md:tracking-[0.2em]">{tr(s.label)}</dt>
                            </div>
                        ))}
                    </dl>
                </Reveal>
            </div>
        </section>
    );
}
