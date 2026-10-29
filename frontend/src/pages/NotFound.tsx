import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { CallButton } from "@/components/CTAButtons";

export default function NotFound() {
    return (
        <section className="relative overflow-hidden bg-adfr-night min-h-[70vh] grid place-items-center px-4 py-24">
            <div className="pointer-events-none absolute -top-32 right-[-10%] size-[480px] rounded-full bg-adfr-electric/20 blur-[130px]" />
            <div className="relative text-center max-w-xl">
                <p className="font-display font-black text-7xl text-chrome select-none">404</p>
                <h1 className="mt-4 font-display text-2xl md:text-3xl font-extrabold text-white">Cette page n'existe pas (ou plus).</h1>
                <p className="mt-3 text-slate-400">Votre panne, elle, existe toujours. Le plus rapide, c'est l'appel.</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <CallButton testId="notfound-call-button" />
                    <Link to="/" data-testid="notfound-home-link" className="inline-flex items-center justify-center rounded-full border border-adfr-chrome/30 px-6 py-4 font-display font-bold text-white transition-colors hover:border-white">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </section>
    );
}
