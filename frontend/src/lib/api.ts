import { BRAND } from "@/data/brand";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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

/**
 * Suivi des vrais appels Google Ads (numéro de transfert Google).
 * Pour les visiteurs venus d'une annonce, Google remplace le numéro affiché par un
 * numéro de suivi qui redirige vers la ligne ADFR et compte l'appel réellement passé.
 * Inactif tant que REACT_APP_GOOGLE_ADS_PHONE_CONVERSION n'est pas renseignée.
 */
export function initPhoneTracking() {
    try {
        const raw = process.env.REACT_APP_GOOGLE_ADS_PHONE_CONVERSION;
        if (!raw || typeof window.gtag !== "function") return;
        window.gtag("config", raw.includes("/") ? raw : `AW-18543287149/${raw}`, {
            phone_conversion_number: BRAND.phoneDisplay,
        });
    } catch {
        // le suivi ne doit jamais bloquer un appel
    }
}
