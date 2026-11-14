import { PhoneCall } from "lucide-react";
import { GALLERY, SITE } from "@/redesign/data";
import { track } from "@/redesign/api";
import { SplitLines, MaskImage, Magnetic, Reveal } from "@/redesign/fx";

const LAYOUT = [
    { cls: "col-span-12 md:col-span-7 aspect-[5/3]", speed: -40, from: "inset(0 100% 0 0)" },
    { cls: "col-span-7 md:col-span-3 aspect-[9/14]", speed: -130, from: "inset(100% 0 0 0)" },
    { cls: "col-span-5 md:col-span-2 aspect-[3/4]", speed: -70, from: "inset(0 0 100% 0)" },
];

/** Sur le terrain : composition décalée, chaque photo s'ouvre par un masque et dérive à sa propre vitesse. */
export default function Gallery() {
    return (
        <section id="flotte" className="sheet overflow-hidden border-y border-adfr-chrome/10 bg-adfr-night2 py-24 md:py-36">
            <div className="wrap relative">
                <p className="eyebrow">Sur le terrain</p>
                <SplitLines className="h-section mt-5 max-w-5xl text-white">En intervention, jour et nuit, dans toute l'Île-de-France.</SplitLines>

                <div className="mt-12 grid grid-cols-12 gap-3 md:mt-16 md:gap-6" data-testid="gallery">
                    {GALLERY.map((p, i) => (
                        <figure key={p.src} className={`gal-item group relative ${LAYOUT[i].cls}`} data-speed={LAYOUT[i].speed} data-testid={`gallery-photo-${i + 1}`}>
                            <MaskImage src={p.src} alt={p.alt} from={LAYOUT[i].from} className="h-full w-full rounded-3xl border border-adfr-chrome/15 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]" imgClassName="transition-transform duration-[1400ms] ease-expo group-hover:scale-110" />
                            <figcaption className="glass absolute bottom-3 left-3 right-3 w-fit max-w-[calc(100%-1.5rem)] rounded-full px-3.5 py-2 text-[11px] font-bold text-white md:bottom-4 md:left-4 md:text-xs">
                                <span className="mr-2 text-adfr-redLight">0{i + 1}</span>
                                {p.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <Reveal className="relative mt-14 overflow-hidden rounded-[2rem] border border-adfr-red/40 bg-gradient-to-br from-adfr-deep2 to-adfr-deep md:mt-10" data-testid="gallery-cta">
                    <div className="chevrons" aria-hidden="true" />
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-12 md:py-10">
                        <div>
                            <p className="font-display text-2xl font-extrabold text-white md:text-4xl">Une panne maintenant ?</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">Le dépanneur le plus proche part immédiatement, jour et nuit.</p>
                        </div>
                        <Magnetic>
                            <a href={SITE.phoneHref} data-testid="gallery-call-button" data-cursor="Appeler" onClick={() => track("call", "/galerie", "Galerie")} className="btn btn-call px-7 py-4 text-lg md:px-9 md:py-5 md:text-2xl">
                                <PhoneCall className="size-5 animate-ring md:size-6" aria-hidden="true" />
                                {SITE.phoneDisplay}
                            </a>
                        </Magnetic>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
