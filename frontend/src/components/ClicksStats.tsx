import { useEffect, useState } from "react";
import { MessageCircle, PhoneCall, Send } from "lucide-react";

import { API } from "@/lib/apiBase";
import { INTERNAL_KEY } from "@/lib/api";

interface DayRow {
    date: string;
    call: number;
    whatsapp: number;
    form: number;
    total: number;
}

interface StatsPayload {
    days: number;
    rows: DayRow[];
    totals: { call: number; whatsapp: number; form: number; total: number };
    origins?: Record<string, number>;
    hours?: number[];
    tests?: number;
}

interface ClickEvent {
    created_at: string;
    event: "call" | "whatsapp" | "form";
    page: string;
    source: string;
    button: string;
    origin: string;
    device: string;
    internal: boolean;
}

const EVENT_LABEL: Record<string, string> = { call: "Appel", whatsapp: "WhatsApp", form: "Formulaire" };
const EVENT_COLOR: Record<string, string> = { call: "text-adfr-redLight", whatsapp: "text-adfr-wa", form: "text-adfr-electricLight" };
const ORIGIN_LABEL: Record<string, string> = {
    ads: "Annonce Google",
    google: "Google gratuit",
    direct: "Accès direct",
    other: "Autre site",
    unknown: "Non mesuré",
};
const ORIGIN_ORDER = ["ads", "google", "direct", "other", "unknown"];

