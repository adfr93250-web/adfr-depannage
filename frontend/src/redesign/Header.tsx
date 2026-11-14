import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Sun, Moon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { SITE, whatsappUrl } from "@/redesign/data";
import { gsap, scrollToId, lockScroll, REDUCED } from "@/redesign/motion";
import { track } from "@/redesign/api";
import { setLang, setTheme, useLang, useTheme } from "@/lib/urgence";
import { Magnetic } from "@/redesign/fx";

const LINKS = [
    { id: "services", label: "Services", en: "Services" },
    { id: "zones", label: "Zones IDF", en: "Areas" },
    { id: "avis", label: "Avis", en: "Reviews" },
    { id: "faq", label: "FAQ", en: "FAQ" },
];

/** Réglages rapides : langue (FR/EN) et thème clair / sombre. */
function QuickSettings({ className = "" }: { className?: string }) {
    const { lang } = useLang();
    const light = useTheme() === "light";
    const themeLabel = lang === "fr" ? (light ? "Passer en mode sombre" : "Passer en mode clair") : light ? "Switch to dark mode" : "Switch to light mode";
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <button type="button" onClick={() => {
                    setLang(lang === "fr" ? "en" : "fr");
                    window.location.reload();
                }} data-testid="lang-toggle" aria-label={lang === "fr" ? "Switch to English" : "Passer en français"} className="glass grid h-10 min-w-10 place-items-center rounded-full px-2.5 font-display text-xs font-black text-white">
                {lang === "fr" ? "EN" : "FR"}
            </button>
            <button type="button" onClick={() => setTheme(light ? "dark" : "light")} data-testid="theme-toggle" aria-label={themeLabel} title={themeLabel} className="glass grid size-10 place-items-center rounded-full text-white">
                {light ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
            </button>
        </div>
    );
}

export default function Header() {
    const ref = useRef<HTMLElement>(null);
    const ind = useRef<HTMLSpanElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { lang, t } = useLang();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        lockScroll(open);
        const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [open]);

    // Menu mobile : les liens montent un par un
    useGSAP(
        () => {
            if (!open || REDUCED) return;
            gsap.from(".mm-link", { yPercent: 100, duration: 0.35, stagger: 0.03 });
        },
        { scope: ref, dependencies: [open] },
    );

    const go = (id: string) => (e: MouseEvent) => {
        e.preventDefault();
        setOpen(false);
        if (location.pathname !== "/") navigate("/", { state: { scrollTo: id } });
        else setTimeout(() => scrollToId(id), open ? 60 : 0);
    };

    // Logo : ferme le menu ; si on est déjà sur l'accueil, remonte en haut de page au lieu de ne rien faire
    const goHome = (e: MouseEvent) => {
        setOpen(false);
        if (location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
        }
    };

    const moveInd = (e: MouseEvent<HTMLAnchorElement>) => {
        const a = e.currentTarget;
        gsap.to(ind.current, { x: a.offsetLeft, width: a.offsetWidth, opacity: 1, duration: 0.5, ease: "expo.out" });
    };

    return (
        <header ref={ref} className="fixed inset-x-0 top-0 z-[70]">
            <div className={`transition-[padding] duration-500 ${scrolled ? "py-2.5" : "py-4 md:py-5"}`}>
                <div className="wrap flex items-center justify-between gap-3">
                    <Link to="/" onClick={goHome} data-testid="header-logo-link" aria-label={`${SITE.fullName} — accueil`} className="shrink-0 rounded-xl bg-white px-2.5 py-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-expo hover:scale-[1.04]">
                        <img src={SITE.logo} alt={SITE.fullName} width={1042} height={435} className={`w-auto transition-[height] duration-500 ${scrolled ? "h-9 md:h-10" : "h-10 md:h-12"}`} />
                    </Link>

                    <nav aria-label="Navigation principale" className="nav-pill glass relative hidden items-center rounded-full p-1.5 lg:flex" onMouseLeave={() => gsap.to(ind.current, { opacity: 0, duration: 0.3 })}>
                        <span ref={ind} className="nav-pill__ind" />
                        {LINKS.map((l) => (
                            <a key={l.id} href={`/#${l.id}`} data-testid={`nav-link-${l.id}`} onClick={go(l.id)} onMouseEnter={moveInd}>
                                {lang === "en" ? l.en : l.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <QuickSettings className="hidden sm:flex" />
                        <Magnetic strength={0.3}>
                            <a href={SITE.phoneHref} data-testid="header-call-button" data-cursor="Appeler" onClick={() => track("call", location.pathname, "En-tête")} className="btn btn-call px-4 py-3 text-sm md:px-6 md:text-base" aria-label={`Appeler le ${SITE.phoneDisplay}`}>
                                <Phone className="size-4 animate-ring md:size-5" aria-hidden="true" />
                                <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
                                <span className="sm:hidden">{t("Appeler", "Call")}</span>
                            </a>
                        </Magnetic>
                        <button type="button" className="burger glass grid size-12 place-items-center rounded-full lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} data-testid="menu-toggle" onClick={() => setOpen((v) => !v)}>
                            <span className="flex flex-col gap-1.5">
                                <span />
                                <span />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {open && (<div id="mobile-menu" className="fixed inset-0 -z-10 flex flex-col justify-between overflow-y-auto bg-adfr-night/95 px-6 pb-28 pt-28 backdrop-blur-2xl lg:hidden" data-testid="mobile-menu">
                <nav aria-label="Menu" className="flex flex-col gap-1">
                    {LINKS.map((l, i) => (
                        <a key={l.id} href={`/#${l.id}`} onClick={go(l.id)} className="group flex items-baseline gap-4 overflow-hidden border-b border-white/10 py-4">
                            <span className="mm-link display block text-[13vw] leading-none text-white">{lang === "en" ? l.en : l.label}</span>
                            <span className="text-xs font-bold text-adfr-redLight">0{i + 1}</span>
                        </a>
                    ))}
                </nav>
                <div className="mm-foot space-y-3">
                    <QuickSettings />
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{t(`${SITE.hours.long}, ${SITE.hours.days}`, "24/7, Sunday to Friday, public holidays included")}</p>
                    <a href={SITE.phoneHref} onClick={() => track("call", location.pathname, "Menu mobile")} className="btn btn-call w-full px-6 py-4 text-lg">
                        <Phone className="size-5 animate-ring" aria-hidden="true" /> {SITE.phoneDisplay}
                    </a>
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp", location.pathname, "Menu mobile")} className="btn btn-wa w-full px-6 py-4 !normal-case">
                        <MessageCircle className="size-5 text-adfr-wa" aria-hidden="true" /> WhatsApp
                    </a>
                </div>
            </div>)}
        </header>
    );
}
