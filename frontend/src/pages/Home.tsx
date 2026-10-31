import Seo, { localBusinessLd, faqPageLd, websiteLd } from "@/components/Seo";
import Hero from "@/components/Hero";
import TrustMarquee from "@/components/TrustMarquee";
import Services from "@/components/Services";
import ZonesMap from "@/components/ZonesMap";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import CallbackForm from "@/components/CallbackForm";
import PositionSection from "@/components/PositionSection";
import { FAQ_HOME, SITE } from "@/data/site";

export default function Home() {
    return (
        <>
            <Seo
                title="ADFR — Dépannage & Remorquage Île-de-France 24/7"
                description={`Dépannage et remorquage 24h/24, 7j/7, partout en Île-de-France. Intervention en 20 minutes. Appelez le ${SITE.phoneDisplay} — intervention rapide, paiement sur place.`}
                path="/"
                jsonLd={[localBusinessLd(), websiteLd(), faqPageLd(FAQ_HOME)]}
            />
            <Hero />
            <TrustMarquee />
            <Services />
            <ZonesMap />
            <Process />
            <Gallery />
            <Reviews />
            <Faq items={FAQ_HOME} />
            <CallbackForm />
            <PositionSection />
        </>
    );
}
