import { Star, ExternalLink, Quote } from "lucide-react";
import { REVIEWS, SITE } from "@/redesign/data";
import { SplitLines, Magnetic } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

/**
 * Avis : les trois vrais avis Google, lisibles d'une traite.
 */
export default function Reviews() {
    const { t, tr } = useT();
    return (
        <section id="avis" className="sheet py-24 md:py-36">
            <div className="wrap">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="eyebrow">{t("Avis clients", "Customer reviews")}</p>
                        <SplitLines className="h-section mt-5 text-white">
                            {t("Ce que disent", "What our")} <span className="italic text-chrome">{t("nos clients", "customers say")}</span>
                        </SplitLines>
                    </div>
                    <Magnetic strength={0.25}>
                        <a href={SITE.googleReviewsUrl} target="_blank" rel="noopener noreferrer" data-testid="google-reviews-link" className="btn btn-ghost px-6 py-3.5 text-sm !normal-case !tracking-normal">
                            {t("Voir tous nos avis sur Google", "See all our reviews on Google")} <ExternalLink className="size-4" aria-hidden="true" />
                        </a>
                    </Magnetic>
                </div>

                <div className="mt-10 space-y-5">
                    {REVIEWS.map((r, i) => (
                        <div key={r.name} className="rev-card lg:pb-6">
                            <figure className="rev-inner glass grid origin-top overflow-hidden rounded-[2rem] lg:grid-cols-[0.6fr_1.4fr]" data-testid={`review-card-${i + 1}`}>
                                <div className="rev-photo relative h-64 overflow-hidden lg:h-auto">
                                    <img src={r.photo.src} alt={r.photo.alt} loading="lazy" decoding="async" className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-adfr-night/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-adfr-night/40" />
                                    <span className="display absolute left-5 top-4 text-6xl text-white/90 mix-blend-overlay">0{i + 1}</span>
                                </div>
                                <div className="flex flex-col justify-between gap-8 p-6 md:p-10 lg:p-14">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1.5" role="img" aria-label={t(`${r.stars} étoiles sur 5`, `${r.stars} stars out of 5`)}>
                                                {Array.from({ length: 5 }).map((_, k) => (
                                                    <Star key={k} className={`rev-star size-5 ${k < r.stars ? "fill-[#FFC531] text-[#FFC531]" : "text-slate-600"}`} aria-hidden="true" />
                                                ))}
                                            </div>
                                            <Quote className="size-10 text-adfr-red/70" aria-hidden="true" />
                                        </div>
                                        <blockquote className={`mt-6 font-display font-semibold leading-snug tracking-tight text-slate-100 ${r.text.length < 120 ? "text-2xl md:text-4xl" : "text-base md:text-xl lg:text-[1.35rem] lg:leading-[1.45]"}`}>&ldquo;{tr(r.text)}&rdquo;</blockquote>
                                    </div>
                                    <figcaption className="flex items-center gap-4 border-t border-adfr-chrome/15 pt-5">
                                        <span className="grid size-12 place-items-center rounded-full bg-adfr-electric font-display text-lg font-black text-white">{r.name[0]}</span>
                                        <span>
                                            <span className="block font-display text-base font-extrabold text-white">{r.name}</span>
                                            <span className="text-xs text-slate-400">{tr(r.meta)}</span>
                                        </span>
                                    </figcaption>
                                </div>
                            </figure>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
