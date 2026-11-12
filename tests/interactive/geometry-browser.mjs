import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-geometry-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const geo = (figure, dims, prompt, answer) => ({ layout: 'geo', figure, dims, prompt, answer, responseAnswer: answer })
const areaSquare = 'Quelle est l’aire de ce carré ?'
const rectPerimeter = 'Quel est le périmètre de ce rectangle ?'
const missingWidth = 'Le périmètre mesure 14 cm. La longueur mesure 5 cm. Calculez la largeur.'
const missingSide = 'L’aire mesure 0,09 dm². Calculez le côté.'
recipe.pages = [{ ...recipe.pages[1], topic: 'aires', exerciseType: 'aires-carre', count: 9, libreItems: [
  geo('square', { side: 349, unit: 'cm' }, 'Calculez l’aire.', '121801 cm²'),
  geo('rectangle', { length: 3.2, width: 4, unit: 'cm' }, 'Calculez le périmètre.', '14,4 cm'),
  geo('square', { ask: 'side', unit: 'cm' }, 'Le périmètre mesure 14 cm. Calculez le côté.', '3,5 cm'),
  geo('rectangle', { length: 5, ask: 'width', unit: 'cm' }, missingWidth, '2 cm'),
  geo('square', { ask: 'side', unit: 'dm' }, missingSide, '0,3 dm'),
  geo('rectangle', { length: 3, ask: 'width', unit: 'km' }, 'L’aire mesure 7,5 km². La longueur mesure 3 km. Calculez la largeur.', '2,5 km'),
  geo('rectangle', { length: 1.25, width: 0.08, unit: 'cm' }, 'Calculez l’aire.', '0,1 cm²'),
  geo('square', { side: 3, unit: 'cm' }, 'Calculez le périmètre.', '12 cm'),
  geo('square', { ask: 'side', unit: 'cm' }, 'L’aire mesure 2 cm². Calculez le côté.', '1,414214 cm'),
] }]
const original = structuredClone(recipe)
const saved = { id: 'geometry-source', name: 'Carrés et rectangles', domains: ['géométrie'], recipe, createdAt: '2026-11-12T00:00:00Z', updatedAt: '2026-11-12T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const card = (page, value) => page.locator('.ci-answer').filter({ has: page.getByText(value, { exact: true }) })
async function setup(width, height) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'geometry-fixture-only'))
  await context.route('**/__test_api/fiches', (route) => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.setDefaultTimeout(30000)
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return { context, page }
}
async function navigate(page, prompt) {
  await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').filter({ hasText: prompt }).click()
  await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
}
async function reveal(page, expected) {
  for (const name of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await button(page, name).click()
  assert.equal((await page.locator('.ci-answer-key .ci-answer-content').innerText()).replace(/['’\u00a0\u202f]/g,''), expected.replace(/['’\u00a0\u202f]/g,''))
  assert.equal(await page.locator('.ci-answer-muted').count(), 5)
  assert.equal(await page.locator('.ci-margin-answer, .ci-model-answer').count(), 0)
}
async function fits(page, width, height) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  for (const element of await page.locator('.ci-controls:visible, .ci-answer-grid:visible').all()) {
    const r = await element.boundingBox()
    assert.ok(r.x >= -1 && r.y >= -1 && r.x+r.width <= width+1 && r.y+r.height <= height+1, JSON.stringify(r))
  }
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  assert.deepEqual(report.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [])
}
try {
  for (const [width, height] of [[390, 844], [1366, 768], [360, 640]]) {
    const { context, page } = await setup(width, height)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 8)
    await page.getByText(/sans arrondi/).waitFor({ state: 'attached' })
    await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
    await page.locator('.ci-launch').click(); await page.locator('.ci-answer').first().waitFor()
    assert.equal(await page.locator('.ci-question-prompt').innerText(), areaSquare)
    assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
    assert.match(await page.locator('.ci-context').innerText(), /349 cm/)
    await reveal(page, '121’801 cm²')
    await fits(page, width, height)
    await navigate(page, missingWidth)
    assert.match(await page.locator('.ci-figure').textContent(), /\?/)
    assert.doesNotMatch(await page.locator('.ci-figure').textContent(), /\b2 cm\b/)
    await reveal(page, '2 cm')
    assert.match(await page.locator('.ci-figure').textContent(), /\?/)
    await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor()
    await page.reload(); await button(page, 'Reprendre la séance').click(); await page.locator('.ci-answer-key').waitFor()
    assert.equal(await page.locator('.ci-question-prompt').innerText(), missingWidth)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '2 cm')
    await navigate(page, missingSide); await reveal(page, '0,3 dm')
    assert.doesNotMatch(await page.locator('.ci-figure').textContent(), /0,3/)
    await fits(page, width, height)
    if (width !== 360) await page.screenshot({ path: `docs/interactive/screenshots/geometry-${width}.png` })
    results.push({ viewport: `${width}x${height}`, class: 'exact area/perimeter and missing dimensions; six cards with units, collective reveal', publicFigure: 'unknown remains ? before and after correction; all givens readable as text', resume: 'same missing-width question and correction', layout: 'controls and choices fit; axe passes' })
    if (width === 390) {
      await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor()
      await button(page, 'Tout désélectionner').click()
      await page.locator('.ci-question-list fieldset > label').filter({ hasText: missingWidth }).locator('input').check()
      await button(page, 'Compétition').click(); await button(page, 'Préparer le défi local').click()
      await button(page, 'Ajouter cette mascotte').click(); await button(page, 'Renard').click(); await button(page, 'Ajouter cette mascotte').click()
      await button(page, 'Commencer la compétition').click(); await button(page, 'Je suis prêt').click()
      await page.locator('.ci-answer:enabled').first().waitFor(); await context.setOffline(true)
      assert.match(await page.locator('.ci-figure').textContent(), /\?/)
      await card(page, '2 cm').click(); await button(page, 'Je suis prêt').click()
      await page.locator('.ci-answer').filter({ hasNot: page.getByText('2 cm', { exact: true }) }).first().click()
      await page.locator('.ci-answer-key').waitFor()
      assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '2 cm')
      await fits(page, width, height)
      results.push({ localCompetition: 'rectangle with public unit and unknown width, two mascots, offline turns, correct and incorrect answers' })
    }
    await context.close()
  }
  const { context, page } = await setup(390, 844)
  await button(page, 'Tout désélectionner').click()
  for (const prompt of [rectPerimeter, missingWidth, missingSide]) await page.locator('.ci-question-list fieldset > label').filter({ hasText: prompt }).locator('input').check()
  await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check()
  await button(page, 'Mode de jeu').click()
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
  await button(page, 'Régler le minuteur').click(); await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1'); await button(page, 'Fermer les réglages').click()
  await page.clock.install(); await page.clock.pauseAt(new Date(Date.now()+1000))
  await page.locator('.ci-launch').click(); await page.locator('.ci-answer:enabled').first().waitFor()
  const values=(await page.locator('.ci-answer-content').allTextContents()).map(t=>Number(t.replace(/ cm$/, '').replace(',', '.')))
  assert.deepEqual(values,[...values].sort((a,b)=>a-b))
  await card(page, '14,4 cm').click(); await page.locator('.ci-answer-correct').waitFor(); await page.clock.runFor(1100)
  await page.locator('.ci-question-prompt').filter({ hasText: missingWidth }).waitFor()
  await page.locator('.ci-answer').filter({ hasNot: page.getByText('2 cm', { exact: true }) }).first().click()
  await page.locator('.ci-answer-incorrect').waitFor(); await page.clock.runFor(1100)
  await page.locator('.ci-question-prompt').filter({ hasText: missingSide }).waitFor()
  await page.clock.runFor(5100); await page.locator('.ci-reveal').waitFor()
  assert.equal((await page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé')
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,3 dm')
  await page.clock.runFor(1100); await page.locator('.ci-summary').waitFor()
  assert.equal(await page.locator('.ci-summary-questions > p').count(), 3)
  await context.close()
  assert.deepEqual(recipe, original); assert.ok(methods.every(method=>method==='GET')); assert.deepEqual(errors,[])
  results.push({ solo: 'ascending numeric cards with units; success, error and timeout; automatic one-second progression', sourceTemplate: 'unchanged', serverWrites: 0, errors })
  await writeFile('docs/interactive/geometry-results.json',JSON.stringify(results,null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
} finally { await browser.close(); await server.close() }
