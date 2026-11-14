import { Component, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/redesign/redesign.css";
import { scrollToId, scrollTop, ScrollTrigger } from "@/redesign/motion";
import Header from "@/redesign/Header";
import Footer from "@/redesign/Footer";
import { StickyCallBar, WhatsAppFloat } from "@/redesign/Floating";
import { SafetySheet } from "@/redesign/Urgence";
import { CookieBanner } from "@/redesign/Cookies";
import Home from "@/redesign/Home";
import ZonePage from "@/redesign/ZonePage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import { SITE } from "@/redesign/data";

/** Quoi qu'il arrive à l'affichage, le numéro d'urgence reste joignable. */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
    state = { error: false };
    static getDerivedStateFromError() {
        return { error: true };
    }
    render() {
        if (!this.state.error) return this.props.children;
        return (
            <div className="grid min-h-screen place-items-center bg-adfr-night px-6 text-center">
                <div>
                    <p className="mb-3 font-display text-3xl font-black text-white">Un souci d'affichage</p>
                    <p className="mb-8 text-slate-400">Votre urgence n'attend pas : appelez directement le {SITE.phoneDisplay}.</p>
                    <a href={SITE.phoneHref} data-testid="error-call-button" className="btn btn-call px-8 py-4">
                        Appeler le {SITE.phoneDisplay}
                    </a>
                </div>
            </div>
        );
    }
}

function ScrollManager() {
    const { pathname, state } = useLocation();
    useEffect(() => {
        const target = (state as { scrollTo?: string } | null)?.scrollTo;
        const refresh = setTimeout(() => ScrollTrigger.refresh(), 250);
        if (target) {
            const t = setTimeout(() => scrollToId(target), 450);
            return () => {
                clearTimeout(t);
                clearTimeout(refresh);
            };
        }
        scrollTop();
        return () => clearTimeout(refresh);
    }, [pathname, state]);
    return null;
}

/** Les pages reprises telles quelles de l'ancien design (admin, 404) ont besoin de la marge sous l'en-tête fixe. */
function Legacy({ children }: { children: ReactNode }) {
    return <div className="relative z-[2] min-h-screen bg-adfr-night pt-20 md:pt-24">{children}</div>;
}

export default function Shell() {
    useEffect(() => {
        if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
        // Sans réseau, une page demandée est remplacée par la page ultra-légère avec le numéro
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
        // Les images et polices modifient les hauteurs : on recalcule les repères de défilement
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        document.fonts?.ready.then(refresh);
        return () => window.removeEventListener("load", refresh);
    }, []);
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold focus:text-adfr-night">
                    Aller au contenu
                </a>
                <ScrollManager />
                <Header />
                <main id="contenu" className="relative z-[1]">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<Legacy><AdminPage /></Legacy>} />
                        <Route path="/:slug" element={<ZonePage />} />
                        <Route path="*" element={<Legacy><NotFound /></Legacy>} />
                    </Routes>
                </main>
                <Footer />
                <StickyCallBar />
                <WhatsAppFloat />
                <SafetySheet />
                <CookieBanner />
            </BrowserRouter>
        </ErrorBoundary>
    );
}
