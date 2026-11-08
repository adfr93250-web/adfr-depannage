import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const ROOT = new URL("..", import.meta.url).pathname;
const BUILD = path.join(ROOT, "build");
const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const PORT = 4173;

const zonesSrc = fs.readFileSync(path.join(ROOT, "src", "data", "zones.ts"), "utf8");
const writtenSlugs = [...zonesSrc.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]).filter((s) => !/^paris-\d+$/.test(s));
const parisSlugs = Array.from({ length: 20 }, (_, i) => `paris-${i + 1}`);
const ROUTES = ["/", ...[...writtenSlugs, ...parisSlugs].map((s) => `/depannage-${s}`)];

// Marque active (ADFR par défaut, SOS Dépannage si REACT_APP_BRAND=sos) → sitemap + robots générés pour le bon domaine.
// Les variables viennent de l'environnement ou, à défaut, des fichiers .env lus par CRA (même source que le build).
for (const envFile of [".env", ".env.production", ".env.local"]) {
    const fp = path.join(ROOT, envFile);
    if (!fs.existsSync(fp)) continue;
    for (const line of fs.readFileSync(fp, "utf8").split("\n")) {
        const m = line.match(/^\s*(REACT_APP_[A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
        if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
}
const BRAND = process.env.REACT_APP_BRAND === "sos" ? "sos" : "adfr";
const DOMAIN = (process.env.REACT_APP_SITE_URL || (BRAND === "sos" ? "https://sos-depann.fr" : "https://adfr-depannage.fr")).replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ROUTES.map((r) => `  <url>\n    <loc>${DOMAIN}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(BUILD, "sitemap.xml"), sitemap);
const PHONE_DIGITS = (process.env.REACT_APP_PHONE || "").replace(/\D/g, "");
const PHONE_NAT = (PHONE_DIGITS.startsWith("33") ? `0${PHONE_DIGITS.slice(2)}` : PHONE_DIGITS) || (BRAND === "sos" ? "0184160923" : "0185800061");
const PHONE_DISPLAY = PHONE_NAT.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
const PHONE_INTL = `+33${PHONE_NAT.replace(/^0/, "")}`;
const WA = (process.env.REACT_APP_WHATSAPP || "").replace(/\D/g, "");
const WA_DISPLAY = WA ? `+${WA.slice(0, 2)} ${WA.slice(2).replace(/(\d)(?=(\d{2})+$)/g, "$1 ")}` : "+33 6 52 66 47 49";

/** Remplace les mentions ADFR laissées dans le HTML statique (index.html : JSON-LD, noscript) pour la marque SOS. */
function brandify(txt) {
    txt = txt.replace(/https:\/\/adfr-depannage\.fr/g, DOMAIN);
    if (BRAND !== "sos") return txt;
    return txt
        .replace(/ADFR — Auto Dépann France Remorquage/g, "SOS Dépannage — Dépanneuse 24h/24 Île-de-France")
        .replace(/\bADFR\b/g, "SOS Dépannage")
        .replace(/en moins de 30 minutes/g, "en 20 minutes")
        .replace(/\/img\/og-cover\.jpg/g, "/img/og-cover-sos.jpg")
        .replace(/\+33185800061/g, PHONE_INTL)
        .replace(/01 85 80 00 61/g, PHONE_DISPLAY)
        .replace(/\+33 6 52 66 47 49/g, WA_DISPLAY);
}
for (const f of ["robots.txt", "llms.txt"]) {
    const fp = path.join(BUILD, f);
    if (fs.existsSync(fp)) fs.writeFileSync(fp, brandify(fs.readFileSync(fp, "utf8")));
}
console.log(`Marque : ${BRAND} — domaine : ${DOMAIN} — sitemap ${ROUTES.length} URLs`);

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript",
    ".css": "text/css",
    ".xml": "application/xml",
    ".txt": "text/plain",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
};

const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = path.join(BUILD, urlPath === "/" ? "index.html" : urlPath);
    if (!path.resolve(file).startsWith(BUILD)) file = path.join(BUILD, "index.html");
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        const withIndex = path.join(BUILD, urlPath.replace(/\/?$/, "/index.html"));
        file = fs.existsSync(withIndex) ? withIndex : path.join(BUILD, "index.html");
    }
    res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
    res.end(fs.readFileSync(file));
});

if (!fs.existsSync(CHROME)) {
    console.warn(`Chrome introuvable (${CHROME}) : pré-rendu ignoré, le site fonctionne en mode application.`);
    process.exit(0);
}

await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

let ok = 0;
for (const route of ROUTES) {
    try {
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 45000 });
        await page.waitForSelector("#root > *", { timeout: 15000 });
        const height = await page.evaluate("document.documentElement.scrollHeight");
        for (let y = 0; y < height; y += 700) {
            await page.evaluate(`window.scrollTo(0, ${y})`);
            await new Promise((r) => setTimeout(r, 70));
        }
        await page.evaluate("window.scrollTo(0, 0)");
        await new Promise((r) => setTimeout(r, 500));
        const html = brandify(await page.evaluate("document.documentElement.outerHTML"));
        const rel = route === "/" ? "index.html" : path.join(route.replace(/^\//, ""), "index.html");
        const out = path.join(BUILD, rel);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, html);
        ok += 1;
        console.log(`pré-rendu OK : ${route} (${html.length} octets)`);
    } catch (e) {
        console.error(`pré-rendu ÉCHEC : ${route} — ${e.message}`);
    }
}

await browser.close();
server.close();
console.log(`Terminé : ${ok}/${ROUTES.length} pages pré-rendues.`);
if (ok < ROUTES.length) process.exit(1);