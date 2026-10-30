import { PhoneCall } from "lucide-react";
import { SITE } from "@/data/site";
import { track } from "@/lib/api";
import { useLocation } from "react-router-dom";

export default function StickyCallBar() {
    const { pathname } = useLocation();
    return (
        <a
            href={SITE.phoneHref}
            data-testid="sticky-call-bar"
            onClick={() => track("call", pathname)}
            className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-adfr-red pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(227,6,19,0.45)]"
        >
            <div className="flex items-center justify-center gap-3 py-3.5 px-4">
                <PhoneCall className="size-6 animate-ring shrink-0 text-white" />
                <span className="flex flex-col leading-tight text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-90">Urgence dépannage — 24/7</span>
                    <span className="font-display font-black text-xl tracking-wide">{SITE.phoneDisplay}</span>
                </span>
            </div>
        </a>
    );
}
