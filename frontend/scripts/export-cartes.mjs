// Exporte les cartes de visite (recto/verso, ADFR + SOS) en PNG 2100x1300 dans public/cartes/.
// Usage : node scripts/export-cartes.mjs   (le serveur de dev doit tourner sur le port 3000)
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "cartes");
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 2100, height: 1300 });
for (const brand of ["adfr", "sos"]) {
    for (const side of ["recto", "verso"]) {
        await page.goto(`http://localhost:3000/carte-visite.html?brand=${brand}&side=${side}`, { waitUntil: "networkidle0", timeout: 60000 });
        await page.evaluate(() => document.fonts.ready);
        await new Promise((r) => setTimeout(r, 800));
        const file = path.join(OUT, `carte-${brand}-${side}.png`);
        await page.screenshot({ path: file, type: "png" });
        console.log("export OK :", file);
    }
}
await browser.close();
