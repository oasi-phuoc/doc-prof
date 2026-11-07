import { createServer } from 'vite'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { chromium } = await import(process.argv[2] || 'playwright')
const vite = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
let browser
try {
  const { buildWorksheets } = await vite.ssrLoadModule('/src/math/generate.ts')
  const { CE_ARTWORKS } = await vite.ssrLoadModule('/src/tcf/ce-art.ts')
  const { WorksheetSheet } = await vite.ssrLoadModule('/src/components/generator/WorksheetSheet.tsx')
  const { DEFAULT_INSTITUTIONAL } = await vite.ssrLoadModule('/src/components/math/PrintDocumentChrome.tsx')
  const bank = JSON.parse(readFileSync(resolve(root, 'src/tcf/content/a0-a1/ce.json')))
  const artworks = JSON.parse(readFileSync(resolve(root, 'src/tcf/content/ce-art.json')))
  const css = readFileSync(resolve(root, 'src/App.css'), 'utf8').replace(/@import[^;]+;/g, '')
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1000, height: 1300 } })
  await page.route('https://ce-layout.test/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (!path.startsWith('/lib/images/tcf/ce-art-generated/')) return route.abort()
    await route.fulfill({ contentType: 'image/webp', body: readFileSync(resolve(root, 'public' + path)) })
  })
  mkdirSync('/tmp/tcf-ce-layout-qa', { recursive: true })
  // Une image horizontale future doit aussi être mise en page et imprimée sans déformation.
  const first = CE_ARTWORKS[0]
  const cases = [...artworks, { ...first, width: 1754, height: 1240, layoutFixture: true }]
  for (const art of cases) {
    if (art.layoutFixture) CE_ARTWORKS[0] = art
    const ex = bank.find(ex => ex.id === art.id)
    const sheets = buildWorksheets([{ domain: 'tcf-csc', topic: 'tcf-ce', exerciseType: 'tcf-ce-ex-1', difficulty: 'facile', count: 1, columns: 1, tcfExercise: ex, tcfCeFormat: 'image' }], 42)
    const sheet = sheets.find(sheet => sheet.cePosterSheet)
    assert(sheet, `${art.id}: aucune page de document CE générée`)
    const markup = renderToStaticMarkup(h(WorksheetSheet, { page: sheet, mode: 'student', institutional: DEFAULT_INSTITUTIONAL, evalMode: false, pageNumber: 1, total: sheets.length, sheetIndex: 1, documentTotalPoints: 10 }))
    for (const media of ['screen', 'print']) {
      await page.emulateMedia({ media })
      const preview = media==='screen'&&art.layoutFixture ? `<div class="a4-frame is-landscape" style="--a4-scale:1">${markup}</div>` : markup
      await page.setContent(`<base href="https://ce-layout.test"><style>${css}</style><div class="${media === 'print' ? 'print-only-sheets' : 'layout-qa'}">${preview}</div>`, { waitUntil: 'load' })
      await page.locator('.tcf-ce-art img').evaluate(img => img.decode())
      assert.equal(await page.locator('.doc-header,.doc-student-block,.sheet-instruction').count(), 0)
      assert.equal(await page.locator('.tcf-ce-art img').count(), 1)
      assert.equal(await page.locator('.exercise-heading h3').textContent(),'Exercice 1')
      assert.equal(await page.locator('.exercise-instruction').count(),1)
      const boxes = await page.locator('.worksheet-sheet').evaluate(sheet => {
        const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right } }
        const img = sheet.querySelector('.tcf-ce-art img')
        return { sheet: rect(sheet), body: rect(sheet.querySelector('.sheet-body')), image: rect(img), instruction: rect(sheet.querySelector('.exercise-instruction')), footer: rect(sheet.querySelector('.doc-footer')), direction: getComputedStyle(sheet).flexDirection, fit: getComputedStyle(img).objectFit }
      })
      assert(Math.abs(boxes.sheet.height - (sheet.cePosterLandscape ? 793.70 : 1122.52)) < 2, `${art.id}: hauteur A4 en ${media}: ${JSON.stringify(boxes)}`)
      assert(boxes.image.height > boxes.body.height * 0.65, `${art.id}: image pleine page en ${media}: ${JSON.stringify(boxes)}`)
      assert(boxes.image.y>=boxes.instruction.bottom-1,`${art.id}: image avant la consigne`)
      assert(boxes.image.bottom <= boxes.footer.y + 1, `${art.id}: image sur le pied en ${media}: ${JSON.stringify(boxes)}`)
      assert(boxes.footer.bottom <= boxes.sheet.bottom, `${art.id}: pied coupé en ${media}`)
      assert.equal(boxes.fit, 'contain')
      assert.equal(boxes.direction,'column')
      if (!art.layoutFixture && ['tcf-a0a1-ce-001', 'tcf-a1-s4-ce-1'].includes(art.id) && media === 'screen') await page.locator('.worksheet-sheet').screenshot({ path: `/tmp/tcf-ce-layout-qa/${art.id}.png` })
    }
  }
  CE_ARTWORKS[0] = first
  console.log(`${artworks.length} documents et une page paysage : titre, consigne, image entière, pied visible sans chevauchement, à l’écran et à l’impression.`)
} finally {
  if (browser) await browser.close()
  await vite.close()
}
