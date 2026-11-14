/** Traduction du nouveau design : t(fr, en) pour un texte ponctuel, tr(fr) pour un texte de données (dictionnaire). */
import { useLang } from "@/lib/urgence";
import { EN } from "@/redesign/en";

export function useT() {
    const { lang, t } = useLang();
    return { lang, t, tr: (fr: string) => (lang === "en" ? (EN[fr] ?? fr) : fr) };
}
