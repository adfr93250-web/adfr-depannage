import { useLocation } from "react-router-dom";
import { CheckCircle2, Clock3, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import Seo, { localBusinessLd, faqPageLd } from "@/components/Seo";
import { CallButton, WhatsAppButton } from "@/redesign/CTAButtons";
import Process from "@/redesign/Process";
import Reviews from "@/redesign/Reviews";
import Faq from "@/redesign/Faq";
import CallbackForm from "@/redesign/CallbackForm";
import NotFound from "@/pages/NotFound";
import { getLanding } from "@/data/landings";
import { SITE } from "@/redesign/data";

/**
 * Page d'arrivée d'une annonce Google Ads : le titre reprend la recherche, le numéro est visible
 * dès l'ouverture sur téléphone, et le haut de page n'a aucune animation (affichage immédiat).
 */
export default function AdLanding() {
    const { pathname } = useLocation();
    const page = getLanding(pathname);
    if (!page) return <div className="relative z-[2] min-h-screen bg-adfr-night pt-20 md:pt-24"><NotFound /></div>;

    return (
        <div key={page.path} data-testid="ad-landing">
            <Seo title={page.seoTitle} description={page.seoDescription} path={page.path} jsonLd={[localBusinessLd(page.lieu ? { name: page.lieu } : undefined), faqPageLd(page.faq)]} />

            <section className="sheet relative overflow-hidden" data-testid="landing-hero">
                <div className="pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-adfr-electric/20 blur-[140px]" aria-hidden="true" />
                <div className="wrap relative pb-12 pt-24 md:pb-20 md:pt-36">
                    <p className="glass inline-flex w-fit items-center gap-3 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200 sm:text-[11px]">
                        <span className="pulse-dot" />
                        {page.eyebrow}
                    </p>

                    <h1 className="display mt-5 max-w-5xl text-[clamp(2rem,7vw,5.2rem)] leading-[1.02] text-white" data-testid="landing-h1">
                        {page.h1} <span className="italic text-adfr-red">{page.h1Accent}</span>
                    </h1>
                    <p className="mt-3 font-display text-lg font-extrabold text-white md:text-2xl">
                        Sur place {SITE.delay.long}, {SITE.hours.long}.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <CallButton testId="landing-call-hero" where="Page annonce" className="w-full sm:w-auto" label={`Appeler le ${SITE.phoneDisplay}`} />
                        <WhatsAppButton testId="landing-whatsapp-hero" where="Page annonce" place={page.lieu || undefined} className="w-full sm:w-auto" />
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-200">
                        <li className="flex items-center gap-1.5"><Clock3 className="size-4 text-adfr-red" aria-hidden="true" /> En moyenne {SITE.delay.short}</li>
                        <li className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-adfr-red" aria-hidden="true" /> 7j/7, {SITE.hours.days}</li>
                        <li className="flex items-center gap-1.5"><CreditCard className="size-4 text-adfr-red" aria-hidden="true" /> Carte ou espèces, sur place</li>
                    </ul>

                    <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{page.intro}</p>

                    <ul className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-2" data-testid="landing-points">
                        {page.points.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-sm text-slate-200 md:text-base">
                                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-adfr-red" aria-hidden="true" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="sheet border-y border-adfr-chrome/10 bg-adfr-night2 py-14 md:py-20" data-testid="landing-zones">
                <div className="wrap">
                    <h2 className="font-display text-2xl font-extrabold text-white md:text-3xl">{page.zonesTitle}</h2>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {page.zones.map((z) => (
                            <span key={z} className="chip inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-adfr-red" aria-hidden="true" />{z}</span>
                        ))}
                    </div>
                    <div className="mt-8 max-w-sm">
                        <CallButton testId="landing-call-zones" where="Page annonce (zones)" size="md" label={`Appeler le ${SITE.phoneDisplay}`} />
                    </div>
                </div>
            </section>

            <Process />
            <Reviews />
            <Faq items={page.faq} title="Vos questions, nos réponses." />
            <CallbackForm defaultLieu={page.lieu} />
        </div>
    );
}
