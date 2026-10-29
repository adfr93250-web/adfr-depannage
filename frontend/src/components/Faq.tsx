import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import type { FaqItem } from "@/data/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FaqProps {
    items: FaqItem[];
    title?: string;
}

export default function Faq({ items, title = "Vos questions, nos réponses directes." }: FaqProps) {
    return (
        <section id="faq" className="relative py-20 md:py-28">
            <div className="mx-auto max-w-3xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-10 md:mb-12"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">FAQ</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="rounded-2xl border border-adfr-chrome/15 bg-adfr-deep2/40 px-6 py-2"
                    data-testid="faq-accordion"
                >
                    <Accordion type="single" collapsible className="w-full">
                        {items.map((it, i) => (
                            <AccordionItem key={it.q} value={`item-${i}`} className="border-adfr-chrome/15">
                                <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-white font-display font-bold text-base md:text-lg hover:no-underline hover:text-white">
                                    {it.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm md:text-base leading-relaxed text-slate-300">
                                    {it.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
