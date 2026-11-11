import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { preview } from 'vite'
import { chromium } from 'playwright'
const port = Number(process.env.INTERACTIVE_PREVIEW_TEST_PORT ?? 5192)
const base = `http://127.0.0.1:${port}`
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
const large = new Set(Object.values(manifest).filter((entry) => entry.file.endsWith('.js')).map((entry) => entry.file))
for (const file of [...large]) if ((await readFile(`dist/${file}`)).length <= 1024 * 1024) large.delete(file)
const server = await preview({ preview: { host: '127.0.0.1', port, strictPort: true } })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = []
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  for (const [route, selector] of [['/', '.landing-page h1'], ['/interactif/cartes', '.ci-cards-page h1'], ['/interactif/diagnostic', '.ci-diagnostic h1']]) {
    const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
    const scripts = []
    page.on('request', (request) => { const url = new URL(request.url()); if (url.pathname.endsWith('.js')) scripts.push(url.pathname.slice(1)) })
    const started = performance.now()
    await page.goto(base + route)
    await page.locator(selector).waitFor({ timeout: 120000 })
    const readyMs = Math.round(performance.now() - started)
    assert.ok(!scripts.some((file) => large.has(file)), `${route} a chargé les banques du jeu`)
    results.push({ route, readyMs, scripts, exerciseBanksLoaded: false })
    await page.close()
  }
  const game = await context.newPage(); game.on('pageerror', (error) => errors.push(error.message))
  await game.goto(`${base}/interactif/demo`)
  await game.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  await game.evaluate(async () => { await document.fonts.ready; performance.mark('clairfle-test-start') })
  await game.locator('.ci-launch').click()
  await game.locator('.ci-question h1').first().waitFor()
  const firstQuestionMs = await game.evaluate(() => performance.measure('clairfle-test-first-question', 'clairfle-test-start').duration)
  assert.ok(firstQuestionMs <= 2000, `Première question en ${firstQuestionMs} ms avec médias vérifiés`)
  results.push({ route: '/interactif/demo', firstQuestionMs: Math.round(firstQuestionMs), maximumMs: 2000, conditions: 'Chromium local, production build, fonts and media checked before start; not an ENI measurement.' })
  assert.deepEqual(errors, [])
  await writeFile('docs/interactive/performance-browser-results.json', JSON.stringify({ results, errors }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve())) }
