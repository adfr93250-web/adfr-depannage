import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { SITE, type FaqItem } from "@/redesign/data";
import { track } from "@/redesign/api";
import { SplitLines, Reveal, Magnetic } from "@/redesign/fx";
import { useT } from "@/redesign/i18n";

interface FaqProps {
    items: FaqItem[];
    title?: string;
}

/**
 * FAQ en accordéon. Toutes les réponses restent présentes dans le HTML (comme sur le site original,
 * où elles sont entièrement visibles) : seul l'affichage est replié.
 */
export default function Faq({ items, title = "Vos questions, nos réponses directes." }: FaqProps) {
    const [open, setOpen] = useState(0);
    const { t, tr } = useT();
    return (
        <section id="faq" className="sheet border-t border-adfr-chrome/10 bg-adfr-night2 py-24 md:py-36">
            <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                <div className="lg:sticky lg:top-32 lg:self-start">
                    <p className="eyebrow">FAQ</p>
                    <SplitLines className="h-section mt-5 text-white">{tr(title)}</SplitLines>
                    <Reveal className="mt-8 hidden lg:block" delay={0.2}>
                        <p className="max-w-sm text-sm leading-relaxed text-slate-400">{t("Une autre question ? Le plus simple est de nous appeler : on vous répond tout de suite.", "Another question? The easiest way is to call us: we answer straight away.")}</p>
                        <Magnetic className="mt-6">
                            <a href={SITE.phoneHref} data-cursor="Appeler" onClick={() => track("call", "/faq", "FAQ")} className="btn btn-call px-6 py-4 text-base">
                                <PhoneCall className="size-5 animate-ring" aria-hidden="true" /> {SITE.phoneDisplay}
                            </a>
                        </Magnetic>
                    </Reveal>
                </div>

                <Reveal as="dl" className="border-t border-adfr-chrome/15" data-testid="faq-list" stagger={0.06} y={24}>
                    {items.map((it, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={it.q} className="faq-item border-b border-adfr-chrome/15" data-open={isOpen} data-testid={`faq-item-${i}`}>
                                <dt>
                                    <button type="button" id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? -1 : i)} className="group flex w-full items-center gap-4 py-6 text-left md:gap-6 md:py-7">
                                        <span className="w-8 shrink-0 font-display text-xs font-black text-adfr-redLight">{String(i + 1).padStart(2, "0")}</span>
                                        <span className={`flex-1 font-display text-lg font-bold leading-snug tracking-tight transition-colors duration-300 md:text-2xl ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}>{tr(it.q)}</span>
                                        <span className="faq-item__icon" aria-hidden="true" />
                                    </button>
                                </dt>
                                <dd id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-item__body">
                                    <div>
                                        <p className="max-w-2xl pb-7 pl-12 pr-4 leading-relaxed text-slate-300 md:pl-14 md:text-lg">{tr(it.a)}</p>
                                    </div>
                                </dd>
                            </div>
                        );
                    })}
                </Reveal>
            </div>
        </section>
    );
}
