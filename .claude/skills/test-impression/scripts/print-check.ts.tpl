/**
 * Contrôle PDF A4 (optionnel).
 * Dépendances : npm i -D @playwright/test pdf-lib tsx && npx playwright install chromium
 *
 * Usage : npx tsx tests/print/print-check.ts "http://localhost:5173/" --pages 1
 */
import { chromium } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'

const url = process.argv[2] ?? 'http://localhost:5173/'
const expectedPages = Number(process.argv.find((a, i, arr) => arr[i - 1] === '--pages') ?? 1)

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.emulateMedia({ media: 'print' })
await page.evaluate(() => document.fonts.ready)

const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})

const pdf = await PDFDocument.load(pdfBuffer)
const pages = pdf.getPageCount()
console.log(`Pages: ${pages} (attendu ${expectedPages}) ${pages === expectedPages ? '✔' : '✘'}`)

const frame = await page.locator('.a4-frame').first().boundingBox().catch(() => null)
if (frame) {
  const ratio = frame.width / frame.height
  const target = 210 / 297
  const ok = Math.abs(ratio - target) < 0.02
  console.log(`Ratio aperçu: ${ratio.toFixed(3)} (cible ${target.toFixed(3)}) ${ok ? '✔' : '✘'}`)
}

await browser.close()
process.exit(pages === expectedPages ? 0 : 1)
