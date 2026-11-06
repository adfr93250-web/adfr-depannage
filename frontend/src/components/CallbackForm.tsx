import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { submitCallback, track, gtagConversion } from "@/lib/api";
import { SITE } from "@/data/site";
import { useLocation } from "react-router-dom";

const PANNE_TYPES = ["Remorquage", "Batterie", "Crevaison", "Panne de carburant", "Véhicule accidenté", "Autre panne"];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INPUT_CLS =
    "w-full bg-adfr-night/80 border border-adfr-chrome/25 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 transition-colors focus:border-adfr-electric focus:outline-none focus:ring-2 focus:ring-adfr-electric/40";

interface CallbackFormProps {
    defaultLieu?: string;
}

export default function CallbackForm({ defaultLieu = "" }: CallbackFormProps) {
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [lieu, setLieu] = useState(defaultLieu);
    const [typePanne, setTypePanne] = useState(PANNE_TYPES[0]);
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
    const { pathname } = useLocation();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (status === "loading") return;
        setStatus("loading");
        try {
            await submitCallback({ nom, telephone, lieu, type_panne: typePanne, zone: defaultLieu || undefined });
            track("form", pathname);
            gtagConversion("form");
            setStatus("done");
        } catch {
            setStatus("error");
        }
    };

    return (
        <section id="rappel" className="relative py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Rappel express</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Vous préférez être rappelé ?</h2>
                    <p className="mt-4 text-slate-400 leading-relaxed max-w-lg">
                        Remplissez ces quatre champs et un dépanneur vous rappelle dans quelques minutes. Mais le plus rapide reste l'appel direct :
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-slate-300">
                        <li className="flex items-center gap-2.5"><CheckCircle2 className="size-4 text-adfr-wa shrink-0" /> Intervention rapide 24h/24 – 7j/7</li>
                        <li className="flex items-center gap-2.5"><CheckCircle2 className="size-4 text-adfr-wa shrink-0" /> Dépannage sur place ou remorquage</li>
                        <li className="flex items-center gap-2.5"><CheckCircle2 className="size-4 text-adfr-wa shrink-0" /> Paiement sur place, CB ou espèces</li>
                    </ul>
                    <a
                        href={SITE.phoneHref}
                        data-testid="form-section-call-button"
                        onClick={() => { track("call", pathname); gtagConversion("call"); }}
                        className="mt-8 inline-flex items-center gap-3 bg-adfr-red hover:bg-adfr-redDark text-white font-display font-extrabold uppercase tracking-wide rounded-full px-7 py-4 shadow-[0_0_28px_rgba(var(--c-red-c),0.35)] transition-colors active:scale-[0.97]"
                    >
                        Appeler le {SITE.phoneDisplay}
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="rounded-3xl border border-adfr-chrome/20 bg-adfr-deep/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                    data-testid="callback-form-card"
                >
                    {status === "done" ? (
                        <div className="text-center py-10" data-testid="callback-form-success">
                            <CheckCircle2 className="size-14 text-adfr-wa mx-auto" />
                            <h3 className="mt-5 font-display text-2xl font-extrabold text-white">C'est reçu !</h3>
                            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                                Un dépanneur vous rappelle dans quelques minutes. Si c'est vraiment urgent, l'appel direct reste le plus rapide.
                            </p>
                            <a href={SITE.phoneHref} data-testid="success-call-button" onClick={() => { track("call", pathname); gtagConversion("call"); }} className="mt-6 inline-flex items-center gap-3 bg-adfr-red text-white font-display font-extrabold uppercase tracking-wide rounded-full px-6 py-3.5 transition-colors hover:bg-adfr-redDark">
                                {SITE.phoneDisplay}
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-4" data-testid="callback-form">
                            <div>
                                <label htmlFor="cb-nom" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Votre nom</label>
                                <input id="cb-nom" data-testid="callback-input-nom" required minLength={2} maxLength={80} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Jean Dupont" className={INPUT_CLS} />
                            </div>
                            <div>
                                <label htmlFor="cb-tel" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Votre téléphone</label>
                                <input id="cb-tel" data-testid="callback-input-telephone" required type="tel" inputMode="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" className={INPUT_CLS} />
                            </div>
                            <div>
                                <label htmlFor="cb-lieu" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Où êtes-vous ?</label>
                                <input id="cb-lieu" data-testid="callback-input-lieu" required value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Ex. Argenteuil, près de la gare" className={INPUT_CLS} />
                            </div>
                            <div>
                                <label htmlFor="cb-type" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Type de panne</label>
                                <select id="cb-type" data-testid="callback-input-type" value={typePanne} onChange={(e) => setTypePanne(e.target.value)} className={`${INPUT_CLS} [&>option]:bg-adfr-deep`}>
                                    {PANNE_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            {status === "error" && (
                                <p className="text-sm text-adfr-redLight font-semibold" data-testid="callback-form-error">
                                    L'envoi a échoué. Appelez-nous directement au {SITE.phoneDisplay}.
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                data-testid="callback-form-submit"
                                className="w-full inline-flex items-center justify-center gap-3 bg-adfr-electric hover:bg-adfr-electricDark disabled:opacity-70 text-white font-display font-extrabold uppercase tracking-wide rounded-xl py-4 transition-colors active:scale-[0.98]"
                            >
                                <Send className="size-4" />
                                {status === "loading" ? "Envoi..." : "Être rappelé maintenant"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
