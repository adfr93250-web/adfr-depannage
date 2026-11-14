import { MapPin, PhoneCall } from "lucide-react";
import { SITE } from "@/data/site";
import { BRAND } from "@/data/brand";
import { track, gtagConversion } from "@/lib/api";
import { scrollToId } from "@/lib/lenis";
import { useLocation } from "react-router-dom";

export default function StickyCallBar() {
    const { pathname } = useLocation();
    return (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden flex pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(var(--c-red-c),0.45)]" data-testid="sticky-call-bar">
            <a
                href={SITE.phoneHref}
                data-testid="sticky-call-button"
                onClick={() => { track("call", pathname, "Barre du bas"); gtagConversion("call"); }}
                className="flex-[2] flex items-center justify-center gap-3 py-3.5 px-4 bg-adfr-red"
            >
                <PhoneCall className="size-6 animate-ring shrink-0 text-white" />
                <span className="flex flex-col leading-tight text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-90">Urgence dépannage — {BRAND.hours.tag}</span>
                    <span className="font-display font-black text-xl tracking-wide">{SITE.phoneDisplay}</span>
                </span>
            </a>
            <button
                onClick={() => scrollToId("position")}
                data-testid="sticky-position-button"
                className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-adfr-deep2"
            >
                <MapPin className="size-5 text-adfr-wa shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white">Position</span>
            </button>
        </div>
    );
}
