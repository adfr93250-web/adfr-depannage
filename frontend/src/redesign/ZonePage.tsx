import { useRef } from "react";
import Seo, { localBusinessLd, faqPageLd } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, MapPin, ArrowUpRight } from "lucide-react";
import Services from "@/redesign/Services";
import Urgence from "@/redesign/Urgence";
import Faq from "@/redesign/Faq";
import PositionSection from "@/redesign/PositionSection";
import CallbackForm from "@/redesign/CallbackForm";
import { CallButton, WhatsAppButton } from "@/redesign/CTAButtons";
import { SplitLines, Reveal } from "@/redesign/fx";
import NotFound from "@/pages/NotFound";
import { getZone, zoneUrl, citiesOfDept, deptOf, type Zone } from "@/data/zones";
import { LOCAL_CONTENT } from "@/data/zoneContent";
import { brandText, faqZone, interventions, SITE } from "@/redesign/data";

function LocalHero({ zone }: { zone: Zone }) {
    const ref = useRef<HTMLElement>(null);
    const isDept = zone.type === "dept";
    const big = isDept ? zone.slug : zone.type === "paris" ? zone.cp.slice(-2) : zone.dept;

    return (
        <section ref={ref} className="sheet relative overflow-hidden" data-testid="zone-hero">
            <div className="pointer-events-none absolute -top-40 right-[-10%] size-[40rem] rounded-full bg-adfr-electric/25 blur-[150px]" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-[-30%] left-[-10%] size-[32rem] rounded-full bg-adfr-red/15 blur-[150px]" aria-hidden="true" />
            <p className="zh-big display text-outline pointer-events-none absolute -right-[4vw] top-16 text-[62vw] leading-none opacity-30 md:text-[38vw]" aria-hidden="true">
                {big}
            </p>
            <div className="wrap relative flex min-h-[80svh] flex-col justify-end pb-14 pt-32 md:pb-20">
                <nav aria-label="Fil d'Ariane" className="zh-fade mb-8 flex flex-wrap items-center gap-1.5 text-xs text-slate-400" data-testid="zone-breadcrumb">
                    <Link to="/" className="link-line hover:text-white">Accueil</Link>
                    <ChevronRight className="size-3" aria-hidden="true" />
                    <Link to="/" className="link-line hover:text-white">Île-de-France</Link>
                    <ChevronRight className="size-3" aria-hidden="true" />
                    <Link to={`/depannage-${zone.dept}`} className="link-line hover:text-white">{zone.deptName}</Link>
                    {!isDept && (
                        <>
                            <ChevronRight className="size-3" aria-hidden="true" />
                            <span className="text-slate-200">{zone.name}</span>
                        </>
                    )}
                </nav>

                <p className="zh-fade glass inline-flex w-fit items-center gap-3 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-200 sm:text-[11px]" data-testid="zone-eyebrow">
                    <span className="pulse-dot" />
                    Dépannage {SITE.hours.tag} — {zone.deptName}
                    {zone.cp ? ` · ${zone.cp}` : ""}
                </p>

                <h1 className="zh-title display mt-6 max-w-6xl text-[clamp(2.1rem,6.4vw,6.2rem)] text-white" data-testid="zone-h1">
                    Dépannage &amp; remorquage <span className="italic text-adfr-red">{isDept ? zone.deptIn : `à ${zone.name}`}</span> — {SITE.delay.long}, 24h/24.
                </h1>

                <p className="zh-fade mt-7 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{brandText(zone.intro)} Intervention rapide, paiement sur place.</p>

                <div className="zh-fade mt-8 flex flex-col gap-3 sm:flex-row">
                    <CallButton testId="zone-call-hero" className="w-full sm:w-auto" />
                    <WhatsAppButton testId="zone-whatsapp-hero" place={zone.name} className="w-full sm:w-auto" />
                </div>

                <div className="zh-fade mt-8 flex flex-wrap items-center gap-2 text-xs text-slate-400" data-testid="zone-spots">
                    <MapPin className="size-4 text-adfr-red" aria-hidden="true" />
                    <span className="mr-1 font-semibold uppercase tracking-widest">Nous connaissons :</span>
                    {zone.spots.map((s) => (
                        <span key={s} className="chip">{s}</span>
                    ))}
                </div>
            </div>
            <div className="chevrons" aria-hidden="true" />
        </section>
    );
}

