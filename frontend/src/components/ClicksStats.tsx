import { useEffect, useState } from "react";
import { MessageCircle, PhoneCall, Send } from "lucide-react";
import { API } from "@/lib/api";


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

    useEffect(() => {
        let cancelled = false;
        const q = source === "all" ? "" : `&source=${source}`;
        fetch(`${API}/track/stats?days=${days}${q}`, { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => { if (!cancelled) setData(d); });
        return () => { cancelled = true; };
    }, [days, source, refreshKey]);

    const max = Math.max(1, ...(data?.rows.map((r) => r.total) ?? [1]));

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
        </section>
    );
};
