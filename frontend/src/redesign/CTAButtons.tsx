import { useLocation } from "react-router-dom";
import { PhoneCall, MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/redesign/data";
import { track } from "@/redesign/api";
import { Magnetic } from "@/redesign/fx";
import { useLang } from "@/lib/urgence";

interface CtaProps {
    testId: string;
    className?: string;
    where?: string;
    size?: "md" | "lg";
}

const SIZE = { md: "px-6 py-3.5 text-sm md:text-base", lg: "px-7 py-[1.15rem] text-base md:text-lg" };

export function CallButton({ testId, className = "", where = "Bouton principal", size = "lg", label }: CtaProps & { label?: string }) {
    const { pathname } = useLocation();
    return (
        <Magnetic className={className}>
            <a href={SITE.phoneHref} data-testid={testId} data-cursor="Appeler" onClick={() => track("call", pathname, where)} className={`btn btn-call w-full ${SIZE[size]}`} aria-label={`Appeler ${SITE.name} au ${SITE.phoneDisplay}`}>
                <PhoneCall className="size-5 shrink-0 animate-ring" aria-hidden="true" />
                <span>{label ?? SITE.phoneDisplay}</span>
            </a>
        </Magnetic>
    );
}

export function WhatsAppButton({ testId, className = "", where = "Bouton principal", place, size = "lg", label }: CtaProps & { place?: string; label?: string }) {
    const { pathname } = useLocation();
    const { t } = useLang();
    return (
        <Magnetic className={className} strength={0.25}>
            <a href={whatsappUrl(place)} target="_blank" rel="noopener noreferrer" data-testid={testId} onClick={() => track("whatsapp", pathname, where)} className={`btn btn-wa w-full ${SIZE[size]} !normal-case !tracking-normal !font-bold`}>
                <MessageCircle className="size-5 shrink-0 text-adfr-wa" aria-hidden="true" />
                <span>{label ?? t("WhatsApp — envoyer ma panne", "WhatsApp — send my problem")}</span>
            </a>
        </Magnetic>
    );
}
