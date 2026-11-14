import { useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Send, PhoneCall, Loader2 } from "lucide-react";
import { SITE, PANNE_TYPES } from "@/redesign/data";
import { submitCallback, track } from "@/redesign/api";
import { useGeo } from "@/lib/urgence";
import { SplitLines, Reveal, Magnetic, useTilt } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

export default function CallbackForm({ defaultLieu = "" }: { defaultLieu?: string }) {
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [lieu, setLieu] = useState(defaultLieu);
    const [typePanne, setTypePanne] = useState(PANNE_TYPES[0]);
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
    const [more, setMore] = useState(false);
    const [sentAt, setSentAt] = useState("");
    const geo = useGeo();
    const { t, tr } = useT();
    const { pathname } = useLocation();
    const card = useTilt<HTMLDivElement>(2.5);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (status === "loading") return;
        setStatus("loading");
        try {
            // La position, si elle est connue, remplace le champ « Où êtes-vous ? »
            const where = lieu.trim().length >= 2 ? lieu : (geo.kind === "found" ? `https://maps.google.com/?q=${geo.lat},${geo.lng}` : "Non précisé");
            await submitCallback({ nom: nom.trim().length >= 2 ? nom : "Non précisé", telephone, lieu: where, type_panne: typePanne, zone: defaultLieu || undefined });
            setSentAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
            track("form", pathname, "Bloc formulaire");
            setStatus("done");
        } catch {
            setStatus("error");
        }
    };

    return (
        <section id="rappel" className="sheet overflow-hidden py-24 md:py-36">
            <div className="pointer-events-none absolute -right-40 top-10 size-[38rem] rounded-full bg-adfr-electric/20 blur-[160px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -left-40 bottom-0 size-[28rem] rounded-full bg-adfr-red/10 blur-[150px]" aria-hidden="true" />
            <div className="wrap relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                    <p className="eyebrow">{t("Rappel express", "Quick call-back")}</p>
                    <SplitLines className="h-section mt-5 text-white">
                        {t("Vous préférez", "Would you rather")} <span className="italic text-chrome">{t("être rappelé ?", "be called back?")}</span>
                    </SplitLines>
                    <Reveal as="p" className="mt-6 max-w-lg leading-relaxed text-slate-400" delay={0.1}>
                        {t("Deux champs suffisent : votre numéro et le type de panne. Un dépanneur vous rappelle dans quelques minutes. Mais le plus rapide reste l'appel direct :", "Two fields are enough: your number and the type of problem. A driver calls you back within minutes. But calling us directly is still the fastest:")}
                    </Reveal>
                    <Reveal as="ul" className="mt-7 space-y-3 text-sm text-slate-300" stagger={0.08} delay={0.15}>
                        <li className="flex items-center gap-3"><CheckCircle2 className="size-4 shrink-0 text-adfr-wa" aria-hidden="true" /> {t("Intervention rapide 24h/24 et 7j/7", "Fast call-outs 24/7")}</li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="size-4 shrink-0 text-adfr-wa" aria-hidden="true" /> {t("Dépannage sur place ou remorquage", "Roadside repair or towing")}</li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="size-4 shrink-0 text-adfr-wa" aria-hidden="true" /> {t("Paiement sur place, CB ou espèces", "Pay on site, card or cash")}</li>
                    </Reveal>
                    <Magnetic className="mt-9">
                        <a href={SITE.phoneHref} data-testid="form-section-call-button" data-cursor="Appeler" onClick={() => track("call", pathname, "Bloc formulaire")} className="btn btn-call px-7 py-[1.15rem] text-base md:text-lg">
                            <PhoneCall className="size-5 animate-ring" aria-hidden="true" /> {t("Appeler le", "Call")} {SITE.phoneDisplay}
                        </a>
                    </Magnetic>
                </div>

                <Reveal delay={0.1}>
                    <div ref={card} className="glass rounded-[2rem] p-6 md:p-10" data-testid="callback-form-card">
                        {status === "done" ? (
                            <div className="py-10 text-center" data-testid="callback-form-success" role="status">
                                <CheckCircle2 className="mx-auto size-16 text-adfr-wa" aria-hidden="true" />
                                <h3 className="mt-5 font-display text-3xl font-extrabold text-white">{t("C'est reçu !", "Got it!")}</h3>
                                <p className="mt-2 font-display text-lg font-bold text-adfr-wa" data-testid="callback-time">{t("Demande reçue à", "Request received at")} {sentAt}</p>
                                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-300">{t("Un dépanneur vous rappelle dans quelques minutes. Si c'est vraiment urgent, l'appel direct reste le plus rapide.", "A driver will call you back within minutes. If it is really urgent, calling us directly is still the fastest.")}</p>
                                <a href={SITE.phoneHref} data-testid="success-call-button" onClick={() => track("call", pathname, "Bloc formulaire")} className="btn btn-call mt-7 px-7 py-4">
                                    <PhoneCall className="size-5" aria-hidden="true" /> {SITE.phoneDisplay}
                                </a>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-4" data-testid="callback-form">
                                <div className="field">
                                    <input id="cb-tel" data-testid="callback-input-telephone" required type="tel" inputMode="tel" autoComplete="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" />
                                    <label htmlFor="cb-tel">{t("Votre téléphone", "Your phone number")}</label>
                                </div>
                                <div className="field">
                                    <select id="cb-type" data-testid="callback-input-type" value={typePanne} onChange={(e) => setTypePanne(e.target.value)}>
                                        {PANNE_TYPES.map((p) => (
                                            <option key={p} value={p}>{tr(p)}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="cb-type">{t("Type de panne", "Type of problem")}</label>
                                </div>
                                {more ? (
                                    <>
                                        <div className="field">
                                            <input id="cb-lieu" data-testid="callback-input-lieu" value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder={t("Ex. Argenteuil, près de la gare", "E.g. Argenteuil, near the station")} />
                                            <label htmlFor="cb-lieu">{t("Où êtes-vous ? (facultatif)", "Where are you? (optional)")}</label>
                                        </div>
                                        <div className="field">
                                            <input id="cb-nom" data-testid="callback-input-nom" maxLength={80} autoComplete="name" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Jean Dupont" />
                                            <label htmlFor="cb-nom">{t("Votre nom (facultatif)", "Your name (optional)")}</label>
                                        </div>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setMore(true)} data-testid="callback-more" className="text-xs font-bold text-adfr-electricLight underline underline-offset-4">
                                        {geo.kind === "found" ? t("Position déjà connue — préciser le lieu ou mon nom", "Position already known — add a place or my name") : t("Préciser le lieu ou mon nom (facultatif)", "Add a place or my name (optional)")}
                                    </button>
                                )}
                                {status === "error" && (
                                    <p className="text-sm font-semibold text-adfr-redLight" data-testid="callback-form-error" role="alert">
                                        {t("L'envoi a échoué. Appelez-nous directement au", "Sending failed. Call us directly on")} {SITE.phoneDisplay}.
                                    </p>
                                )}
                                <button type="submit" disabled={status === "loading"} data-testid="callback-form-submit" className="btn btn-electric w-full !rounded-2xl py-[1.15rem] text-base disabled:opacity-70">
                                    {status === "loading" ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                                    {status === "loading" ? t("Envoi...", "Sending...") : t("Être rappelé maintenant", "Call me back now")}
                                </button>
                            </form>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
