/**
 * Pont vers l'API du site : chaque clic suivi déclenche aussi la conversion Google Ads,
 * comme dans les composants d'origine.
 */
import { track as baseTrack, gtagConversion, submitCallback } from "@/lib/api";

export function track(event: "call" | "whatsapp" | "form", page: string, button = "") {
    baseTrack(event, page, button);
    gtagConversion(event);
}

export { submitCallback };
