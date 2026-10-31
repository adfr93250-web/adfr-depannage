import { motion } from "framer-motion";
import { PhoneCall, Truck, ShieldCheck } from "lucide-react";

const STEPS = [
    { icon: PhoneCall, num: "01", title: "Vous appelez", desc: "Un coup de fil ou un message WhatsApp : dites-nous où vous êtes et ce qui s'est passé. On vous dit tout de suite quand un dépanneur peut partir." },
    { icon: Truck, num: "02", title: "Le dépanneur part", desc: "Le dépanneur le plus proche de votre position part immédiatement, jour et nuit, week-ends et jours fériés." },
    { icon: ShieldCheck, num: "03", title: "Prise en charge", desc: "Dépannage sur place ou remorquage vers le garage de votre choix. Vous payez sur place, à la fin." },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Process() {
    return (
        <section id="process" className="relative py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-12 md:mb-16 max-w-3xl"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-adfr-red mb-3">Comment ça marche</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Trois étapes, et vous roulez à nouveau.</h2>
                </motion.div>

                <div className="relative grid md:grid-cols-3 gap-8 md:gap-6">
                    <div className="hidden md:block absolute top-12 left-[18%] right-[18%] border-t border-dashed border-adfr-chrome/30" aria-hidden="true" />
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.num}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.7, ease: EASE, delay: i * 0.14 }}
                            data-testid={`process-step-${i + 1}`}
                            className="relative"
                        >
                            <div className="flex md:flex-col items-start md:items-start gap-5">
                                <span className="relative z-10 grid place-items-center size-24 rounded-2xl bg-adfr-deep2 border border-adfr-chrome/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_16px_30px_-12px_rgba(0,0,0,0.7)] shrink-0">
                                    <span className="absolute top-2 left-3 font-display font-black text-2xl text-chrome select-none">{s.num}</span>
                                    <s.icon className="size-9 text-adfr-red mt-4" />
                                </span>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-white">{s.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-400 max-w-xs">{s.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
