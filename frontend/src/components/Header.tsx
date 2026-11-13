import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { SITE } from "@/data/site";
import { scrollToId } from "@/lib/lenis";
import { track, gtagConversion } from "@/lib/api";

const LINKS = [
    { id: "services", label: "Services" },
    { id: "zones", label: "Zones IDF" },
    { id: "avis", label: "Avis" },
    { id: "faq", label: "FAQ" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const go = (id: string) => (e: MouseEvent) => {
        e.preventDefault();
        if (location.pathname !== "/") navigate("/", { state: { scrollTo: id } });
        else scrollToId(id);
    };

    return (
        <header
            className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
                scrolled ? "bg-adfr-deep/90 backdrop-blur-xl border-b border-adfr-chrome/15" : "bg-adfr-night/80 backdrop-blur-md border-b border-adfr-chrome/10"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
                <Link to="/" data-testid="header-logo-link" className="shrink-0">
                    <img src={SITE.logo} alt={SITE.fullName} className="h-11 md:h-14 w-auto rounded-lg bg-white px-2.5 py-1" />
                </Link>
                <nav className="hidden lg:flex items-center gap-8">
                    {LINKS.map((l) => (
                        <a
                            key={l.id}
                            href={`#${l.id}`}
                            data-testid={`nav-link-${l.id}`}
                            onClick={go(l.id)}
                            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
                <a
                    href={SITE.phoneHref}
                    data-testid="header-call-button"
                    onClick={() => { track("call", location.pathname, "En-tête"); gtagConversion("call"); }}
                    className="inline-flex items-center gap-2.5 bg-adfr-red hover:bg-adfr-redDark text-white font-display font-extrabold uppercase tracking-wide rounded-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base shadow-[0_0_24px_rgba(var(--c-red-c),0.35)] transition-colors active:scale-[0.97]"
                >
                    <Phone className="size-4 md:size-5 animate-ring" />
                    <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
                    <span className="sm:hidden">Appeler</span>
                </a>
            </div>
        </header>
    );
}
