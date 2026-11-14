import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Route } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { DEPARTMENTS, PARIS_ARR, CITIES, zoneUrl, citiesOfDept } from "@/data/zones";
import { SITE, brandText } from "@/redesign/data";
import { gsap, FINE, REDUCED } from "@/redesign/motion";
import { zoneEn } from "@/redesign/en";
import { SplitLines, Reveal } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

// Mêmes positions que la carte stylisée du site original (repère 640 × 560)
const HEX: Record<string, { x: number; y: number; r: number }> = {
    "95": { x: 310, y: 108, r: 66 },
    "78": { x: 116, y: 252, r: 70 },
    "92": { x: 262, y: 268, r: 70 },
    "75": { x: 378, y: 252, r: 54 },
    "93": { x: 492, y: 236, r: 70 },
    "94": { x: 398, y: 378, r: 70 },
    "91": { x: 218, y: 444, r: 70 },
    "77": { x: 514, y: 426, r: 74 },
};
const SHORT: Record<string, string> = { "75": "Paris", "77": "Seine-et-Marne", "78": "Yvelines", "91": "Essonne", "92": "Hauts-de-Seine", "93": "Seine-St-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise" };
const S3 = Math.sqrt(3);

/**
 * Zones : la carte stylisée devient un plateau 3D incliné, balayé par un radar centré sur Paris.
 * Chaque département se soulève au survol et met à jour la fiche à droite.
 */