function timeLabel(iso: string): string {
    const d = new Date(iso);
    const day = dayLabel(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    return `${day} ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

function readInternal(): boolean {
    try {
        return window.localStorage.getItem(INTERNAL_KEY) === "1";
    } catch {
        return false;
    }
}

function dayLabel(iso: string): string {
    const d = new Date(`${iso}T12:00:00`);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (d.toDateString() === yesterday.toDateString()) return "Hier";
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });
}

export const ClicksStats = ({ refreshKey }: { refreshKey: number }) => {
    const [days, setDays] = useState<7 | 14 | 30>(14);
    const [source, setSource] = useState<"all" | "adfr" | "sos">("all");
    const [data, setData] = useState<StatsPayload | null>(null);
    const [events, setEvents] = useState<ClickEvent[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [internal, setInternal] = useState(readInternal);

    // Les appareils de l'équipe sont marqués "test" dès la première connexion à l'espace admin
    useEffect(() => {
        try {
            if (window.localStorage.getItem(INTERNAL_KEY) === null) {
                window.localStorage.setItem(INTERNAL_KEY, "1");
                setInternal(true);
            }
        } catch {
            // stockage indisponible (navigation privée stricte) : on ne marque rien
        }
    }, []);

    const toggleInternal = () => {
        const next = !internal;
        try {
            window.localStorage.setItem(INTERNAL_KEY, next ? "1" : "0");
        } catch {
            return;
        }
        setInternal(next);
    };

    useEffect(() => {
        let cancelled = false;
        const q = source === "all" ? "" : `&source=${source}`;
        fetch(`${API}/track/stats?days=${days}${q}`, { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => { if (!cancelled) setData(d); });
        const q2 = source === "all" ? "" : `&source=${source}`;
        fetch(`${API}/track/events?limit=100${q2}`, { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => { if (!cancelled) setEvents(d?.events ?? []); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [days, source, refreshKey]);

    const max = Math.max(1, ...(data?.rows.map((r) => r.total) ?? [1]));
    const origins = data?.origins;
    const originTotal = origins ? Math.max(1, ORIGIN_ORDER.reduce((n, k) => n + (origins[k] ?? 0), 0)) : 1;
    const hours = data?.hours ?? [];
    const hourMax = Math.max(1, ...hours);
    const busyHours = hours.map((n, h) => ({ h, n })).filter((x) => x.n > 0);
    const shownEvents = showAll ? events : events.slice(0, 15);

    return (
        <section className="mt-8 rounded-3xl border border-adfr-chrome/15 bg-adfr-deep2/40 p-5 md:p-6" data-testid="clicks-stats">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-display text-base md:text-lg font-extrabold text-white">Clics Appel &amp; WhatsApp par jour</h2>
                    <p className="text-xs text-slate-400 mt-1">À comparer avec les clics facturés par Google Ads sur la même période.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="flex gap-1 rounded-full border border-adfr-chrome/20 p-0.5" data-testid="clicks-source-toggle">
                        {(["all", "adfr", "sos"] as const).map((s) => (
                            <button key={s} onClick={() => setSource(s)} data-testid={`clicks-source-${s}`} className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${source === s ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
                                {s === "all" ? "Tous" : s === "adfr" ? "ADFR" : "SOS"}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2" data-testid="clicks-range-toggle">
                        {([7, 14, 30] as const).map((n) => (
                            <button key={n} onClick={() => setDays(n)} data-testid={`clicks-range-${n}`} className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${days === n ? "bg-adfr-electric text-white" : "border border-adfr-chrome/25 text-slate-300 hover:text-white"}`}>
                                {n} j
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3" data-testid="clicks-totals">
                <div className="rounded-2xl border border-adfr-red/40 bg-adfr-red/10 p-4">
                    <PhoneCall className="size-4 text-adfr-redLight" />
                    <p className="mt-2 font-display text-3xl font-black text-white" data-testid="clicks-total-call">{data?.totals.call ?? "–"}</p>
                    <p className="text-xs text-slate-400 mt-1">Clics Appel</p>
                </div>
                <div className="rounded-2xl border border-adfr-wa/40 bg-adfr-wa/10 p-4">
                    <MessageCircle className="size-4 text-adfr-wa" />
                    <p className="mt-2 font-display text-3xl font-black text-white" data-testid="clicks-total-whatsapp">{data?.totals.whatsapp ?? "–"}</p>
                    <p className="text-xs text-slate-400 mt-1">Clics WhatsApp</p>
                </div>
                <div className="rounded-2xl border border-adfr-electric/40 bg-adfr-electric/10 p-4">
                    <Send className="size-4 text-adfr-electricLight" />
                    <p className="mt-2 font-display text-3xl font-black text-white" data-testid="clicks-total-form">{data?.totals.form ?? "–"}</p>
                    <p className="text-xs text-slate-400 mt-1">Formulaires</p>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm" data-testid="clicks-table">
                    <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-slate-500">
                            <th className="text-left font-bold py-2 pr-3">Jour</th>
                            <th className="text-right font-bold py-2 px-2 text-adfr-redLight">Appel</th>
                            <th className="text-right font-bold py-2 px-2 text-adfr-wa">WhatsApp</th>
                            <th className="text-right font-bold py-2 px-2 text-adfr-electricLight">Form.</th>
                            <th className="text-right font-bold py-2 pl-2">Total</th>
                            <th className="w-1/3 py-2 pl-4 hidden sm:table-cell" />
                        </tr>
                    </thead>
                    <tbody>
                        {data?.rows.map((r) => (
                            <tr key={r.date} data-testid={`clicks-row-${r.date}`} className="border-t border-adfr-chrome/10">
                                <td className="py-2 pr-3 text-slate-300 whitespace-nowrap">{dayLabel(r.date)}</td>
                                <td className="py-2 px-2 text-right font-bold text-white">{r.call}</td>
                                <td className="py-2 px-2 text-right font-bold text-white">{r.whatsapp}</td>
                                <td className="py-2 px-2 text-right font-bold text-white">{r.form}</td>
                                <td className="py-2 pl-2 text-right font-black text-white">{r.total}</td>
                                <td className="py-2 pl-4 hidden sm:table-cell">
                                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-adfr-night/60">
                                        <span className="bg-adfr-red transition-[width] duration-500" style={{ width: `${(r.call / max) * 100}%` }} />
                                        <span className="bg-adfr-wa transition-[width] duration-500" style={{ width: `${(r.whatsapp / max) * 100}%` }} />
                                        <span className="bg-adfr-electric transition-[width] duration-500" style={{ width: `${(r.form / max) * 100}%` }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-3 text-xs text-slate-500" data-testid="clicks-tests-note">
                {data?.tests ? `${data.tests} clic${data.tests > 1 ? "s" : ""} de test (appareils de l'équipe) non compté${data.tests > 1 ? "s" : ""} dans ces totaux.` : "Les clics faits depuis les appareils de l'équipe ne sont pas comptés dans ces totaux."}
            </p>

            {origins && (
                <div className="mt-6" data-testid="clicks-origins">
                    <h3 className="font-display text-sm font-extrabold text-white">D'où viennent les clics</h3>
                    <p className="text-xs text-slate-400 mt-1">Sur la période choisie. « Non mesuré » = clics enregistrés avant l'ajout de cette mesure.</p>
                    <div className="mt-3 space-y-2">
                        {ORIGIN_ORDER.filter((k) => (origins[k] ?? 0) > 0).map((k) => (
                            <div key={k} className="flex items-center gap-3 text-sm" data-testid={`clicks-origin-${k}`}>
                                <span className="w-32 shrink-0 text-slate-300">{ORIGIN_LABEL[k]}</span>
                                <span className="flex h-2 flex-1 overflow-hidden rounded-full bg-adfr-night/60">
                                    <span className={k === "ads" ? "bg-adfr-red" : k === "unknown" ? "bg-slate-600" : "bg-adfr-electric"} style={{ width: `${((origins[k] ?? 0) / originTotal) * 100}%` }} />
                                </span>
                                <span className="w-8 text-right font-bold text-white">{origins[k]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {busyHours.length > 0 && (
                <div className="mt-6" data-testid="clicks-hours">
                    <h3 className="font-display text-sm font-extrabold text-white">Heures où l'on clique le plus</h3>
                    <p className="text-xs text-slate-400 mt-1">Total des clics par heure sur la période choisie.</p>
                    <div className="mt-3 space-y-1.5">
                        {busyHours.map(({ h, n }) => (
                            <div key={h} className="flex items-center gap-3 text-sm">
                                <span className="w-32 shrink-0 text-slate-300">{String(h).padStart(2, "0")}h – {String((h + 1) % 24).padStart(2, "0")}h</span>
                                <span className="flex h-2 flex-1 overflow-hidden rounded-full bg-adfr-night/60">
                                    <span className="bg-adfr-red" style={{ width: `${(n / hourMax) * 100}%` }} />
                                </span>
                                <span className="w-8 text-right font-bold text-white">{n}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6" data-testid="clicks-events">
                <h3 className="font-display text-sm font-extrabold text-white">Détail des derniers clics</h3>
                <p className="text-xs text-slate-400 mt-1">Heure, bouton utilisé, provenance et appareil. À comparer avec les appels réellement reçus.</p>
                {events.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">Aucun clic enregistré pour l'instant.</p>
                ) : (
                    <ul className="mt-3 divide-y divide-adfr-chrome/10">
                        {shownEvents.map((e, i) => (
                            <li key={`${e.created_at}-${i}`} className={`py-2.5 ${e.internal ? "opacity-50" : ""}`} data-testid="clicks-event-row">
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className={`font-bold ${EVENT_COLOR[e.event] ?? "text-white"}`}>{EVENT_LABEL[e.event] ?? e.event}</span>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{timeLabel(e.created_at)}</span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    {[
                                        e.button || null,
                                        e.page ? `page ${e.page}` : null,
                                        e.origin ? ORIGIN_LABEL[e.origin] : null,
                                        e.device === "mobile" ? "Téléphone" : e.device === "desktop" ? "Ordinateur" : null,
                                        source === "all" && e.source === "sos" ? "SOS" : null,
                                        e.internal ? "TEST (équipe)" : null,
                                    ].filter(Boolean).join(" · ") || "Détail non mesuré (ancien clic)"}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
                {events.length > 15 && (
                    <button onClick={() => setShowAll((v) => !v)} data-testid="clicks-events-more" className="mt-3 rounded-full border border-adfr-chrome/25 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white">
                        {showAll ? "Voir moins" : `Voir les ${events.length} derniers clics`}
                    </button>
                )}
            </div>

            <div className="mt-6 rounded-2xl border border-adfr-chrome/15 bg-adfr-night/40 p-4" data-testid="clicks-internal">
                <p className="text-sm font-bold text-white">{internal ? "Cet appareil est marqué « équipe »" : "Cet appareil compte comme un visiteur"}</p>
                <p className="mt-1 text-xs text-slate-400">
                    {internal
                        ? "Vos essais de boutons depuis cet appareil sont notés comme tests et ne faussent plus les chiffres."
                        : "Vos clics depuis cet appareil sont comptés comme ceux d'un client."}
                </p>
                <button onClick={toggleInternal} data-testid="clicks-internal-toggle" className="mt-3 rounded-full border border-adfr-chrome/25 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white">
                    {internal ? "Compter cet appareil comme un visiteur" : "Marquer cet appareil comme équipe"}
                </button>
            </div>
        </section>
    );
};
