import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { SITE } from "@/data/site";
import { track, gtagConversion } from "@/lib/api";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BTN =
    "inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-base md:text-lg font-display transition-colors active:scale-[0.97] w-full";

type GeoState =
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "found"; lat: number; lng: number }
    | { kind: "error"; message: string };

const ERROR_MESSAGES: Record<number, string> = {
    1: "Géolocalisation refusée. Activez-la dans votre navigateur, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.",
    2: "Impossible de déterminer votre position. Appelez-nous et décrivez-nous où vous êtes : on arrive quand même.",
    3: "La recherche a pris trop de temps. Réessayez, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.",
};

export default function PositionSection() {
    const [state, setState] = useState<GeoState>({ kind: "idle" });
    const { pathname } = useLocation();

    const locate = () => {
        if (!("geolocation" in navigator)) {
            setState({ kind: "error", message: ERROR_MESSAGES[2] });
            return;
        }
        setState({ kind: "loading" });
        navigator.geolocation.getCurrentPosition(
            (pos) => setState({ kind: "found", lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => setState({ kind: "error", message: ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES[2] }),
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
        );
    };

    const mapsLink = state.kind === "found" ? `https://maps.google.com/?q=${state.lat},${state.lng}` : "";
    const waHref = state.kind === "found" ? `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`${SITE.whatsappBase}\n\nMa position exacte : ${mapsLink}`)}` : "";

    return (
        <section id="position" className="relative py-20 md:py-28" data-testid="position-section">
            <div className="mx-auto max-w-3xl px-4 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Position</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Envoyez votre position, on arrive plus vite.</h2>
                    <p className="mt-4 text-slate-300">
                        Autorisez la géolocalisation pour nous transmettre votre emplacement exact. Nos dépanneurs interviennent plus vite quand ils savent précisément où vous êtes.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="mt-8 space-y-4"
                >
                    {state.kind === "idle" && (
                        <>
                            <button onClick={locate} data-testid="position-find-button" className={`${BTN} bg-adfr-electric hover:opacity-90 text-white font-extrabold uppercase tracking-wide`}>
                                <MapPin className="size-5 shrink-0" /> Partager ma position
                            </button>
                            <p className="text-xs text-slate-500" data-testid="position-privacy-note">
                                Rien n'est envoyé sans votre accord : vous validez le message dans WhatsApp avant l'envoi.
                            </p>
                        </>
                    )}

                    {state.kind === "loading" && (
                        <button disabled data-testid="position-loading" className={`${BTN} bg-adfr-electric/60 text-white font-extrabold uppercase tracking-wide cursor-wait`}>
                            <Loader2 className="size-5 shrink-0 animate-spin" /> Recherche de votre position…
                        </button>
                    )}

                    {state.kind === "error" && (
                        <>
                            <div className="rounded-2xl border border-adfr-redLight/40 bg-adfr-deep2/60 p-5 text-sm font-semibold text-adfr-redLight" data-testid="position-error">
                                {state.message}
                            </div>
                            <a href={SITE.phoneHref} onClick={() => { track("call", pathname); gtagConversion("call"); }} data-testid="position-call-button" className={`${BTN} border border-adfr-chrome/40 bg-white/5 hover:bg-white/10 text-white font-bold`}>
                                <PhoneCall className="size-5 shrink-0 animate-ring" /> Ou appeler maintenant
                            </a>
                        </>
                    )}

                    {state.kind === "found" && (
                        <>
                            <div className="rounded-2xl border border-adfr-wa/40 bg-adfr-deep2/60 p-5 font-semibold text-white" data-testid="position-status">
                                Position trouvée. Envoyez-la à {SITE.name} :
                            </div>
                            <a
                                href={waHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => { track("whatsapp", pathname); gtagConversion("whatsapp"); }}
                                data-testid="position-whatsapp-button"
                                className={`${BTN} bg-adfr-wa hover:bg-[#1eb856] text-white font-bold`}
                            >
                                <MessageCircle className="size-5 shrink-0" /> Envoyer par WhatsApp
                            </a>
                            <a href={SITE.phoneHref} onClick={() => { track("call", pathname); gtagConversion("call"); }} data-testid="position-call-button" className={`${BTN} border border-adfr-chrome/40 bg-white/5 hover:bg-white/10 text-white font-bold`}>
                                <PhoneCall className="size-5 shrink-0 animate-ring" /> Ou appeler maintenant
                            </a>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
}