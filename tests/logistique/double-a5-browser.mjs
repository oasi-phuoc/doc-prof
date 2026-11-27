import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const requested = process.argv.slice(2)
const { modules } = JSON.parse(await readFile(new URL('../../src/logistique/curriculum.generated.json', import.meta.url), 'utf8'))
assert(requested.every((code) => modules.some((module) => module.code === code)), 'Module Logistique inconnu')
const cases = modules.filter(({ code }) => !requested.length || requested.includes(code))
  .flatMap((module) => ['AFP', 'CFC'].filter((diploma) => module.year[diploma]).map((diploma) => ({ module, diploma })))
const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0, hmr: false } })
let browser

async function measureCourse(context, { module, diploma }) {
  const tab = await context.newPage()
  const tag = diploma.toLowerCase()
  const activity = {
    domain: 'logistique-' + tag, topic: `log-${tag}-theme-${module.theme}`, exerciseType: `log-${tag}-${module.code}-theorie`,
    difficulty: 'moyen', count: 1, columns: 1,
  }
  try {
    await tab.addInitScript((config) => history.replaceState({
      ...history.state, clairfleFiche: { id: 'audit-a5', name: 'Cours Logistique', recipe: {
        version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
        libreMode: false, libreSnapshot: null, printCorrections: false, sheetFormat: 'a5-double-landscape', pages: [config],
      } },
    }, ''), activity)
    await tab.goto('/generateur')
    await tab.emulateMedia({ media: 'print' })
    const halves = tab.locator('.print-only-sheets .a5-half')
    await halves.first().waitFor()
    const bounds = await halves.evaluateAll(async (sheets) => {
      await document.fonts.ready
      await Promise.all(sheets.flatMap((sheet) => [...sheet.querySelectorAll('img')]).map((image) => image.decode()))
      return sheets.map((sheet) => {
        const body = sheet.querySelector('.sheet-body').getBoundingClientRect()
        const footer = sheet.querySelector('.doc-footer').getBoundingClientRect()
        const items = [...sheet.querySelectorAll('.exercise-item')]
        const end = Math.max(...items.map((item) => item.getBoundingClientRect().bottom))
        const { width, height } = sheet.getBoundingClientRect()
        return { reserve: Math.min(body.bottom, footer.top) - end, width, height, count: items.length }
      })
    })
    assert(bounds.length >= 2 && bounds.length % 2 === 0)
    for (const [index, { reserve, width, height, count }] of bounds.entries()) {
      assert(count > 0 && Math.abs(height - 793.7) < 3 && Math.abs(width - 561.3) < 3,
        `Dimensions ou contenu de la demi-feuille ${index + 1}`)
      assert(reserve >= 25, `Réserve ${reserve.toFixed(1)} px sur la demi-feuille ${index + 1}`)
    }
    return { pages: bounds.length / 2, minimum: Math.min(...bounds.map(({ reserve }) => reserve)) }
  } finally {
    await tab.close()
  }
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${server.httpServer.address().port}`
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: baseURL }])
  const queue = [...cases]
  const results = []
  const failures = []
  await Promise.all(Array.from({ length: 3 }, async () => {
    for (let next = queue.shift(); next; next = queue.shift()) {
      try {
        results.push(await measureCourse(context, next))
      } catch (error) {
        failures.push(`${next.module.code} ${next.diploma} – ${error.message}`)
      }
    }
  }))
  assert.deepEqual(failures, [])
  const pages = results.reduce((total, result) => total + result.pages, 0)
  const minimum = Math.min(...results.map((result) => result.minimum))
  console.log(`${results.length} cours et ${pages} pages vérifiés en double A5, avec une réserve minimale de ${minimum.toFixed(1)} px.`)
  await context.close()
} finally {
  await browser?.close()
  await server?.close()
}
