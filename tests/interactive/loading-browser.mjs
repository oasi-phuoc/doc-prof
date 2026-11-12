import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-loading-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
async function setup(width) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 768 }, reducedMotion: 'reduce' })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'loading-fixture-only'))
  await context.route('**/__test_api/fiches', (route) => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: '{"fiches":[]}' }) })
  const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
  return { context, page }
}
async function gate(context, pattern) {
  let release
  const held = new Promise((resolve) => { release = resolve })
  await context.route(pattern, async (route) => { await held; await route.continue().catch(() => {}) })
  return release
}
async function loader(page, title, width) {
  const status = page.getByRole('status', { name: title, exact: true })
  await status.waitFor({ timeout: 120000 })
  const measured = await status.evaluate((node) => {
    const box = node.getBoundingClientRect(), scene = node.querySelector('.cfl-loading-scene')?.getBoundingClientRect()
    return { x: box.x, y: box.y, width: box.width, height: box.height, sceneX: scene?.x, sceneWidth: scene?.width, running: node.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running'), scroll: document.documentElement.scrollWidth, viewport: innerWidth, heightViewport: innerHeight }
  })
  assert.equal(measured.viewport, width); assert.ok(measured.scroll <= width)
  assert.ok(measured.running, 'The requested animation remains active, including with the system reduced-motion preference.')
  assert.ok(Math.abs(measured.sceneX + measured.sceneWidth / 2 - width / 2) < 2)
  assert.ok(measured.y >= -1 && measured.y + measured.height <= measured.heightViewport + 1)
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  assert.deepEqual(axe.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) })), [])
  return status
}
try {
  await mkdir('docs/interactive/screenshots', { recursive: true })
  for (const width of [390, 1366]) {
    const boot = await setup(width), releaseBoot = await gate(boot.context, '**/src/main.tsx*')
    await boot.page.goto(`${base}/generateur`, { waitUntil: 'commit' })
    await loader(boot.page, 'Ouverture de ClairFLE', width)
    await boot.page.screenshot({ path: `docs/interactive/screenshots/loading-start-${width}.png` })
    releaseBoot()
    await boot.page.getByLabel('Domaine', { exact: true }).waitFor({ timeout: 120000 })
    assert.equal(await boot.page.locator('[data-loading-screen]').count(), 0)
    await boot.context.close()
    results.push({ width, initialHtml: 'branded animated loading screen visible before JavaScript loads; centered and contained in the viewport; no automatic axe violations' })

    for (const [path, module, title] of [
      ['/generateur', '**/src/components/generator/GeneratorPage.tsx*', 'Ouverture du créateur de fiches'],
      ['/fiches', '**/src/components/generator/SavedFichesPage.tsx*', 'Ouverture des fiches'],
      ['/interactif/demo', '**/src/interactive/InteractiveApp.tsx*', 'Préparation du jeu'],
      ['/interactif/cartes', '**/src/interactive/CardsPage.tsx*', 'Préparation des cartes'],
      ['/interactif/diagnostic', '**/src/interactive/DiagnosticPage.tsx*', 'Ouverture du diagnostic'],
      ['/interactif/rejoindre', '**/src/interactive/competition/CompetitionPage.tsx*', 'Ouverture de la compétition'],
    ]) {
      const { page, context } = await setup(width), release = await gate(context, module)
      await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' })
      await loader(page, title, width)
      if (path === '/interactif/demo') await page.screenshot({ path: `docs/interactive/screenshots/loading-game-${width}.png` })
      release()
      if (path === '/generateur') await page.getByLabel('Domaine', { exact: true }).waitFor({ timeout: 120000 })
      else if (path === '/interactif/demo') await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
      else await page.waitForFunction(() => !document.querySelector('[data-loading-screen]'), null, { timeout: 120000 })
      assert.equal(await page.locator('[data-loading-screen]').count(), 0)
      await context.close()
      results.push({ width, path, route: 'held lazy module displays the matching animated screen; releasing the real request opens the page without an artificial delay' })
    }
  }
  const library = await setup(390)
  await library.context.unroute('**/__test_api/fiches')
  let releaseData
  const data = new Promise((resolve) => { releaseData = resolve })
  await library.context.route('**/__test_api/fiches', async (route) => { methods.push(route.request().method()); await data; await route.fulfill({ status: 200, contentType: 'application/json', body: '{"fiches":[]}' }) })
  await library.page.goto(`${base}/fiches`)
  const dataLoader = library.page.getByRole('status', { name: 'Chargement des fiches', exact: true })
  await dataLoader.waitFor({ timeout: 120000 })
  assert.equal(await library.page.locator('[data-loading-screen="panel"]').count(), 1)
  assert.ok(await dataLoader.evaluate((node) => node.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running')))
  releaseData(); await dataLoader.waitFor({ state: 'detached' })
  await library.context.close()
  results.push({ dataRequest: 'library keeps its header and an animated panel while waiting for actual worksheet data; loading clears on completion' })
  const failing = await setup(390)
  await failing.context.unroute('**/__test_api/fiches')
  let unavailable = true
  await failing.context.route('**/__test_api/fiches', (route) => { methods.push(route.request().method()); return route.fulfill({ status: unavailable ? 503 : 200, contentType: 'application/json', body: unavailable ? '{"error":"Indisponible"}' : '{"fiches":[]}' }) })
  await failing.page.goto(`${base}/fiches`)
  await failing.page.getByRole('alert').waitFor({ timeout: 120000 })
  assert.equal(await failing.page.locator('[data-loading-screen]').count(), 0, 'A failed request exposes the existing error and retry, without an endless loader.')
  unavailable = false
  await failing.page.getByRole('button', { name: 'Réessayer', exact: true }).click()
  await failing.page.getByRole('alert').waitFor({ state: 'detached' })
  await failing.page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
  await failing.context.close()
  results.push({ dataFailure: 'a failed library request removes the animation and exposes the error; explicit retry restores the library' })

  const navigation = await setup(390), releaseNavigation = await gate(navigation.context, '**/src/components/generator/GeneratorPage.tsx*')
  await navigation.page.goto(`${base}/`)
  await navigation.page.getByRole('button', { name: 'Créer une fiche', exact: true }).first().click()
  await loader(navigation.page, 'Ouverture du créateur de fiches', 390)
  await navigation.page.goBack()
  await navigation.page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
  releaseNavigation()
  await navigation.page.waitForTimeout(150)
  assert.equal(new URL(navigation.page.url()).pathname, '/')
  assert.equal(await navigation.page.locator('[data-loading-screen]').count(), 0)
  await navigation.page.getByRole('button', { name: 'Créer une fiche', exact: true }).first().waitFor()
  await navigation.context.close()
  results.push({ navigation: 'a real Create click shows loading; browser Back cancels the transition; a late module response cannot reopen the abandoned page' })
  assert.ok(methods.every((method) => method === 'GET')); assert.deepEqual(errors, [])
  await writeFile('docs/interactive/loading-results.json', JSON.stringify({ results, errors, serverWrites: 0 }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
