import { Component, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { initLenis, destroyLenis, getLenis, scrollToId } from "@/lib/lenis";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Home from "@/pages/Home";
import ZonePage from "@/pages/ZonePage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import { SITE } from "@/data/site";
import { BRAND } from "@/data/brand";
import { SafetySheet } from "@/components/Urgence";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
    state = { error: false };
    static getDerivedStateFromError() {
        return { error: true };
    }
    render() {
        if (this.state.error) {
            return (
                <div className="min-h-screen grid place-items-center bg-adfr-night text-center px-6">
                    <div>
                        <p className="font-display text-3xl font-black text-white mb-3">Un souci d'affichage</p>
                        <p className="text-slate-400 mb-8">Votre urgence n'attend pas : appelez directement le {SITE.phoneDisplay}.</p>
                        <a
                            href={SITE.phoneHref}
                            data-testid="error-call-button"
                            className="inline-flex items-center gap-3 bg-adfr-red text-white font-display font-extrabold uppercase tracking-wide rounded-full px-8 py-4"
                        >
                            Appeler le {SITE.phoneDisplay}
                        </a>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function ScrollManager() {
    const { pathname, state } = useLocation();
    useEffect(() => {
        const target = (state as { scrollTo?: string } | null)?.scrollTo;
        if (target) {
            const t = setTimeout(() => scrollToId(target), 420);
            return () => clearTimeout(t);
        }
        getLenis()?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    useEffect(() => {
        initLenis();
        // Sans réseau, une page demandée est remplacée par la page ultra-légère avec le numéro
        if (process.env.NODE_ENV === "production" && BRAND.id === "adfr" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
        return () => destroyLenis();
    }, []);
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <ScrollManager />
                <Header />
                <main className="pt-16 md:pt-20">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/:slug" element={<ZonePage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
                <StickyCallBar />
                <WhatsAppFloat />
                {BRAND.id === "adfr" && <SafetySheet />}
            </BrowserRouter>
        </ErrorBoundary>
    );
}
