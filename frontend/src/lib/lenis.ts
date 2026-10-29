import Lenis from "lenis";

let lenis: Lenis | null = null;
let raf = 0;

export function initLenis() {
    if (lenis) return;
    lenis = new Lenis({ duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
}

export function getLenis() {
    return lenis;
}

export function destroyLenis() {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
}

export function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: "smooth" });
}