function LocalContent({ zone }: { zone: Zone }) {
    const isDept = zone.type === "dept";
    const extra = LOCAL_CONTENT[zone.slug];
    return (
        <section className="sheet py-20 md:py-32">
            <div className="wrap grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                <div className="border-l-2 border-adfr-red pl-6 md:pl-10" data-testid="zone-local-content">
                    <SplitLines className="h-section !text-[clamp(1.7rem,3.4vw,3rem)] text-white">{isDept ? `Votre dépanneur connaît ${zone.deptName}` : `Votre dépanneur connaît ${zone.name}`}</SplitLines>
                    <Reveal className="mt-6 space-y-4 leading-relaxed text-slate-300 md:text-lg" stagger={0.1}>
                        <p>
                            {isDept
                                ? `En ${zone.deptName.replace(/^(les|le|la) /i, "")} comme partout en Île-de-France, nos équipes connaissent ${zone.axes}.`
                                : `Nos équipes connaissent ${zone.axes}, au plus près de ${zone.spots[0].toLowerCase()} et des quartiers voisins.`}{" "}
                            Batterie, crevaison, carburant, accident ou remorquage : dans la grande majorité des cas, tout se règle sur place et vous repartez. Nous intervenons en ville, sur les routes départementales et nationales.
                        </p>
                        {extra && <p data-testid="zone-unique-text">{brandText(extra.texte)}</p>}
                        <p className="text-sm text-slate-400">Le paiement se fait sur place, après l'intervention, par carte bancaire ou en espèces.</p>
                    </Reveal>
                </div>

                <Reveal className="glass h-fit rounded-[2rem] p-6 md:p-9" delay={0.1} data-testid="zone-interventions">
                    <h3 className="font-display text-xl font-extrabold text-white">Interventions fréquentes</h3>
                    <ul className="mt-6 space-y-4">
                        {interventions(zone.name).map((it) => (
                            <li key={it} className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-adfr-red" aria-hidden="true" />
                                {it}
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    );
}

function RelatedZones({ zone }: { zone: Zone }) {
    const isDept = zone.type === "dept";
    const targets = isDept ? citiesOfDept(zone.dept) : zone.neighbors.map((s) => getZone(s)).filter((z): z is Zone => Boolean(z) && z!.slug !== zone.dept);
    const dept = deptOf(zone.dept);
    return (
        <section className="sheet border-y border-adfr-chrome/10 bg-adfr-night2 py-20 md:py-32" data-testid="zone-related">
            <div className="wrap">
                <p className="eyebrow">Zones voisines</p>
                <SplitLines className="h-section mt-5 !text-[clamp(1.7rem,3.4vw,3rem)] text-white">{isDept ? "Nous intervenons aussi à" : `Nous intervenons aussi autour de ${zone.name}`}</SplitLines>
                <Reveal className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" stagger={0.04} y={24}>
                    {dept && !isDept && (
                        <div><Link to={zoneUrl(dept)} data-testid={`zone-link-dept-${dept.slug}`} data-cursor="Voir" className="group block h-full rounded-3xl border border-adfr-red/40 bg-adfr-red/10 p-5 transition-all duration-500 ease-expo hover:-translate-y-1.5 hover:bg-adfr-red/25">
                            <span className="display text-4xl text-white">{dept.slug}</span>
                            <p className="mt-2 text-sm font-semibold text-adfr-redLight">{dept.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">Tout le département</p>
                        </Link></div>
                    )}
                    {targets.map((z) => (
                        <div key={z.slug}><Link to={zoneUrl(z)} data-testid={`zone-link-${z.slug}`} data-cursor="Voir" className="group relative block h-full rounded-3xl border border-adfr-chrome/15 bg-adfr-deep2/40 p-5 transition-all duration-500 ease-expo hover:-translate-y-1.5 hover:border-adfr-electric hover:bg-adfr-deep2/90 hover:shadow-[0_30px_60px_-30px_rgba(30,79,214,0.9)]">
                            <ArrowUpRight className="absolute right-4 top-4 size-4 text-slate-500 transition-all duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
                            {z.type === "dept" && <span className="display text-chrome text-4xl">{z.slug}</span>}
                            <p className="mt-2 pr-5 text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">{z.type === "dept" ? z.name : `Dépannage à ${z.name}`}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{z.type === "dept" ? "Département" : z.cp || z.deptName}</p>
                        </Link></div>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}

export default function ZonePage() {
    const { slug } = useParams<{ slug: string }>();
    const zone = slug?.startsWith("depannage-") ? getZone(slug.replace("depannage-", "")) : undefined;

    if (!zone) return <div className="relative z-[2] min-h-screen bg-adfr-night pt-20 md:pt-24"><NotFound /></div>;
    const isDept = zone.type === "dept";
    const extra = LOCAL_CONTENT[zone.slug];
    const faqs = extra ? [...faqZone(zone.name), { q: brandText(extra.faq4.q), a: brandText(extra.faq4.a) }] : faqZone(zone.name);

    const title = isDept ? `Dépannage ${zone.deptIn} ${SITE.hours.tag} — ${SITE.name}` : `Dépannage à ${zone.name} ${SITE.hours.tag} — ${SITE.name}`;
    const description = `Panne ${isDept ? zone.deptIn : `à ${zone.name}`} ? ${SITE.name} intervient ${SITE.hours.long}, en moyenne ${SITE.delay.long}. ${zone.cp ? `${zone.cp} — ` : ""}Appelez le ${SITE.phoneDisplay} : intervention rapide, paiement sur place.`;

    return (
        <div key={zone.slug}>
            <Seo title={title} description={description} path={`/depannage-${zone.slug}`} jsonLd={[localBusinessLd(zone), faqPageLd(faqs)]} />
            <LocalHero zone={zone} />
            <Urgence />
            <LocalContent zone={zone} />
            <Services eyebrow="Nos services" title={isDept ? `Tous nos services de dépannage ${zone.deptIn}` : `Tous nos services de dépannage à ${zone.name}`} sub="Un seul appel : on vous dit tout de suite ce qu'on peut faire et quand un dépanneur peut partir." />
            <RelatedZones zone={zone} />
            <Faq items={faqs} title={isDept ? `Questions fréquentes ${zone.deptIn}` : `Questions fréquentes à ${zone.name}`} />
            <CallbackForm defaultLieu={zone.name} />
            <PositionSection />
        </div>
    );
}
