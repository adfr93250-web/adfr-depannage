import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import Seo, { localBusinessLd, faqPageLd } from "@/components/Seo";
import Services from "@/components/Services";
import Faq from "@/components/Faq";
import CallbackForm from "@/components/CallbackForm";
import { CallButton, WhatsAppButton } from "@/components/CTAButtons";
import NotFound from "@/pages/NotFound";
import { getZone, zoneUrl, citiesOfDept, deptOf, type Zone } from "@/data/zones";
import { faqZone, interventions } from "@/data/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function LocalHero({ zone }: { zone: Zone }) {
    const isDept = zone.type === "dept";
    const h1 = isDept ? `Dépannage & remorquage ${zone.deptIn}, 24h/24` : `Dépannage & remorquage à ${zone.name}, 24h/24`;
    return (
        <section className="relative overflow-hidden bg-adfr-night">
            <div className="pointer-events-none absolute -top-40 right-[-10%] size-[560px] rounded-full bg-adfr-electric/20 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-[-30%] left-[-10%] size-[460px] rounded-full bg-adfr-red/10 blur-[140px]" />
            <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-8 md:pt-14 pb-16 md:pb-20">
                <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-7" data-testid="zone-breadcrumb">
                    <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
                    <ChevronRight className="size-3" />
                    <Link to="/" className="hover:text-white transition-colors">Île-de-France</Link>
                    <ChevronRight className="size-3" />
                    <Link to={zoneUrl(zone)} className="hover:text-white transition-colors">{zone.deptName}</Link>
                    {!isDept && (
                        <>
                            <ChevronRight className="size-3" />
                            <span className="text-slate-300">{zone.name}</span>
                        </>
                    )}
                </nav>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="inline-flex items-center gap-2.5 rounded-full border border-adfr-chrome/25 bg-adfr-deep/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300" data-testid="zone-eyebrow">
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-adfr-red opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-adfr-red" />
                    </span>
                    Dépannage 24/7 — {zone.deptName}
                    {zone.cp ? ` · ${zone.cp}` : ""}
                </motion.div>

                <h1 className="mt-6 max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.98] tracking-tight text-white" data-testid="zone-h1">
                    Dépannage &amp; remorquage <span className="text-adfr-red">{isDept ? zone.deptIn : `à ${zone.name}`}</span> — en 20 minutes, 24h/24.
                </h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 }} className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-300">
                    {zone.intro} Intervention rapide, paiement sur place.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.4 }} className="mt-8 flex flex-col sm:flex-row gap-3">
                    <CallButton testId="zone-call-hero" className="w-full sm:w-auto" />
                    <WhatsAppButton testId="zone-whatsapp-hero" place={zone.name} className="w-full sm:w-auto" />
                </motion.div>

                <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-slate-400" data-testid="zone-spots">
                    <MapPin className="size-4 text-adfr-red" />
                    <span className="font-semibold uppercase tracking-widest mr-1">Nous connaissons :</span>
                    {zone.spots.map((s) => (
                        <span key={s} className="rounded-full border border-adfr-chrome/20 px-3 py-1">{s}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LocalContent({ zone }: { zone: Zone }) {
    const isDept = zone.type === "dept";
    return (
        <section className="relative py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="border-l-2 border-adfr-red pl-6 md:pl-8"
                    data-testid="zone-local-content"
                >
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                        {isDept ? `Votre dépanneur connaît ${zone.deptName}` : `Votre dépanneur connaît ${zone.name}`}
                    </h2>
                    <p className="mt-4 text-slate-300 leading-relaxed">
                        {isDept
                            ? `En ${zone.deptName.replace(/^(les|le|la) /i, "")} comme partout en Île-de-France, nos équipes roulent chaque jour sur ${zone.axes}.`
                            : `Nos équipes roulent chaque jour sur ${zone.axes}, au plus près de ${zone.spots[0].toLowerCase()} et des quartiers voisins.`}{" "}
                        Batterie, crevaison, carburant, accident ou remorquage : dans la grande majorité des cas, tout se règle sur place et vous repartez.
                    </p>
                    <p className="mt-3 text-slate-400 leading-relaxed text-sm">
                        Le paiement se fait sur place, après l'intervention, par carte bancaire ou en espèces.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/40 p-6 md:p-8"
                    data-testid="zone-interventions"
                >
                    <h3 className="font-display text-lg font-bold text-white">Interventions fréquentes</h3>
                    <ul className="mt-5 space-y-3.5">
                        {interventions(zone.name).map((it) => (
                            <li key={it} className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 className="size-4 mt-0.5 text-adfr-red shrink-0" />
                                {it}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}

function RelatedZones({ zone }: { zone: Zone }) {
    const isDept = zone.type === "dept";
    const targets = isDept
        ? citiesOfDept(zone.dept)
        : zone.neighbors.map((s) => getZone(s)).filter((z): z is Zone => Boolean(z) && z.slug !== zone.dept);
    const dept = deptOf(zone.dept);

    return (
        <section className="relative py-16 md:py-20 bg-[#070E1C] border-y border-adfr-chrome/10" data-testid="zone-related">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Zones voisines</p>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    {isDept ? `Nous intervenons aussi à` : `Nous intervenons aussi autour de ${zone.name}`}
                </h2>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dept && !isDept && (
                        <Link
                            to={zoneUrl(dept)}
                            data-testid={`zone-link-dept-${dept.slug}`}
                            className="group rounded-2xl border border-adfr-red/40 bg-adfr-red/10 p-5 transition-colors hover:bg-adfr-red/20"
                        >
                            <span className="font-display text-3xl font-black text-white">{dept.slug}</span>
                            <p className="mt-1 text-sm font-semibold text-[#FF6B75]">{dept.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">Tout le département</p>
                        </Link>
                    )}
                    {targets.map((z) => (
                        <Link
                            key={z.slug}
                            to={zoneUrl(z)}
                            data-testid={`zone-link-${z.slug}`}
                            className="group rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/40 p-5 transition-colors hover:border-adfr-electric/70 hover:bg-adfr-deep2/80"
                        >
                            <span className="font-display text-3xl font-black text-chrome/30 select-none">{z.type === "dept" ? z.slug : ""}</span>
                            <p className="mt-1 text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {z.type === "dept" ? z.name : `Dépannage à ${z.name}`}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">{z.type === "dept" ? "Département" : z.cp || z.deptName}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function ZonePage() {
    const { slug } = useParams<{ slug: string }>();
    if (!slug || !slug.startsWith("depannage-")) return <NotFound />;
    const zone = getZone(slug.replace("depannage-", ""));
    if (!zone) return <NotFound />;

    const isDept = zone.type === "dept";
    const title = isDept
        ? `Dépannage ${zone.deptIn} 24/7 — ADFR Remorquage`
        : `Dépannage à ${zone.name} 24/7 — ADFR Remorquage`;
    const description = `Panne ${isDept ? zone.deptIn : `à ${zone.name}`} ? ADFR intervient 24h/24, 7j/7, en moyenne en 20 minutes. ${zone.cp ? `${zone.cp} — ` : ""}Appelez le 01 85 80 00 61 : intervention rapide, paiement sur place.`;

    return (
        <>
            <Seo title={title} description={description} path={`/depannage-${zone.slug}`} jsonLd={[localBusinessLd(zone), faqPageLd(faqZone(zone.name))]} />
            <LocalHero zone={zone} />
            <LocalContent zone={zone} />
            <Services
                eyebrow="Nos services"
                title={isDept ? `Tous nos services de dépannage ${zone.deptIn}` : `Tous nos services de dépannage à ${zone.name}`}
                sub="Un seul appel : on vous dit ce qu'on peut faire et combien ça coûte, avant même que le dépanneur ne parte."
            />
            <RelatedZones zone={zone} />
            <Faq items={faqZone(zone.name)} title={`Questions fréquentes à ${zone.name}`} />
            <CallbackForm defaultLieu={zone.name} />
        </>
    );
}
