import Seo, { localBusinessLd, faqPageLd, websiteLd } from "@/components/Seo";
import Hero from "@/redesign/Hero";
import Manifesto from "@/redesign/Manifesto";
import Urgence from "@/redesign/Urgence";
import Marquee from "@/redesign/Marquee";
import Services from "@/redesign/Services";
import Zones from "@/redesign/Zones";
import Process from "@/redesign/Process";
import Gallery from "@/redesign/Gallery";
import Reviews from "@/redesign/Reviews";
import Faq from "@/redesign/Faq";
import CallbackForm from "@/redesign/CallbackForm";
import PositionSection from "@/redesign/PositionSection";
import { FAQ_HOME, SITE } from "@/redesign/data";

export default function Home() {
    return (
        <>
            <Seo
                title={`${SITE.name} — Dépannage & Remorquage Île-de-France ${SITE.hours.tag}`}
                description={`Dépannage et remorquage ${SITE.hours.long}, partout en Île-de-France. Intervention ${SITE.delay.long}. Appelez le ${SITE.phoneDisplay} — intervention rapide, paiement sur place.`}
                path="/"
                jsonLd={[localBusinessLd(), websiteLd(), faqPageLd(FAQ_HOME)]}
            />
            <Hero />
            <Urgence />
            <Manifesto />
            <Marquee />
            <Services />
            <Zones />
            <Process />
            <Gallery />
            <Reviews />
            <Faq items={FAQ_HOME} />
            <CallbackForm />
            <PositionSection />
        </>
    );
}
