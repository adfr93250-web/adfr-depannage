import { useRef } from "react";
import { PhoneCall, Truck, ShieldCheck } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { PROCESS_STEPS } from "@/redesign/data";
import { gsap, REDUCED } from "@/redesign/motion";
import { SplitLines } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

const ICONS = [PhoneCall, Truck, ShieldCheck];
const PATH = "M -20 150 C 140 150, 170 60, 320 60 S 480 190, 640 190 S 800 60, 960 60 S 1090 130, 1220 130";
const NODES = [0.14, 0.5, 0.86];

/**
 * Comment ça marche : une route se trace au défilement, la dépanneuse la parcourt
 * et allume chaque étape à son passage.
 */
export default function Process() {
    const ref = useRef<HTMLElement>(null);
    const { t, tr } = useT();

    useGSAP(
        () => {
            const root = ref.current!;
            const steps = gsap.utils.toArray<HTMLElement>(".step", root);
            if (REDUCED) {
                steps.forEach((s) => s.classList.add("is-on"));
                return;
            }
            const road = root.querySelector<SVGPathElement>(".road-draw")!;
            const dash = root.querySelector<SVGPathElement>(".road-dash")!;
            const car = root.querySelector<SVGGElement>(".road-car")!;
            const fill = root.querySelector<HTMLElement>(".vline-fill");
            const len = road.getTotalLength();
            gsap.set([road, dash], { strokeDasharray: len, strokeDashoffset: len });
            gsap.set(dash, { strokeDasharray: `${len}`, strokeDashoffset: len });
            const state = { p: 0 };
            const apply = () => {
                const p = state.p;
                const pt = road.getPointAtLength(len * p);
                const pt2 = road.getPointAtLength(Math.min(len, len * p + 2));
                const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
                car.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
                road.style.strokeDashoffset = String(len * (1 - p));
                dash.style.strokeDashoffset = String(len * (1 - p));
                if (fill) fill.style.transform = `scaleY(${p})`;
                steps.forEach((s, i) => s.classList.toggle("is-on", p >= NODES[i] - 0.04));
            };
            apply();
            gsap.to(state, { p: 1, ease: "none", onUpdate: apply, scrollTrigger: { trigger: ".process-body", start: "top 78%", end: "bottom 62%", scrub: 0.8 } });
        },
        { scope: ref },
    );

    return (
        <section ref={ref} id="process" className="sheet overflow-hidden py-24 md:py-36">
            <div className="wrap">
                <p className="eyebrow">{t("Comment ça marche", "How it works")}</p>
                <SplitLines className="h-section mt-5 max-w-4xl text-white">
                    {t("Trois étapes, et vous", "Three steps, and you are")} <span className="italic text-chrome">{t("roulez à nouveau.", "back on the road.")}</span>
                </SplitLines>

                <div className="process-body relative mt-14 md:mt-20">
                    <svg viewBox="0 0 1200 250" className="hidden w-full overflow-visible md:block" aria-hidden="true">
                        <path d={PATH} fill="none" stroke="rgba(201,205,212,0.08)" strokeWidth="46" strokeLinecap="round" />
                        <path className="road-draw" d={PATH} fill="none" stroke="#0d2657" strokeWidth="46" strokeLinecap="round" />
                        <path className="road-dash" d={PATH} fill="none" stroke="#e30613" strokeWidth="2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(227,6,19,0.9))" }} />
                        <path d={PATH} fill="none" stroke="rgba(244,246,249,0.5)" strokeWidth="2" strokeDasharray="14 22" />
                        <g className="road-car">
                            <circle r="34" fill="rgba(227,6,19,0.18)">
                                <animate attributeName="r" values="26;44;26" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" />
                            </circle>
                            <rect x="-30" y="-13" width="60" height="26" rx="6" fill="#f4f6f9" />
                            <rect x="12" y="-13" width="18" height="26" rx="5" fill="#1e4fd6" />
                            <rect x="16" y="-9" width="9" height="18" rx="2" fill="#050b14" />
                            <rect x="-26" y="-9" width="34" height="18" rx="3" fill="#2b3038" />
                            <rect x="2" y="-4" width="5" height="8" rx="2" fill="#ffb020">
                                <animate attributeName="opacity" values="1;0.2;1" dur="0.5s" repeatCount="indefinite" />
                            </rect>
                        </g>
                    </svg>

                    <div className="absolute bottom-6 left-[1.9rem] top-6 w-px bg-adfr-chrome/15 md:hidden" aria-hidden="true">
                        <div className="vline-fill h-full w-full origin-top scale-y-0 bg-adfr-red shadow-[0_0_12px_rgba(227,6,19,0.9)]" />
                    </div>

                    <ol className="relative grid gap-10 md:mt-6 md:grid-cols-3 md:gap-8">
                        {PROCESS_STEPS.map((s, i) => {
                            const Icon = ICONS[i];
                            return (
                                <li key={s.num} className="step flex gap-5 md:block" data-testid={`process-step-${i + 1}`}>
                                    <span className="relative z-10 grid size-[3.8rem] shrink-0 place-items-center rounded-2xl border border-adfr-chrome/25 bg-adfr-deep2 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_16px_30px_-12px_rgba(0,0,0,0.7)] md:hidden">
                                        <Icon className="size-6 text-adfr-red" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <span className="step__num display text-6xl md:text-8xl">{s.num}</span>
                                            <Icon className="hidden size-8 text-adfr-red md:block" aria-hidden="true" />
                                        </div>
                                        <h3 className="mt-3 font-display text-xl font-extrabold text-white md:mt-5 md:text-2xl">{tr(s.title)}</h3>
                                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{tr(s.desc)}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
}
