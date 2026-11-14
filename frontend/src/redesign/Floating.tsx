import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { SITE, whatsappUrl } from "@/redesign/data";
import { track } from "@/redesign/api";
import { gsap, scrollToId, REDUCED } from "@/redesign/motion";
import { useLang } from "@/lib/urgence";
import { sendPosition } from "@/redesign/Urgence";

/** Barre d'appel fixe en bas d'écran sur mobile (90 % du trafic) — reprise du site original, toujours accessible. */
export function StickyCallBar() {
    const { pathname } = useLocation();
    const { lang, t } = useLang();
    return (
        <div className="fixed inset-x-0 bottom-0 z-[80] flex pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(227,6,19,0.45)] md:hidden" data-testid="sticky-call-bar">
            <a href={SITE.phoneHref} data-testid="sticky-call-button" onClick={() => track("call", pathname, "Barre du bas")} className="flex flex-[2] items-center justify-center gap-3 bg-adfr-red px-4 py-3.5">
                <PhoneCall className="size-6 shrink-0 animate-ring text-white" aria-hidden="true" />
                <span className="flex flex-col leading-tight text-white">
                    <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] opacity-90">{t("Urgence dépannage", "Breakdown emergency")} — {t(SITE.hours.tag, "24/7")}</span>
                    <span className="font-display text-xl font-black tracking-wide">{SITE.phoneDisplay}</span>
                </span>
            </a>
            <button
                type="button"
                onClick={() => {
                    // Un seul geste : on montre le panneau d'urgence et on demande la position tout de suite
                    scrollToId(document.getElementById("urgence") ? "urgence" : "position");
                    sendPosition(lang, pathname);
                }}
                data-testid="sticky-position-button" className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-adfr-deep2">
                <MapPin className="size-5 shrink-0 text-adfr-wa" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white">Position</span>
            </button>
        </div>
    );
}

export function WhatsAppFloat() {
    const { pathname } = useLocation();
    return (
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp" data-testid="whatsapp-float-button" data-cursor="WhatsApp" onClick={() => track("whatsapp", pathname, "Bulle WhatsApp")} className="group fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-4 z-[60] md:bottom-6 md:right-6">
            <span className="absolute inset-0 animate-ping rounded-full bg-adfr-wa opacity-30" />
            <span className="relative grid size-14 place-items-center rounded-full bg-adfr-wa shadow-2xl transition-transform duration-500 ease-expo group-hover:scale-110 group-active:scale-95">
                <MessageCircle className="size-7 text-white" aria-hidden="true" />
            </span>
        </a>
    );
}

/** Rideau bleu qui se lève à chaque changement de page. */
export function Curtain() {
    const { pathname } = useLocation();
    const ref = useRef<HTMLDivElement>(null);
    const first = useRef(true);
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        if (REDUCED || !ref.current) return;
        gsap.fromTo(ref.current, { clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut", delay: 0.05 });
    }, [pathname]);
    return <div ref={ref} className="curtain" aria-hidden="true" />;
}

/** Fine barre de progression de lecture en haut de page. */
export function ScrollProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        const on = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setP(max > 0 ? window.scrollY / max : 0);
        };
        on();
        window.addEventListener("scroll", on, { passive: true });
        return () => window.removeEventListener("scroll", on);
    }, []);
    return <div className="fixed inset-x-0 top-0 z-[71] h-[2px] origin-left bg-adfr-red" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}
