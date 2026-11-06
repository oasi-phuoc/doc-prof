#!/usr/bin/env node
/**
 * Reproduit les 76 horloges analogiques depuis le cadran généré avec image_gen.
 * Usage : node scripts/replace-digital-clocks.mjs /chemin/vers/playwright/index.mjs
 * Prérequis : Chromium, ImageMagick (convert/identify) et Playwright hors dépôt.
 * Les chemins historiques sont conservés pour les fiches déjà enregistrées.
 */
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { chromium } = await import(process.argv[2] || 'playwright')
const publicRoot = resolve(root, 'public')
const audit = 'lib/images/tcf/qcm-audit'
const vocabulary = 'lib/images/vocabulaire/heure-horloge'
const targets = readdirSync(resolve(publicRoot, audit)).filter((name) => /^(?:co306-horloge-\d{4}-dessinee|co834-horloge-\d{4}-dessinee|vocab-horloge-\d{4})\.webp$/.test(name)).map((name) => {
  const match = name.match(/(\d{2})(\d{2})/)
  return { path: `${audit}/${name}`, hour: Number(match[1]), minute: Number(match[2]) }
})
targets.push(
  { path: `${vocabulary}/huit-heures-numerique.webp`, hour: 8, minute: 0 },
  { path: `${vocabulary}/onze-heures-numerique.webp`, hour: 11, minute: 0 },
  { path: `${vocabulary}/minuit-numerique.webp`, hour: 0, minute: 0 },
  { path: `${vocabulary}/réveil-numérique.webp`, hour: 7, minute: 0 },
)
if (targets.length !== 76) throw new Error(`Inventaire inattendu : ${targets.length} images au lieu de 76.`)
const dial = readFileSync(resolve(publicRoot, 'lib/images/tcf/clock-assets/cadran-bois-sans-aiguilles.webp')).toString('base64')
const temp = mkdtempSync(resolve(tmpdir(), 'doc-prof-clocks-'))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 1 })
  for (const [i, target] of targets.entries()) {
    const file = resolve(publicRoot, target.path)
    const [width, height] = execFileSync('identify', ['-format', '%w %h', file], { encoding: 'utf8' }).trim().split(' ').map(Number)
    const hourAngle = (target.hour % 12) * 30 + target.minute * 0.5
    const minuteAngle = target.minute * 6
    // L'aiguille des heures avance continuellement entre deux chiffres.
    const hand = (angle, length, thickness) => `<line x1="640" y1="493" x2="640" y2="${480 - length}" transform="rotate(${angle} 640 480)" stroke="#20201e" stroke-width="${thickness}" stroke-linecap="round"/>`
    await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;overflow:hidden;background:#fff5df}svg{display:block}</style>
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 1280 960">
        <image x="160" y="0" width="960" height="960" href="data:image/webp;base64,${dial}"/>
        ${hand(hourAngle, 245, 26)}${hand(minuteAngle, 365, 17)}
        <circle cx="640" cy="480" r="19" fill="#262623" stroke="#10100f" stroke-width="2"/>
      </svg>`)
    await page.locator('image').evaluate(async (image) => {
      const img = new Image(); img.src = image.getAttribute('href'); await img.decode()
    })
    const png = resolve(temp, `${i}.png`)
    await page.screenshot({ path: png })
    execFileSync('convert', [png, '-resize', `${width}x${height}!`, '-quality', '90', file])
    console.log(`${target.path} : ${String(target.hour).padStart(2, '0')}:${String(target.minute).padStart(2, '0')} (${hourAngle}° / ${minuteAngle}°)`)
  }
} finally {
  await browser.close()
  rmSync(temp, { recursive: true, force: true })
}
