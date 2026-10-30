import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/data/site";
import { track } from "@/lib/api";

export default function WhatsAppFloat() {
    const { pathname } = useLocation();
    return (
        <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Écrire sur WhatsApp"
            data-testid="whatsapp-float-button"
            onClick={() => track("whatsapp", pathname)}
            className="fixed right-4 bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-6 z-40 group"
        >
            <span className="absolute inset-0 rounded-full bg-adfr-wa opacity-30 animate-ping" />
            <span className="relative grid place-items-center size-14 rounded-full bg-adfr-wa shadow-2xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                <MessageCircle className="size-7 text-white" />
            </span>
        </a>
    );
}
