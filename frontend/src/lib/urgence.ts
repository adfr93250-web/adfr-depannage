/**
 * Outils « urgence » (marque ADFR) : disponibilité, position, langue, contraste.
 * Petits magasins d'état partagés pour que le hero, la barre d'appel et le panneau d'urgence
 * voient la même chose.
 */
import { useSyncExternalStore } from "react";
import { SITE } from "@/data/site";

function createStore<T>(initial: T) {
    let value = initial;
    const subs = new Set<() => void>();
    return {
        get: () => value,
        set: (v: T) => {
            value = v;
            subs.forEach((f) => f());
        },
        subscribe: (f: () => void) => {
            subs.add(f);
            return () => {
                subs.delete(f);
            };
        },
    };
}
type Store<T> = ReturnType<typeof createStore<T>>;
function useStore<T>(s: Store<T>) {
    return useSyncExternalStore(s.subscribe, s.get, s.get);
}
const read = (k: string) => {
    try {
        return window.localStorage.getItem(k);
    } catch {
        return null;
    }
};
const write = (k: string, v: string) => {
    try {
        window.localStorage.setItem(k, v);
    } catch {
        // stockage indisponible : le réglage vaut pour cette visite seulement
    }
};

// ---------- Langue (FR / EN) : seule la couche « urgence » est traduite
export type Lang = "fr" | "en";
const langStore = createStore<Lang>(read("adfr_lang") === "en" ? "en" : "fr");
export function setLang(l: Lang) {
    write("adfr_lang", l);
    document.documentElement.lang = l;
    langStore.set(l);
}
export function useLang() {
    const lang = useStore(langStore);
    return { lang, t: (fr: string, en: string) => (lang === "en" ? en : fr) };
}

// ---------- Thème clair / sombre (le sombre reste le thème par défaut)
export type Theme = "dark" | "light";
const themeStore = createStore<Theme>(read("adfr_theme") === "light" ? "light" : "dark");
function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;
    const light = theme === "light";
    const root = document.documentElement;
    // Pendant la bascule, on coupe les fondus : sinon certains textes changent plus lentement que le fond
    root.classList.add("theme-switch");
    root.classList.toggle("light", light);
    window.setTimeout(() => root.classList.remove("theme-switch"), 120);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#F4F6FA" : "#050B14");
    document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", light ? "light" : "dark");
}
applyTheme(themeStore.get());
export function setTheme(theme: Theme) {
    write("adfr_theme", theme);
    applyTheme(theme);
    themeStore.set(theme);
}
export const useTheme = () => useStore(themeStore);

// ---------- Disponibilité : 24h/24 du dimanche au vendredi (pas le samedi), heure de Paris
export function availability(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    return { open: get("weekday") !== "Sat", time: `${get("hour")}:${get("minute")}` };
}

// ---------- Position
export type Geo = { kind: "idle" } | { kind: "loading" } | { kind: "found"; lat: number; lng: number } | { kind: "error"; code: number };
const geoStore = createStore<Geo>({ kind: "idle" });
export const useGeo = () => useStore(geoStore);
export function locate(): Promise<Geo> {
    return new Promise((resolve) => {
        const done = (g: Geo) => {
            geoStore.set(g);
            resolve(g);
        };
        if (!("geolocation" in navigator)) return done({ kind: "error", code: 2 });
        geoStore.set({ kind: "loading" });
        navigator.geolocation.getCurrentPosition(
            (p) => done({ kind: "found", lat: p.coords.latitude, lng: p.coords.longitude }),
            (e) => done({ kind: "error", code: e.code }),
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
        );
    });
}
export const GEO_ERRORS: Record<number, [string, string]> = {
    1: ["Géolocalisation refusée. Activez-la dans votre navigateur, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.", "Location refused. Enable it in your browser, or call us and tell us where you are: we will still come."],
    2: ["Impossible de déterminer votre position. Appelez-nous et décrivez-nous où vous êtes : on arrive quand même.", "We could not find your position. Call us and tell us where you are: we will still come."],
    3: ["La recherche a pris trop de temps. Réessayez, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.", "The search took too long. Try again, or call us and tell us where you are: we will still come."],
};

// ---------- Messages WhatsApp pré-remplis
export function waLink(opts: { panne?: string; geo?: Geo; lang?: Lang } = {}) {
    const en = opts.lang === "en";
    const lines = [en ? "Hello 👋, I need roadside assistance." : SITE.whatsappBase];
    if (opts.panne) lines.push(en ? `Problem: ${opts.panne}` : `Type de panne : ${opts.panne}`);
    if (opts.geo?.kind === "found") lines.push(`${en ? "My exact position" : "Ma position exacte"} : https://maps.google.com/?q=${opts.geo.lat},${opts.geo.lng}`);
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(lines.join("\n\n"))}`;
}