export default function Zones() {
    const ref = useRef<HTMLElement>(null);
    const [active, setActive] = useState("75");
    const dept = DEPARTMENTS.find((d) => d.slug === active)!;
    const towns = citiesOfDept(active);
    const { lang, t } = useT();

    useGSAP(
        () => {
            if (REDUCED) return;
            const root = ref.current!;
            const map = root.querySelector<HTMLElement>(".hexmap")!;
            if (!FINE) return;
            const stageEl = root.querySelector<HTMLElement>(".hexstage")!;
            const move = (e: PointerEvent) => {
                const r = stageEl.getBoundingClientRect();
                gsap.to(map, { "--mx": `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`, "--mz": `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`, duration: 1, ease: "power3.out", overwrite: "auto" });
            };
            const leave = () => gsap.to(map, { "--mx": "0deg", "--mz": "0deg", duration: 1.2, ease: "power3.out", overwrite: "auto" });
            stageEl.addEventListener("pointermove", move);
            stageEl.addEventListener("pointerleave", leave);
            return () => {
                stageEl.removeEventListener("pointermove", move);
                stageEl.removeEventListener("pointerleave", leave);
            };
        },
        { scope: ref },
    );

    // La fiche se recompose à chaque changement de département
    useGSAP(
        () => {
            if (REDUCED) return;
            gsap.from(".zone-panel__num", { yPercent: 40, duration: 0.25 });
        },
        { scope: ref, dependencies: [active] },
    );

    return (
        <section ref={ref} id="zones" className="sheet overflow-hidden border-y border-adfr-chrome/10 bg-adfr-night2 py-24 md:py-36">
            <div className="pointer-events-none absolute -left-40 top-20 size-[36rem] rounded-full bg-adfr-electric/15 blur-[150px]" aria-hidden="true" />
            <div className="wrap relative">
                <div className="max-w-4xl">
                    <p className="eyebrow">{t("Zones d'intervention", "Areas we cover")}</p>
                    <SplitLines className="h-section mt-5 text-white">
                        {t("Toute l'Île-de-France.", "All of the Paris region.")} <span className="italic text-adfr-red">{t("Un seul numéro.", "One number.")}</span>
                    </SplitLines>
                    <Reveal as="p" className="mt-6 max-w-2xl leading-relaxed text-slate-400" delay={0.1}>
                        {t(`Paris et toute l'Île-de-France : où que votre panne tombe, un dépanneur ${SITE.name} part immédiatement. Cliquez sur votre département ou votre ville.`, `Paris and the whole Paris region: wherever you break down, an ${SITE.name} driver leaves immediately. Tap your department or your town.`)}
                    </Reveal>
                </div>

                <div className="mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
                    <div className="hexstage relative mx-auto w-full max-w-[52rem] py-2 [perspective:1400px] lg:py-4" data-testid="zones-map">
                        <div className="hexmap" role="group" aria-label={t(`Carte des zones d'intervention ${SITE.name} en Île-de-France`, `Map of the areas covered by ${SITE.name} in the Paris region`)}>
                            <span className="hexmap__ring" style={{ width: "27%", aspectRatio: "1" }} />
                            <span className="hexmap__ring" style={{ width: "74%", aspectRatio: "1" }} />
                            <span className="hexmap__ring" style={{ width: "118%", aspectRatio: "1" }} />
                            <span className="hexmap__radar" />
                            {DEPARTMENTS.map((d) => {
                                const h = HEX[d.slug];
                                const w = S3 * h.r;
                                return (
                                    <button
                                        key={d.slug}
                                        type="button"
                                        className="hex"
                                        data-paris={d.slug === "75"}
                                        data-testid={`zone-hex-${d.slug}`}
                                        aria-pressed={active === d.slug}
                                        aria-label={`${d.name} (${d.slug})`}
                                        style={{ left: `${((h.x - w / 2) / 640) * 100}%`, top: `${((h.y - h.r) / 560) * 100}%`, width: `${(w / 640) * 100}%`, height: `${((h.r * 2) / 560) * 100}%` }}
                                        onClick={() => setActive(d.slug)}
                                        onMouseEnter={() => FINE && setActive(d.slug)}
                                        onFocus={() => setActive(d.slug)}
                                    >
                                        <span className="hex__base" />
                                        <span className="hex__top">
                                            <span className="hex__label">
                                                <span className="display block text-[clamp(1.1rem,3.4vw,2.6rem)]">{d.slug}</span>
                                                <span className="mt-1 block text-[clamp(0.4rem,0.95vw,0.68rem)] font-bold uppercase tracking-[0.12em] text-slate-200">{SHORT[d.slug]}</span>
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500 lg:mt-0">{t("Carte stylisée — sélectionnez un département", "Stylised map — select a department")}</p>
                    </div>

                    <div className="zone-panel glass rounded-[2rem] p-6 md:p-9" data-testid="zone-panel" aria-live="polite">
                        <div className="flex items-end justify-between gap-4 overflow-hidden">
                            <p className="zone-panel__num display text-chrome text-7xl md:text-8xl">{dept.slug}</p>
                            <p className="pb-2 text-right text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                                {t("Département", "Department")}
                                <br />
                                <span className="text-adfr-redLight">{t(`Intervention ${SITE.delay.short}`, "On site in under 30 min")}</span>
                            </p>
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white md:text-3xl">{dept.name}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">{lang === "en" ? zoneEn.intro(dept) : brandText(dept.intro)}</p>
                        <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-slate-400">
                            <Route className="mt-0.5 size-4 shrink-0 text-adfr-red" aria-hidden="true" />
                            <span>{lang === "en" ? "Our drivers know the main roads of the area." : `Nos équipes connaissent ${dept.axes}.`}</span>
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {dept.spots.map((s) => (
                                <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                                    <MapPin className="size-3 text-adfr-red" aria-hidden="true" /> {s}
                                </li>
                            ))}
                        </ul>
                        <Link to={zoneUrl(dept)} data-testid={`zone-list-${dept.slug}`} data-cursor="Voir" className="btn btn-electric mt-6 w-full px-6 py-4 text-sm">
                            {t(`Dépannage ${dept.deptIn}`, `Breakdown service — ${dept.name}`)} <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                        {towns.length > 0 && (
                            <div className="mt-5 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto pr-1" data-lenis-prevent>
                                {towns.map((c) => (
                                    <Link key={c.slug} to={zoneUrl(c)} className="chip !px-2.5 !py-1 !text-[11px]">
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Reveal className="mt-14 border-t border-adfr-chrome/10 pt-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{t("Départements & villes d'intervention", "Departments & towns we cover")}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {DEPARTMENTS.map((d) => (
                            <li key={d.slug}>
                                <Link to={zoneUrl(d)} className="chip !border-adfr-electric/50 !text-white">
                                    <span className="mr-2 font-display font-black">{d.slug}</span> {d.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2" data-testid="zones-city-chips">
                        {CITIES.map((c) => (
                            <Link key={c.slug} to={zoneUrl(c)} data-testid={`zone-chip-${c.slug}`} className="chip">
                                {c.name}
                            </Link>
                        ))}
                        <Link to="/depannage-75" className="chip !border-adfr-red/50 !bg-adfr-red/10 !font-bold !text-adfr-redLight">
                            + Paris {PARIS_ARR.length} {t("arrondissements", "districts")}
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
