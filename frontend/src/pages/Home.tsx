import Seo, { localBusinessLd, faqPageLd, websiteLd } from "@/components/Seo";
import Hero from "@/components/Hero";
import HeroSos from "@/components/HeroSos";
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
import { BRAND } from "@/data/brand";

export default function Home() {
    return (
        <>
            <Seo
                title={`${SITE.name} — Dépannage & Remorquage Île-de-France ${BRAND.hours.tag}`}
                description={`Dépannage et remorquage ${BRAND.hours.long}, partout en Île-de-France. Intervention ${BRAND.delay.long}. Appelez le ${SITE.phoneDisplay} — intervention rapide, paiement sur place.`}
                path="/"
                jsonLd={[localBusinessLd(), websiteLd(), faqPageLd(FAQ_HOME)]}
            />
            {BRAND.id === "sos" ? <HeroSos /> : <Hero />}
            <TrustMarquee />
            <Services />
            <ZonesMap />
            {BRAND.showProcess && <Process />}
            {BRAND.showGallery && <Gallery />}
            <Reviews />
            <Faq items={FAQ_HOME} />
            {BRAND.showCallbackForm && <CallbackForm />}
            <PositionSection />
        </>
    );
}
