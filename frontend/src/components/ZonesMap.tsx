import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DEPARTMENTS, PARIS_ARR, CITIES, zoneUrl } from "@/data/zones";
import { SITE } from "@/data/site";

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

const SHORT: Record<string, string> = {
    "75": "PARIS",
    "77": "SEINE-ET-MARNE",
    "78": "YVELINES",
    "91": "ESSONNE",
    "92": "HAUTS-DE-SEINE",
    "93": "SEINE-SAINT-DENIS",
    "94": "VAL-DE-MARNE",
    "95": "VAL-D'OISE",
};

function hexPoints(x: number, y: number, r: number) {
    return Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i - 30);
        return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ZonesMap() {
    return (
        <section id="zones" className="relative py-20 md:py-28 bg-adfr-night2 border-y border-adfr-chrome/10">
            <div className="mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    data-testid="zones-map"
                >
                    <svg viewBox="0 0 640 560" className="w-full h-auto" role="img" aria-label={`Carte des zones d'intervention ${SITE.name} en Île-de-France`}>
                        <circle cx="378" cy="252" r="86" fill="none" stroke="rgba(201,205,212,0.3)" strokeWidth="1.5" strokeDasharray="5 7" />
                        {DEPARTMENTS.map((d) => {
                            const h = HEX[d.slug];
                            const paris = d.slug === "75";
                            return (
                                <Link key={d.slug} to={zoneUrl(d)} data-testid={`zone-hex-${d.slug}`} className="zone-hex" aria-label={`Dépannage ${d.name}`}>
                                    <polygon
                                        points={hexPoints(h.x, h.y, h.r)}
                                        className={paris ? "paris-fill" : "dep-fill"}
                                        fill={paris ? "rgb(var(--c-red-dark))" : "rgb(var(--c-deep2))"}
                                        stroke="rgba(201,205,212,0.28)"
                                        strokeWidth="1.5"
                                    />
                                    <text x={h.x} y={h.y + 4} textAnchor="middle" fontSize={h.r * 0.4} className="fill-white font-display font-black pointer-events-none select-none">
                                        {d.slug}
                                    </text>
                                    <text x={h.x} y={h.y + h.r * 0.52} textAnchor="middle" fontSize={paris ? 12 : 10.5} className="fill-slate-300 uppercase pointer-events-none select-none" style={{ letterSpacing: "0.12em" }}>
                                        {SHORT[d.slug]}
                                    </text>
                                </Link>
                            );
                        })}
                    </svg>
                    <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-slate-500">Carte stylisée — cliquez sur un département</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: EASE }}>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Zones d'intervention</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Toute l'Île-de-France. Un seul numéro.</h2>
                    <p className="mt-4 text-slate-400 leading-relaxed">
                        Paris et toute l'Île-de-France : où que votre panne tombe, un dépanneur {SITE.name} part immédiatement. Cliquez sur votre département ou votre ville.
                    </p>
                    <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                        {DEPARTMENTS.map((d) => (
                            <li key={d.slug}>
                                <Link
                                    to={zoneUrl(d)}
                                    data-testid={`zone-list-${d.slug}`}
                                    className="group flex items-center justify-between gap-3 rounded-xl border border-adfr-chrome/15 bg-adfr-deep2/40 px-4 py-3 transition-colors hover:border-adfr-electric/70 hover:bg-adfr-deep2/80"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="grid place-items-center min-w-9 rounded-md bg-adfr-deep border border-adfr-chrome/20 px-2 py-1 font-display text-sm font-black text-white">{d.slug}</span>
                                        <span className="text-sm font-semibold text-slate-200">{d.name}</span>
                                    </span>
                                    <ArrowRight className="size-4 text-slate-500 transition-all duration-200 group-hover:text-adfr-red group-hover:translate-x-1" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2" data-testid="zones-city-chips">
                        {CITIES.map((c) => (
                            <Link
                                key={c.slug}
                                to={zoneUrl(c)}
                                data-testid={`zone-chip-${c.slug}`}
                                className="rounded-full border border-adfr-chrome/20 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-adfr-electric hover:text-white"
                            >
                                {c.name}
                            </Link>
                        ))}
                        <span className="rounded-full border border-adfr-red/40 bg-adfr-red/10 px-3.5 py-1.5 text-xs font-bold text-adfr-redLight">
                            + Paris {PARIS_ARR.length} arrondissements
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
