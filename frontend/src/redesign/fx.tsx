/** Petites briques d'animation réutilisées par toutes les sections. */
import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, REDUCED, FINE } from "@/redesign/motion";

gsap.registerPlugin(useGSAP);

interface SplitProps {
    as?: ElementType;
    className?: string;
    children: ReactNode;
    delay?: number;
    id?: string;
}

/** Titre révélé ligne par ligne, chaque ligne glissant hors d'un masque. */
export function SplitLines({ as: Tag = "h2", className, children, delay = 0, id }: SplitProps) {
    const ref = useRef<HTMLElement>(null);
    useGSAP(
        () => {
            if (REDUCED || !ref.current) return;
            const split = SplitText.create(ref.current, {
                type: "lines",
                mask: "lines",
                linesClass: "split-line",
                autoSplit: true,
                onSplit: (self) =>
                    gsap.from(self.lines, { yPercent: 105, duration: 0.5, stagger: 0.05, delay: Math.min(delay, 0.1), scrollTrigger: { trigger: ref.current, start: "top 96%", once: true } }),
            });
            return () => split.revert();
        },
        { scope: ref },
    );
    return (
        <Tag ref={ref} className={className} id={id}>
            {children}
        </Tag>
    );
}

interface RevealProps {
    as?: ElementType;
    className?: string;
    children: ReactNode;
    delay?: number;
    y?: number;
    /** Anime les enfants directs en cascade plutôt que le bloc entier */
    stagger?: number;
    style?: CSSProperties;
    [key: `data-${string}`]: string | undefined;
    [key: `aria-${string}`]: string | undefined;
}

/** Apparition douce (fondu + léger flou) à l'entrée dans l'écran. */
export function Reveal({ as: Tag = "div", className, children, delay = 0, y = 18, stagger, style, ...rest }: RevealProps) {
    const ref = useRef<HTMLElement>(null);
    useGSAP(
        () => {
            if (REDUCED || !ref.current) return;
            const targets = stagger ? Array.from(ref.current.children) : ref.current;
            gsap.from(targets, { autoAlpha: 0, y: Math.min(y, 18), duration: 0.4, delay: Math.min(delay, 0.08), stagger: Math.min(stagger ?? 0, 0.04), clearProps: "transform", scrollTrigger: { trigger: ref.current, start: "top 97%", once: true } });
        },
        { scope: ref },
    );
    return (
        <Tag ref={ref} className={className} style={style} {...rest}>
            {children}
        </Tag>
    );
}

/** Image dévoilée par un masque qui s'ouvre, pendant que la photo dézoome. */
export function MaskImage({ src, alt, className, imgClassName, from = "inset(100% 0 0 0)", position }: { src: string; alt: string; className?: string; imgClassName?: string; from?: string; position?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(
        () => {
            if (REDUCED || !ref.current) return;
            const img = ref.current.querySelector("img");
            const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 96%", once: true } });
            tl.fromTo(ref.current, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.out" }).from(img, { scale: 1.12, duration: 0.8 }, 0);
        },
        { scope: ref },
    );
    return (
        <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
            <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${imgClassName ?? ""}`} style={{ objectPosition: position }} />
        </div>
    );
}

/** Effet « aimant » : l'élément est attiré par le curseur (souris uniquement). */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    useGSAP(
        () => {
            const el = ref.current;
            if (!el || !FINE || REDUCED) return;
            const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
            const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * strength);
                yTo((e.clientY - (r.top + r.height / 2)) * strength);
            };
            const leave = () => {
                xTo(0);
                yTo(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            return () => {
                el.removeEventListener("pointermove", move);
                el.removeEventListener("pointerleave", leave);
            };
        },
        { scope: ref },
    );
    return (
        <span ref={ref} className={`inline-block ${className ?? ""}`}>
            {children}
        </span>
    );
}

/** Inclinaison 3D + reflet qui suit la souris (cartes). */
export function useTilt<T extends HTMLElement>(max = 7) {
    const ref = useRef<T>(null);
    useGSAP(
        () => {
            const el = ref.current;
            if (!el || !FINE || REDUCED) return;
            gsap.set(el, { transformPerspective: 1100 });
            const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
            const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
            const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                ry((px - 0.5) * max * 2);
                rx(-(py - 0.5) * max * 2);
                el.style.setProperty("--gx", `${px * 100}%`);
                el.style.setProperty("--gy", `${py * 100}%`);
            };
            const leave = () => {
                rx(0);
                ry(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            return () => {
                el.removeEventListener("pointermove", move);
                el.removeEventListener("pointerleave", leave);
            };
        },
        { scope: ref },
    );
    return ref;
}
