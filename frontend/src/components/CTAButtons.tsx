import { useLocation } from "react-router-dom";
import { PhoneCall, MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/data/site";
import { track } from "@/lib/api";

interface CtaProps {
    where?: string;
    testId: string;
    className?: string;
}

export const CALL_BTN =
    "inline-flex items-center justify-center gap-3 bg-adfr-red hover:bg-[#c00511] text-white font-display font-extrabold uppercase tracking-wide rounded-full shadow-[0_0_28px_rgba(227,6,19,0.35)] transition-colors active:scale-[0.97] px-6 py-4 text-base md:text-lg";

export const WA_BTN =
    "inline-flex items-center justify-center gap-3 bg-adfr-wa hover:bg-[#1eb856] text-white font-display font-bold rounded-full shadow-[0_0_24px_rgba(37,211,102,0.3)] transition-colors active:scale-[0.97] px-6 py-4 text-base md:text-lg";

export function CallButton({ where, testId, className }: CtaProps) {
    const { pathname } = useLocation();
    return (
        <a href={SITE.phoneHref} data-testid={testId} className={`${CALL_BTN} ${className ?? ""}`} onClick={() => track("call", where || pathname)}>
            <PhoneCall className="size-5 animate-ring shrink-0" />
            <span>{SITE.phoneDisplay}</span>
        </a>
    );
}

export function CallLabelButton({ where, label, testId, className }: CtaProps & { label: string }) {
    const { pathname } = useLocation();
    return (
        <a href={SITE.phoneHref} data-testid={testId} className={`${CALL_BTN} ${className ?? ""}`} onClick={() => track("call", where || pathname)}>
            <PhoneCall className="size-5 animate-ring shrink-0" />
            <span>{label}</span>
        </a>
    );
}

export function WhatsAppButton({ where, place, testId, className }: CtaProps & { place?: string }) {
    const { pathname } = useLocation();
    return (
        <a
            href={whatsappUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={testId}
            className={`${WA_BTN} ${className ?? ""}`}
            onClick={() => track("whatsapp", where || pathname)}
        >
            <MessageCircle className="size-5 shrink-0" />
            <span>WhatsApp — envoyer ma panne</span>
        </a>
    );
}
