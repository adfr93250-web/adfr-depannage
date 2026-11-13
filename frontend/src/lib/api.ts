import { BRAND } from "@/data/brand";

import { API } from "@/lib/apiBase";

export interface CallbackData {
    nom: string;
    telephone: string;
    lieu: string;
    type_panne: string;
    zone?: string;
}

/** Provenance du visiteur, relevée une seule fois à l'arrivée sur le site (rien n'est stocké sur son appareil). */
function detectOrigin(): string {
    try {
        const p = new URLSearchParams(window.location.search);
        if (p.get("gclid") || p.get("gbraid") || p.get("wbraid") || p.get("gad_source")) return "ads";
        const ref = document.referrer;
        if (!ref) return "direct";
        const host = new URL(ref).hostname;
        if (host === window.location.hostname) return "direct";
        if (/(^|\.)google\./.test(host)) return "google";
        return "other";
    } catch {
        return "";
    }
}
const ORIGIN = typeof window !== "undefined" ? detectOrigin() : "";

/** Clé posée uniquement sur les appareils de l'équipe (espace admin) pour ne pas compter leurs essais. */
export const INTERNAL_KEY = "adfr_internal";
function isInternal(): boolean {
    try {
        return window.localStorage.getItem(INTERNAL_KEY) === "1";
    } catch {
        return false;
    }
}

export function track(event: "call" | "whatsapp" | "form", page: string, button = "") {
    try {
        const device = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
        fetch(`${API}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event, page, source: BRAND.id, button, origin: ORIGIN, device, internal: isInternal() }),
            keepalive: true,
        }).catch(() => {});
    } catch {
        // tracking never blocks the call
    }
}

export async function submitCallback(data: CallbackData): Promise<void> {
    const res = await fetch(`${API}/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: BRAND.id }),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || "Erreur d'envoi, appelez-nous directement.");
    }
}

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

function sendConversion(sendTo: string, label: string, withValue: boolean) {
    window.dataLayer = window.dataLayer || [];
    const params: Record<string, unknown> = { send_to: sendTo, event_label: label };
    if (withValue) {
        params.value = 1.0;
        params.currency = "EUR";
    }
    if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", params);
    } else {
        window.dataLayer.push({ event: "conversion", ...params });
    }
}

export function gtagConversion(kind: "call" | "whatsapp" | "form") {
    try {
        const raw = process.env.REACT_APP_GOOGLE_ADS_CONVERSION;
        if (!raw) return;
        sendConversion(raw.includes("/") ? raw : `AW-18543287149/${raw}`, kind, false);
        if (kind === "call") {
            const direct = process.env.REACT_APP_GOOGLE_ADS_CONVERSION_CALL;
            if (direct) sendConversion(direct.includes("/") ? direct : `AW-18543287149/${direct}`, "appel-direct", true);
        }
    } catch {
        // le suivi ne doit jamais bloquer un appel
    }
}
