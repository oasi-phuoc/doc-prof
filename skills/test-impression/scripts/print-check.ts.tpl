/**
 * Contrôle d'impression d'une fiche.
 * Usage : npx tsx tests/print/print-check.ts "<url>" [--pages N] [--out tests/print-out]
 * Dépendances : npm i -D @playwright/test pdf-lib tsx && npx playwright install chromium
 */
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const url = args[0];
if (!url) {
  console.error('Usage : npx tsx tests/print/print-check.ts "<url>" [--pages N] [--out dossier]');
  process.exit(2);
}
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const expectedPages = opt("--pages") ? Number(opt("--pages")) : undefined;
const outDir = opt("--out") ?? "tests/print-out";
mkdirSync(outDir, { recursive: true });

const MM = 96 / 25.4; // pixels CSS par millimètre
const SAFE_MARGIN_MM = 12;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.evaluate(() => document.fonts.ready);

// 1. Contrôles dans la page
const issues = await page.evaluate(
  ({ mm, safe }) => {
    const found: string[] = [];
    const sheets = Array.from(document.querySelectorAll<HTMLElement>(".sheet"));
    if (sheets.length === 0) found.push("Aucune .sheet trouvée : la vue d'impression est-elle affichée ?");

    sheets.forEach((sheet, s) => {
      const box = sheet.getBoundingClientRect();
      const limitRight = box.right - safe * mm;
      const limitBottom = box.top + 297 * mm - safe * mm;

      sheet.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.right > limitRight + 1) {
          found.push(`Page ${s + 1} : ${describe(el)} dépasse à droite de ${(r.right - limitRight).toFixed(0)} px`);
        }
      });

      sheet.querySelectorAll<HTMLElement>(".exercise").forEach((ex) => {
        const r = ex.getBoundingClientRect();
        if (r.bottom > limitBottom + 1) {
          found.push(`Page ${s + 1} : exercice « ${ex.dataset.kind ?? "?"} » franchit la limite de page`);
        }
      });
    });

    function describe(el: HTMLElement) {
      const cls = typeof el.className === "string" ? el.className.split(" ").slice(0, 2).join(".") : "";
      return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
    }
    return found;
  },
  { mm: MM, safe: SAFE_MARGIN_MM }
);

// 2. Polices réellement utilisées
const fonts = await page.evaluate(() =>
  Array.from(document.fonts)
    .filter((f) => f.status === "loaded")
    .map((f) => f.family.replace(/"/g, ""))
);

// 3. PDF
const pdfBytes = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
const pdfPath = join(outDir, `fiche-${stamp}.pdf`);
writeFileSync(pdfPath, pdfBytes);
const pageCount = (await PDFDocument.load(pdfBytes)).getPageCount();

await browser.close();

// 4. Rapport
console.log(`PDF : ${pdfPath}`);
const pagesOk = expectedPages === undefined || pageCount === expectedPages;
console.log(`Pages : ${pageCount}${expectedPages !== undefined ? ` (attendu ${expectedPages})` : ""} ${pagesOk ? "✔" : "✘"}`);
console.log(`Polices chargées : ${fonts.length ? [...new Set(fonts)].join(", ") : "aucune ✘"}`);
if (issues.length === 0) {
  console.log("Débordements et coupures : aucun ✔");
} else {
  console.log(`Alertes (${issues.length}) :`);
  for (const i of issues) console.log(` - ${i}`);
}

process.exit(pagesOk && issues.length === 0 && fonts.length > 0 ? 0 : 1);
