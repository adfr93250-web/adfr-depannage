#!/usr/bin/env python3
"""Génère public/sitemap.xml (accueil + 8 départements + 40 pages villes)."""
from datetime import date

DOMAIN = "https://adfr-depann.fr"
TODAY = date.today().isoformat()

DEPTS = ["75", "77", "78", "91", "92", "93", "94", "95"]
CITIES = [
    "boulogne-billancourt", "saint-denis", "argenteuil", "montreuil", "nanterre",
    "vitry-sur-seine", "creteil", "asnieres-sur-seine", "versailles", "courbevoie",
    "colombes", "rueil-malmaison", "aulnay-sous-bois", "champigny-sur-marne",
    "saint-maur-des-fosses", "drancy", "issy-les-moulineaux", "levallois-perret",
    "noisy-le-grand", "cergy",
]
PARIS = [f"paris-{i}" for i in range(1, 21)]

urls = [(f"{DOMAIN}/", "1.0", "daily")]
urls += [(f"{DOMAIN}/depannage-{d}", "0.9", "weekly") for d in DEPTS]
urls += [(f"{DOMAIN}/depannage-{s}", "0.8", "weekly") for s in CITIES + PARIS]

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, prio, freq in urls:
    lines.append("  <url>")
    lines.append(f"    <loc>{loc}</loc>")
    lines.append(f"    <lastmod>{TODAY}</lastmod>")
    lines.append(f"    <changefreq>{freq}</changefreq>")
    lines.append(f"    <priority>{prio}</priority>")
    lines.append("  </url>")
lines.append("</urlset>")

with open("/app/frontend/public/sitemap.xml", "w") as f:
    f.write("\n".join(lines) + "\n")
print(f"sitemap.xml : {len(urls)} URLs")
