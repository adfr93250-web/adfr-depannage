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
        const html = await page.evaluate("document.documentElement.outerHTML");
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