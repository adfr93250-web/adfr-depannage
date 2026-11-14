import { Link } from "react-router-dom";
import { PhoneCall, MessageCircle, Clock3, ArrowUp } from "lucide-react";
import { SITE, whatsappUrl } from "@/redesign/data";
import { DEPARTMENTS, CITIES, PARIS_ARR, zoneUrl } from "@/data/zones";
import { REDUCED } from "@/redesign/motion";
import { track } from "@/redesign/api";
import { Magnetic, Reveal } from "@/redesign/fx";

/**
 * Pied de page : une vraie photo d'intervention en parallaxe derrière le numéro de téléphone
 * en très grand. Puis toutes les zones et les mentions légales.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    const toTop = () => {
        window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    };

    return (
        <footer className="relative z-[2] bg-adfr-night">
            <div className="chevrons" aria-hidden="true" />
            <div className="foot-cta relative flex min-h-[70svh] flex-col justify-end overflow-hidden pb-14 pt-24 md:pb-20">
                <img src="/img/intervention-pluie.webp" alt="" loading="lazy" decoding="async" className="foot-photo absolute inset-0 h-full w-full object-cover object-[35%_center]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-adfr-night via-adfr-night/55 to-adfr-night" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-adfr-night/85 to-transparent" aria-hidden="true" />
                <div className="wrap relative">
                    <p className="foot-fade eyebrow">
                        <span className="pulse-dot" /> Une panne maintenant ?
                    </p>
                    <p className="foot-fade mt-5 max-w-2xl font-display text-2xl font-extrabold tracking-tight text-white md:text-4xl">Le dépanneur le plus proche part immédiatement, jour et nuit.</p>
                    <a href={SITE.phoneHref} data-testid="footer-call-button" data-cursor="Appeler" onClick={() => track("call", "/footer", "Pied de page")} className="group mt-8 block w-fit overflow-hidden" aria-label={`Appeler le ${SITE.phoneDisplay}`}>
                        <span className="foot-number display block whitespace-nowrap text-[13.2vw] leading-[0.9] text-white transition-colors duration-500 group-hover:text-adfr-red lg:text-[11.5vw]" aria-hidden="true">
                            {SITE.phoneDisplay}
                        </span>
                    </a>
                    <div className="foot-fade mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Magnetic>
                            <a href={SITE.phoneHref} data-cursor="Appeler" onClick={() => track("call", "/footer", "Pied de page")} className="btn btn-call w-full px-8 py-5 text-lg sm:w-auto">
                                <PhoneCall className="size-5 animate-ring" aria-hidden="true" /> Appeler maintenant
                            </a>
                        </Magnetic>
                        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" data-testid="footer-whatsapp-button" onClick={() => track("whatsapp", "/footer", "Pied de page")} className="btn btn-wa px-7 py-5 text-base !normal-case !tracking-normal">
                            <MessageCircle className="size-5 text-adfr-wa" aria-hidden="true" /> WhatsApp : {SITE.whatsappDisplay}
                        </a>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-300 sm:ml-4">
                            <Clock3 className="size-4 text-adfr-red" aria-hidden="true" /> {SITE.hours.long}, {SITE.hours.days}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden border-t border-adfr-chrome/15 bg-adfr-night/90 pb-32 backdrop-blur-2xl md:pb-10">
                <Reveal className="wrap grid gap-12 pt-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.25fr_1.1fr]" stagger={0.08}>
                    <div>
                        <img src={SITE.logo} alt={SITE.fullName} loading="lazy" width={1042} height={435} className="h-16 w-auto rounded-xl bg-white px-3 py-1.5" />
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">Dépannage et remorquage toutes marques, {SITE.hours.long}, partout en Île-de-France. Intervention rapide, paiement sur place.</p>
                        <button type="button" onClick={toTop} className="group mt-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-white" data-testid="back-to-top">
                            <span className="grid size-11 place-items-center rounded-full border border-adfr-chrome/25 transition-all duration-500 ease-expo group-hover:-translate-y-1 group-hover:border-adfr-red group-hover:bg-adfr-red">
                                <ArrowUp className="size-4" aria-hidden="true" />
                            </span>
                            Haut de page
                        </button>
                    </div>

                    <div>
                        <p className="mb-5 font-display text-xs font-extrabold uppercase tracking-widest text-slate-400">Départements</p>
                        <ul className="space-y-2.5">
                            {DEPARTMENTS.map((d) => (
                                <li key={d.slug}>
                                    <Link to={zoneUrl(d)} data-testid={`footer-zone-${d.slug}`} className="group inline-flex items-center text-sm text-slate-300 transition-colors hover:text-white">
                                        <span className="mr-2.5 inline-flex min-w-8 items-center justify-center rounded-md border border-adfr-chrome/20 bg-adfr-deep2 px-1.5 py-0.5 font-display text-xs font-black text-white transition-colors group-hover:border-adfr-red group-hover:bg-adfr-red">{d.dept}</span>
                                        <span className="link-line">{d.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="mb-5 font-display text-xs font-extrabold uppercase tracking-widest text-slate-400">Villes d'intervention</p>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {CITIES.map((c) => (
                                <li key={c.slug}>
                                    <Link to={zoneUrl(c)} data-testid={`footer-city-${c.slug}`} className="link-line text-sm text-slate-300 transition-colors hover:text-white">
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-xs leading-relaxed text-slate-500">
                            Paris et ses 20 arrondissements :{" "}
                            {PARIS_ARR.map((p, i) => (
                                <span key={p.slug}>
                                    <Link to={zoneUrl(p)} data-testid={`footer-paris-${p.slug}`} className="text-slate-400 transition-colors hover:text-white">
                                        {p.name.replace("Paris ", "")}
                                    </Link>
                                    {i < PARIS_ARR.length - 1 ? " · " : ""}
                                </span>
                            ))}
                        </p>
                    </div>

                    <div>
                        <p className="mb-5 font-display text-xs font-extrabold uppercase tracking-widest text-slate-400">Infos</p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex items-start gap-2.5">
                                <Clock3 className="mt-0.5 size-4 shrink-0 text-adfr-red" aria-hidden="true" />
                                {SITE.hours.long}, {SITE.hours.days}
                            </li>
                            <li>Paiement sur place, carte bancaire ou espèces</li>
                            <li>Intervention en moyenne {SITE.delay.long} en IDF</li>
                            <li className="pt-2 text-xs leading-relaxed text-slate-500" data-testid="legal-mentions">
                                <span className="font-bold text-slate-400">Mentions légales</span> — Éditeur : ADFR AUTO DEPANN FRANCE REMORQUAGE, SAS au capital de 1 000 €. Siège : 30 boulevard Carnot, 93250 Villemomble. RCS Bobigny 131 872 509. SIRET 131 872 509 00016. N° TVA intracommunautaire : FR32131872509. Téléphone : 01 85 80 00 61. Email :{" "}
                                <a href="mailto:adfr93250@gmail.com" className="underline-offset-2 hover:underline">
                                    adfr93250@gmail.com
                                </a>
                                .
                                <br />
                                Hébergeur : IONOS SARL — 7 place de la Gare, BP 70109, 57201 Sarreguemines Cedex, France — Tél. 0970 808 911.
                            </li>
                        </ul>
                    </div>
                </Reveal>
                <div className="wrap mt-12 flex flex-col items-start justify-between gap-2 border-t border-adfr-chrome/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center">
                    <p>
                        © {year} {SITE.legalLine}
                    </p>
                    <p>Dépannage · Remorquage · Batterie · Crevaison · Carburant · Désembourbage</p>
                </div>
            </div>
        </footer>
    );
}
