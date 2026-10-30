import { Link } from "react-router-dom";
import { PhoneCall, MessageCircle, Clock3 } from "lucide-react";
import { SITE, whatsappUrl } from "@/data/site";
import { DEPARTMENTS, CITIES, PARIS_ARR, zoneUrl } from "@/data/zones";
import { track } from "@/lib/api";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="relative bg-[#060D1F] border-t border-adfr-chrome/15 pb-28 md:pb-10">
            <div className="mx-auto max-w-7xl px-4 md:px-8 pt-14 md:pt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1fr]">
                <div>
                    <img src={SITE.logo} alt="ADFR — Auto Dépann France Remorquage" loading="lazy" className="h-14 w-auto rounded-lg bg-white px-2.5 py-1.5" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-xs">
                        Dépannage et remorquage toutes marques, 24h/24 et 7j/7, partout en Île-de-France. Devis gratuit par téléphone, paiement sur place.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                        <a
                            href={SITE.phoneHref}
                            data-testid="footer-call-button"
                            onClick={() => track("call", "/footer")}
                            className="inline-flex w-fit items-center gap-3 bg-adfr-red text-white font-display font-extrabold uppercase tracking-wide rounded-full px-6 py-3 shadow-[0_0_24px_rgba(227,6,19,0.3)] transition-colors hover:bg-[#c00511]"
                        >
                            <PhoneCall className="size-4 animate-ring" />
                            {SITE.phoneDisplay}
                        </a>
                        <a
                            href={whatsappUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="footer-whatsapp-button"
                            onClick={() => track("whatsapp", "/footer")}
                            className="inline-flex w-fit items-center gap-3 text-sm font-bold text-adfr-wa hover:text-white transition-colors"
                        >
                            <MessageCircle className="size-4" /> WhatsApp : +33 6 52 66 47 49
                        </a>
                    </div>
                </div>

                <div>
                    <p className="font-display font-extrabold uppercase tracking-widest text-xs text-slate-400 mb-5">Départements</p>
                    <ul className="space-y-2.5">
                        {DEPARTMENTS.map((d) => (
                            <li key={d.slug}>
                                <Link to={zoneUrl(d)} data-testid={`footer-zone-${d.slug}`} className="text-sm text-slate-300 hover:text-white transition-colors">
                                    <span className="inline-flex items-center justify-center min-w-8 mr-2 rounded-md bg-adfr-deep2 border border-adfr-chrome/20 px-1.5 py-0.5 text-xs font-display font-black text-white">
                                        {d.dept}
                                    </span>
                                    {d.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="font-display font-extrabold uppercase tracking-widest text-xs text-slate-400 mb-5">Villes d'intervention</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {CITIES.map((c) => (
                            <li key={c.slug}>
                                <Link to={zoneUrl(c)} data-testid={`footer-city-${c.slug}`} className="text-sm text-slate-300 hover:text-white transition-colors">
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                        Paris et ses 20 arrondissements :{" "}
                        {PARIS_ARR.map((p, i) => (
                            <span key={p.slug}>
                                <Link to={zoneUrl(p)} data-testid={`footer-paris-${p.slug}`} className="text-slate-400 hover:text-white transition-colors">
                                    {p.name.replace("Paris ", "")}
                                </Link>
                                {i < PARIS_ARR.length - 1 ? " · " : ""}
                            </span>
                        ))}
                    </p>
                </div>

                <div>
                    <p className="font-display font-extrabold uppercase tracking-widest text-xs text-slate-400 mb-5">Infos</p>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-start gap-2.5">
                            <Clock3 className="mt-0.5 size-4 text-adfr-red shrink-0" />
                            24h/24 — 7j/7, week-ends et jours fériés
                        </li>
                        <li>Tous assureurs — attestation d'intervention fournie</li>
                        <li>Paiement sur place, carte bancaire ou espèces</li>
                        <li>Intervention en moyenne en 20 minutes en IDF</li>
                        <li className="text-xs text-slate-500 pt-2">Mentions légales : SIRET et coordonnées complètes à compléter (documents en cours).</li>
                    </ul>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 md:px-8 mt-12 pt-6 border-t border-adfr-chrome/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-slate-500">
                <p>
                    © {year} ADFR — Auto Dépann France Remorquage. Toute l'Île-de-France.
                </p>
                <p>Dépannage · Remorquage · Batterie · Crevaison · Carburant · Fourrière</p>
            </div>
        </footer>
    );
}
