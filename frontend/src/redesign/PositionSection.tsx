import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { SITE } from "@/redesign/data";
import { track } from "@/redesign/api";
import { SplitLines, Reveal } from "@/redesign/fx";

type GeoState = { kind: "idle" } | { kind: "loading" } | { kind: "found"; lat: number; lng: number } | { kind: "error"; message: string };

const ERROR_MESSAGES: Record<number, string> = {
    1: "Géolocalisation refusée. Activez-la dans votre navigateur, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.",
    2: "Impossible de déterminer votre position. Appelez-nous et décrivez-nous où vous êtes : on arrive quand même.",
    3: "La recherche a pris trop de temps. Réessayez, ou appelez-nous et décrivez-nous où vous êtes : on arrive quand même.",
};

export default function PositionSection() {
    const [state, setState] = useState<GeoState>({ kind: "idle" });
    const { pathname } = useLocation();

    const locate = () => {
        if (!("geolocation" in navigator)) return setState({ kind: "error", message: ERROR_MESSAGES[2] });
        setState({ kind: "loading" });
        navigator.geolocation.getCurrentPosition(
            (pos) => setState({ kind: "found", lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => setState({ kind: "error", message: ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES[2] }),
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
        );
    };

    const mapsLink = state.kind === "found" ? `https://maps.google.com/?q=${state.lat},${state.lng}` : "";
    const waHref = state.kind === "found" ? `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`${SITE.whatsappBase}\n\nMa position exacte : ${mapsLink}`)}` : "";
    const callBtn = (
        <a href={SITE.phoneHref} onClick={() => track("call", pathname, "Bloc position")} data-testid="position-call-button" className="btn btn-ghost w-full px-6 py-4 text-base !normal-case !tracking-normal">
            <PhoneCall className="size-5 shrink-0 animate-ring" aria-hidden="true" /> Ou appeler maintenant
        </a>
    );

    return (
        <section id="position" className="sheet overflow-hidden border-t border-adfr-chrome/10 bg-adfr-night2 py-28 md:py-44" data-testid="position-section">
            <div className="radar" aria-hidden="true">
                <i />
                <i />
                <i />
                <b />
            </div>
            <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
                <p className="eyebrow justify-center">Position</p>
                <SplitLines className="h-section mt-5 text-white">Envoyez votre position, on arrive plus vite.</SplitLines>
                <Reveal as="p" className="mx-auto mt-6 max-w-xl text-slate-300" delay={0.1}>
                    Autorisez la géolocalisation pour nous transmettre votre emplacement exact. Nos dépanneurs interviennent plus vite quand ils savent précisément où vous êtes.
                </Reveal>

                <Reveal className="mx-auto mt-10 max-w-md space-y-4" delay={0.2} aria-live="polite">
                    {state.kind === "idle" && (
                        <>
                            <button type="button" onClick={locate} data-testid="position-find-button" className="btn btn-electric w-full px-6 py-5 text-base md:text-lg">
                                <MapPin className="size-5 shrink-0" aria-hidden="true" /> Partager ma position
                            </button>
                            <p className="text-xs text-slate-500" data-testid="position-privacy-note">
                                Rien n'est envoyé sans votre accord : vous validez le message dans WhatsApp avant l'envoi.
                            </p>
                        </>
                    )}
                    {state.kind === "loading" && (
                        <button type="button" disabled data-testid="position-loading" className="btn btn-electric w-full cursor-wait px-6 py-5 text-base opacity-70">
                            <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" /> Recherche de votre position…
                        </button>
                    )}
                    {state.kind === "error" && (
                        <>
                            <div className="glass rounded-2xl !border-adfr-redLight/40 p-5 text-sm font-semibold text-adfr-redLight" data-testid="position-error" role="alert">
                                {state.message}
                            </div>
                            {callBtn}
                        </>
                    )}
                    {state.kind === "found" && (
                        <>
                            <div className="glass rounded-2xl !border-adfr-wa/40 p-5 font-semibold text-white" data-testid="position-status">
                                Position trouvée. Envoyez-la à {SITE.name} :
                            </div>
                            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp", pathname, "Bloc position")} data-testid="position-whatsapp-button" className="btn w-full bg-adfr-wa px-6 py-4 text-base !normal-case !tracking-normal text-white">
                                <MessageCircle className="size-5 shrink-0" aria-hidden="true" /> Envoyer par WhatsApp
                            </a>
                            {callBtn}
                        </>
                    )}
                </Reveal>
            </div>
        </section>
    );
}
