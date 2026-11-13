import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Clock3, Lock, LogOut, PhoneCall, RefreshCw } from "lucide-react";
import { ClicksStats } from "@/components/ClicksStats";
import { API } from "@/lib/api";

const URGENT_MIN = 30;

interface CallbackRow {
    id: string;
    nom: string;
    telephone: string;
    lieu: string;
    type_panne: string;
    source?: string;
    handled: boolean;
    created_at: string;
}

function apiError(detail: unknown): string {
    if (detail == null) return "Une erreur est survenue. Réessayez.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
    if (typeof detail === "object" && detail !== null && "msg" in detail && typeof (detail as { msg: unknown }).msg === "string") return (detail as { msg: string }).msg;
    return "Une erreur est survenue. Réessayez.";
}

function minutesSince(iso: string): number {
    return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

function timeAgo(iso: string): string {
    const m = minutesSince(iso);
    if (m < 1) return "à l'instant";
    if (m < 60) return `il y a ${m} min`;
    return `il y a ${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
}

function hourLabel(iso: string): string {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);
    const [email, setEmail] = useState("admin@adfr-depann.fr");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [rows, setRows] = useState<CallbackRow[]>([]);
    const [scope, setScope] = useState<"today" | "all">("today");
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        document.title = "Suivi des demandes — Espace dépanneur";
        const robots = document.head.querySelector('meta[name="robots"]');
        if (robots) robots.setAttribute("content", "noindex, nofollow");
    }, []);

    const load = async (s: "today" | "all" = scope) => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/callbacks?scope=${s}`, { credentials: "include" });
            if (r.status === 401) {
                const refreshed = await fetch(`${API}/auth/refresh`, { method: "POST", credentials: "include" });
                if (refreshed.ok) {
                    const r2 = await fetch(`${API}/callbacks?scope=${s}`, { credentials: "include" });
                    if (r2.ok) setRows((await r2.json()).callbacks);
                    return;
                }
                setAuthed(false);
                return;
            }
            if (r.ok) setRows((await r.json()).callbacks);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const r = await fetch(`${API}/auth/me`, { credentials: "include" });
            if (r.ok) {
                setAuthed(true);
            } else {
                const refreshed = await fetch(`${API}/auth/refresh`, { method: "POST", credentials: "include" });
                if (refreshed.ok) setAuthed(true);
            }
            setChecking(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (authed) load(scope);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed, scope]);

    const onLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            const r = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            if (!r.ok) {
                const d = await r.json().catch(() => null);
                throw new Error(apiError(d?.detail));
            }
            setAuthed(true);
        } catch (err) {
            setLoginError((err as Error).message);
        }
    };

    const toggleHandled = async (row: CallbackRow) => {
        await fetch(`${API}/callbacks/${row.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ handled: !row.handled }),
        });
        load();
    };

    const logout = async () => {
        await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
        setAuthed(false);
        setRows([]);
    };

    const today = rows.filter((r) => minutesSince(r.created_at) < 24 * 60);
    const unhandled = rows.filter((r) => !r.handled);
    const urgent = unhandled.filter((r) => minutesSince(r.created_at) >= URGENT_MIN);

    return (
        <section className="relative min-h-[80vh] pt-10 pb-24 px-4 md:px-8">
            <div className="mx-auto max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-2">Espace dépanneur — interne</p>
                {checking ? (
                    <p className="text-slate-400" data-testid="admin-loading">Vérification de la session...</p>
                ) : !authed ? (
                    <div className="mt-4 rounded-3xl border border-adfr-chrome/20 bg-adfr-deep/80 backdrop-blur-xl p-6 md:p-8 max-w-md" data-testid="admin-login-card">
                        <Lock className="size-8 text-adfr-red" />
                        <h1 className="mt-4 font-display text-2xl font-extrabold text-white">Suivi des demandes de rappel</h1>
                        <p className="mt-2 text-sm text-slate-400">Connectez-vous pour voir les demandes reçues aujourd'hui.</p>
                        <form onSubmit={onLogin} className="mt-6 space-y-4" data-testid="admin-login-form">
                            <div>
                                <label htmlFor="ad-email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                                <input id="ad-email" data-testid="admin-login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-adfr-night/80 border border-adfr-chrome/25 rounded-xl px-4 py-3.5 text-white focus:border-adfr-electric focus:outline-none focus:ring-2 focus:ring-adfr-electric/40" />
                            </div>
                            <div>
                                <label htmlFor="ad-pass" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Mot de passe</label>
                                <input id="ad-pass" data-testid="admin-login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-adfr-night/80 border border-adfr-chrome/25 rounded-xl px-4 py-3.5 text-white focus:border-adfr-electric focus:outline-none focus:ring-2 focus:ring-adfr-electric/40" />
                            </div>
                            {loginError && <p className="text-sm text-adfr-redLight font-semibold" data-testid="admin-login-error">{loginError}</p>}
                            <button type="submit" data-testid="admin-login-submit" className="w-full bg-adfr-electric hover:bg-adfr-electricDark text-white font-display font-extrabold uppercase tracking-wide rounded-xl py-4 transition-colors">
                                Voir les demandes
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mt-4" data-testid="admin-dashboard">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">Demandes de rappel</h1>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { load(scope); setRefreshKey((k) => k + 1); }} data-testid="admin-refresh" className="grid place-items-center size-10 rounded-full border border-adfr-chrome/25 text-slate-300 hover:text-white hover:border-white transition-colors" aria-label="Rafraîchir">
                                    <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                                </button>
                                <button onClick={logout} data-testid="admin-logout" className="inline-flex items-center gap-2 rounded-full border border-adfr-chrome/25 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:border-white transition-colors">
                                    <LogOut className="size-4" /> Déconnexion
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3" data-testid="admin-stats">
                            <div className="rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/40 p-4">
                                <p className="font-display text-3xl font-black text-white" data-testid="admin-stat-today">{today.length}</p>
                                <p className="text-xs text-slate-400 mt-1">Aujourd'hui</p>
                            </div>
                            <div className="rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/40 p-4">
                                <p className="font-display text-3xl font-black text-white" data-testid="admin-stat-unhandled">{unhandled.length}</p>
                                <p className="text-xs text-slate-400 mt-1">Non traitées</p>
                            </div>
                            <div className={`rounded-2xl border p-4 ${urgent.length > 0 ? "border-adfr-red/60 bg-adfr-red/10" : "border-adfr-chrome/15 bg-adfr-deep2/40"}`}>
                                <p className={`font-display text-3xl font-black ${urgent.length > 0 ? "text-adfr-redLight" : "text-white"}`} data-testid="admin-stat-urgent">{urgent.length}</p>
                                <p className="text-xs text-slate-400 mt-1">En retard (+{URGENT_MIN} min)</p>
                            </div>
                        </div>

                        <ClicksStats refreshKey={refreshKey} />

                        <div className="mt-6 flex gap-2" data-testid="admin-scope-toggle">
                            {(["today", "all"] as const).map((s) => (
                                <button key={s} onClick={() => setScope(s)} data-testid={`admin-scope-${s}`} className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${scope === s ? "bg-adfr-electric text-white" : "border border-adfr-chrome/25 text-slate-300 hover:text-white"}`}>
                                    {s === "today" ? "Aujourd'hui" : "Toutes"}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 space-y-3 pb-10">
                            {rows.length === 0 && (
                                <p className="text-slate-400 text-sm" data-testid="admin-empty">Aucune demande pour le moment. Elles arrivent ici dès qu'un client remplit le formulaire.</p>
                            )}
                            {rows.map((r) => {
                                const late = !r.handled && minutesSince(r.created_at) >= URGENT_MIN;
                                return (
                                    <article key={r.id} data-testid="admin-callback-card" className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between ${late ? "border-adfr-red/50 bg-adfr-red/5" : "border-adfr-chrome/15 bg-adfr-deep2/40"}`}>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span className="font-display font-bold text-white">{r.nom}</span>
                                                <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border ${r.source === "sos" ? "bg-orange-500/20 text-orange-300 border-orange-500/40" : "bg-white/5 text-slate-400 border-white/10"}`} data-testid={`callback-source-${r.id}`}>
                                                    {r.source === "sos" ? "SOS" : "ADFR"}
                                                </span>
                                                {r.handled ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-adfr-wa/15 border border-adfr-wa/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-adfr-wa" data-testid="callback-badge-done">
                                                        <CheckCircle2 className="size-3" /> Traité
                                                    </span>
                                                ) : late ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-adfr-red/20 border border-adfr-red/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-adfr-redLight" data-testid="callback-badge-late">
                                                        <Clock3 className="size-3" /> Non traité — {timeAgo(r.created_at)}
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-adfr-electric/15 border border-adfr-electric/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-adfr-electricLight" data-testid="callback-badge-new">
                                                        Nouveau — {timeAgo(r.created_at)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1.5 text-sm text-slate-300">{r.type_panne} — {r.lieu}</p>
                                            <p className="mt-1 text-xs text-slate-500">Reçu à {hourLabel(r.created_at)} ({timeAgo(r.created_at)})</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a href={`tel:${r.telephone.replace(/\s/g, "")}`} data-testid={`callback-call-${r.id}`} className="inline-flex items-center gap-2 rounded-full bg-adfr-red px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-adfr-redDark">
                                                <PhoneCall className="size-4" /> {r.telephone}
                                            </a>
                                            <button onClick={() => toggleHandled(r)} data-testid={`callback-toggle-${r.id}`} className="rounded-full border border-adfr-chrome/30 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-white transition-colors">
                                                {r.handled ? "Réouvrir" : "Traité"}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
