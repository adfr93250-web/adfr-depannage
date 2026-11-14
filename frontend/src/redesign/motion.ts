import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "power3.out", duration: 0.5 });
ScrollTrigger.config({ ignoreMobileResize: true });

const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

/** L'utilisateur a demandé moins d'animations : tout le contenu s'affiche directement. */
export const REDUCED = mq("(prefers-reduced-motion: reduce)");
/** Souris + survol : curseur personnalisé, effets magnétiques, inclinaisons 3D. */
export const FINE = mq("(hover: hover) and (pointer: fine)");
export const DESKTOP = () => mq("(min-width: 1024px)");

/** Défilement natif du navigateur : aucune inertie ajoutée, le doigt et la molette répondent tout de suite. */
export function lockScroll(lock: boolean) {
    document.documentElement.classList.toggle("is-locked", lock);
}
export function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: REDUCED ? "auto" : "smooth" });
}
export function scrollTop() {
    window.scrollTo(0, 0);
}

/** Petit signal global : l'animation d'entrée (préchargeur) est terminée. */
let introDone = true; // plus d'écran de chargement : le site est utilisable dès l'affichage
const waiters: Array<() => void> = [];
export function markIntroDone() {
    if (introDone) return;
    introDone = true;
    waiters.splice(0).forEach((f) => f());
}
export function onIntroDone(cb: () => void): () => void {
    if (introDone) {
        cb();
        return () => {};
    }
    waiters.push(cb);
    return () => {
        const i = waiters.indexOf(cb);
        if (i >= 0) waiters.splice(i, 1);
    };
}

export { gsap, ScrollTrigger, SplitText };

