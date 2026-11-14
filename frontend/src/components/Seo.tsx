import { useEffect } from "react";
import { SITE } from "@/data/site";
import { BRAND } from "@/data/brand";

interface SeoProps {
    title: string;
    description: string;
    path: string;
    jsonLd?: object[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

export default function Seo({ title, description, path, jsonLd }: SeoProps) {
    const ldKey = JSON.stringify(jsonLd);
    useEffect(() => {
        document.title = title;
        upsertMeta("name", "description", description);
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:url", SITE.domain + path);
        upsertMeta("property", "og:image", SITE.domain + SITE.ogImage);
        upsertMeta("property", "og:site_name", SITE.fullName);
        upsertMeta("property", "og:image:alt", `La dépanneuse ${SITE.name} en intervention en Île-de-France`);
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", SITE.domain + SITE.ogImage);

        let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = SITE.domain + path;

        document.querySelectorAll("script[data-page-ld]").forEach((s) => s.remove());
        (JSON.parse(ldKey || "[]") as object[]).forEach((obj) => {
            const s = document.createElement("script");
            s.type = "application/ld+json";
            s.setAttribute("data-page-ld", "true");
            s.textContent = JSON.stringify(obj);
            document.head.appendChild(s);
        });
    }, [title, description, path, ldKey]);
    return null;
}

export function localBusinessLd(zone?: { name: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": SITE.domain + "/#business",
        name: SITE.fullName,
        telephone: SITE.phoneIntl,
        url: SITE.domain,
        image: SITE.domain + SITE.ogImage,
        address: { "@type": "PostalAddress", addressRegion: "Île-de-France", addressCountry: "FR" },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
        },
        ...(zone ? { areaServed: { "@type": "Place", name: zone.name } } : { areaServed: "Île-de-France" }),
    };
}

export function faqPageLd(items: { q: string; a: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
    };
}

export function websiteLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.fullName,
        url: SITE.domain,
    };
}
