import { BRAND } from "@/data/brand";

const RAW_BACKEND = process.env.REACT_APP_BACKEND_URL || "";
/**
 * En production, le site appelle le serveur via /api sur son propre domaine (réécriture Vercel
 * vers Render, voir vercel.json). Les cookies de connexion sont ainsi « first-party » : sinon
 * l'iPhone les bloque et l'espace admin déconnecte aussitôt après la connexion.
 */
export const API = RAW_BACKEND.includes("onrender.com") ? "/api" : `${RAW_BACKEND}/api`;

export interface CallbackData {
    nom: string;
    telephone: string;
    lieu: string;
    type_panne: string;
    zone?: string;
}

export function track(event: "call" | "whatsapp" | "form", page: string) {
    try {
        fetch(`${API}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event, page, source: BRAND.id }),
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
