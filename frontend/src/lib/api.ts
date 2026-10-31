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
            body: JSON.stringify({ event, page }),
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
        body: JSON.stringify(data),
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

export function gtagConversion(kind: "call" | "whatsapp" | "form") {
    try {
        const raw = process.env.REACT_APP_GOOGLE_ADS_CONVERSION;
        if (!raw) return;
        const sendTo = raw.includes("/") ? raw : `AW-18543287149/${raw}`;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "conversion", send_to: sendTo, event_category: "contact", event_label: kind, value: 1, currency: "EUR" });
    } catch {
        // le suivi ne doit jamais bloquer un appel
    }
}
