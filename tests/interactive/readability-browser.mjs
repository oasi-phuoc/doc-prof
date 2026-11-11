import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-readability-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const paragraph = 'Le samedi matin, la bibliothèque du quartier accueille les familles et propose des livres ainsi que des ateliers pour découvrir les histoires du monde. '
const options = (texts) => texts.map((texte, index) => ({ lettre: String.fromCharCode(65 + index), texte, correct: index === 2 }))
const question = (prompt, texts) => ({ layout: 'tcf', prompt: '', answer: 'C', tcf: { kind: 'qcm', numero: 1, enonce: prompt, mode: 'texte', choix: options(texts) } })
recipe.pages = [{ ...recipe.pages[0], libreItems: [
  question('Quelle carte choisis-tu ?', ['Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six']),
  question('Où peut-on emprunter un livre ?', [paragraph, ...['À la banque.', 'À la bibliothèque.', 'À la gare.', 'Au marché.', 'À la piscine.']]),
  question('Lis les propositions et choisis ta carte.', Array.from({ length: 6 }, (_, i) => `${i + 1} : ${paragraph.repeat(10)} FIN DE LA PROPOSITION ${i + 1}`)),
  question(`${paragraph.repeat(12)} FIN DE LA QUESTION`, ['Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six']),
] }]
const original = structuredClone(recipe)
const saved = { id: 'readability-source', name: 'Lisibilité de la fiche', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
async function axe(page) { const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze(); assert.deepEqual(scan.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })), []) }
async function navigate(page, prompt) {
  await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').filter({ hasText: prompt }).click()
  await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
}
async function fits(page, width, height) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  for (const element of await page.locator('.ci-controls:visible, .ci-answer-grid:visible').all()) {
    const r = await element.boundingBox()
    assert.ok(r.x >= -1 && r.y >= -1 && r.x + r.width <= width + 1 && r.y + r.height <= height + 1, JSON.stringify(r))
  }
}
try {
  for (const [width, height] of [[1920, 1080], [1366, 768], [390, 844], [360, 640]]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'readability-fixture-only'))
    await context.route('**/__test_api/fiches', (route) => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
    const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/interactif/${saved.id}`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    const report = await page.locator('.ci-readability-check').innerText()
    assert.match(report, /1 920 × 1 080 et 1 366 × 768/)
    assert.match(report, /défilement nécessaire/)
    assert.match(report, /FIN DE LA QUESTION/)
    const listWarnings = await page.locator('[data-readability-level="2"]').count()
    assert.equal(page.frames().length, 1)
    await page.locator('.ci-launch').click()
    await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    assert.equal(await page.locator('.ci-round-question').getAttribute('data-ci-readability'), '0')
    await fits(page, width, height)
    if (width === 1366) {
      const bounded = await page.evaluate(async () => {
        const { fitQuestion } = await import('/src/interactive/layout/fit.ts')
        const root = document.querySelector('.ci-round-question'), heading = root.querySelector('h1')
        const target = parseFloat(getComputedStyle(heading).fontSize), fitted = fitQuestion(root, 300), size = parseFloat(getComputedStyle(heading).fontSize)
        fitQuestion(root)
        return { ...fitted, target, size }
      })
      assert.equal(bounded.level, 1)
      assert.ok(bounded.size >= 32 && bounded.size < bounded.target)
    }
    if (width === 1920) {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForFunction(() => document.querySelector('.ci-answer-grid')?.getBoundingClientRect().bottom <= 844)
      await fits(page, 390, 844)
      await page.setViewportSize({ width, height })
      await page.waitForFunction(() => document.querySelector('.ci-round-question')?.clientWidth > 700)
    }
    await navigate(page, 'Lis les propositions et choisis ta carte.')
    assert.equal(await page.locator('.ci-round-question').getAttribute('data-ci-readability'), '3')
    assert.equal(await page.getByRole('button', { name: /^Lire la proposition [A-F] en entier$/ }).count(), 6)
    await fits(page, width, height)
    await axe(page)
    const read = button(page, 'Lire la proposition A en entier')
    await read.focus(); await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Proposition A', exact: true })
    await dialog.waitFor()
    assert.match(await dialog.innerText(), /FIN DE LA PROPOSITION/)
    const region = dialog.getByRole('region')
    await region.focus(); await page.keyboard.press('End')
    await page.waitForFunction(() => document.querySelector('.ci-text-dialog-body')?.scrollTop > 0)
    await axe(page)
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'detached' })
    assert.equal(await read.evaluate((node) => node === document.activeElement), true)
    assert.equal(await page.locator('.ci-chosen, .ci-answer-key').count(), 0)
    await navigate(page, 'FIN DE LA QUESTION')
    const questionRead = page.getByRole('button', { name: /Suite.*Lire la question et le document/ })
    await questionRead.click()
    const fullQuestion = page.getByRole('dialog', { name: 'Question et document', exact: true })
    assert.match(await fullQuestion.innerText(), /FIN DE LA QUESTION/)
    await button(page, 'Fermer la lecture').click()
    await fits(page, width, height)
    await axe(page)
    await page.screenshot({ path: `docs/interactive/screenshots/readability-${width}.png` })
    if (width === 1366) {
      await navigate(page, 'Où peut-on emprunter un livre ?')
      const trials = await page.evaluate(async () => {
        const { fitQuestion } = await import('/src/interactive/layout/fit.ts')
        const root = document.querySelector('.ci-round-question'), text = root.querySelector('.ci-answer-content > span'), trials = []
        for (const length of [0.5, 1, 2, 3, 4, 5, 6, 8]) {
          text.textContent = 'La bibliothèque accueille les familles. '.repeat(length)
          for (const height of [350, 450, 550]) {
            const report = fitQuestion(root, height), body = root.querySelector('.ci-question-body'), grid = root.querySelector('.ci-answer-grid')
            trials.push({ length, height, ...report, root: [root.clientHeight, root.scrollHeight], body: [body.clientHeight, body.scrollHeight], grid: [grid.clientHeight, grid.scrollHeight] })
          }
        }
        return trials
      })
      assert.ok(trials.some((trial) => trial.level === 2), 'The measured vertical list fits before scrolling.')
    }
    results.push({ viewport: `${width}x${height}`, listWarnings, preflight: 'both required desktop viewports measured using the real projection, with long question warnings and no leftover frames', adaptation: 'short question kept unchanged; six long choices get equal reading controls and scrolling; long prompt remains available in full; live resize remains within viewport', accessibility: 'axe on long choices and full text; keyboard scroll, Escape and focus restoration; reading never selects an answer' })
    await context.close()
  }
  assert.deepEqual(recipe, original)
  assert.ok(methods.every((method) => method === 'GET'))
  assert.deepEqual(errors, [])
  await writeFile('docs/interactive/readability-results.json', JSON.stringify({ results, sourceTemplate: 'unchanged', serverWrites: 0, errors }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
