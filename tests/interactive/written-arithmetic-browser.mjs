import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-written-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], count: 7, libreItems: [
  { layout: 'inline', a: 571, op: '+', b: 201, missing: 'a', result: 772, answer: '571', prompt: '□ + 201 = 772' },
  { layout: 'inline', a: 12, op: '÷', b: 4, missing: 'b', result: 3, answer: '4', prompt: '12 ÷ □ = 3' },
  { layout: 'inline', a: 0.1, op: '+', b: 0.2, missing: 'result', answer: '0,3', prompt: '0,1 + 0,2 = □' },
  { layout: 'column', a: 0.07, op: '×', b: 5.5, answer: '0,385' },
  { layout: 'inline', a: -61, op: '+', b: 28, answer: '(−33)', labels: ['relatif'], prompt: '(−61) + (+28) =' },
  { layout: 'inline', a: 1, op: '÷', b: 8, missing: 'result', answer: '0,125', prompt: '1 ÷ 8 = □' },
  { layout: 'inline', a: 0, op: '×', b: 4, missing: 'b', result: 0, answer: '4', prompt: '0 × □ = 0' },
] }]
const original = structuredClone(recipe)
const saved = { id: 'written-source', name: 'Calculs à trou et décimaux', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const card = (page, value) => page.locator('.ci-answer').filter({ has: page.getByText(value, { exact: true }) })
async function setup(width, height) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'written-fixture-only'))
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
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), expected)
  assert.equal(await page.locator('.ci-answer-muted').count(), 5)
  assert.equal(await page.locator('.ci-margin-answer, .ci-model-answer').count(), 0)
}
async function fits(page, width, height) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  for (const element of await page.locator('.ci-controls:visible, .ci-answer-grid:visible').all()) {
    const r = await element.boundingBox()
    assert.ok(r.x >= -1 && r.y >= -1 && r.x + r.width <= width + 1 && r.y + r.height <= height + 1, JSON.stringify(r))
  }
}
async function axe(page) {
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  assert.deepEqual(report.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })), [])
}
try {
  for (const [width, height] of [[390, 844], [1366, 768], [360, 640]]) {
    const { context, page } = await setup(width, height)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 6)
    await page.getByText(/plusieurs réponses possibles/).waitFor({ state: 'attached' })
    await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
    await page.locator('.ci-launch').click()
    await page.locator('.ci-answer').first().waitFor()
    assert.equal(await page.locator('.ci-question-prompt').innerText(), '□ + 201 = 772')
    assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
    assert.equal(await page.locator('.ci-answer').count(), 6)
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    await reveal(page, '571')
    await navigate(page, '12 ÷ □ = 3')
    await reveal(page, '4')
    assert.equal(await page.locator('.ci-question-prompt').innerText(), '12 ÷ □ = 3')
    await navigate(page, '0,1 + 0,2 = □')
    await reveal(page, '0,3')
    await button(page, 'Quitter la séance').click()
    await page.locator('.ci-launch:enabled').waitFor()
    await page.reload(); await button(page, 'Reprendre la séance').click()
    await page.locator('.ci-answer-key').waitFor()
    assert.equal(await page.locator('.ci-question-prompt').innerText(), '0,1 + 0,2 = □')
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,3')
    await navigate(page, '0,07 × 5,5 = □')
    await reveal(page, '0,385')
    await fits(page, width, height); await axe(page)
    if (width !== 360) await page.screenshot({ path: `docs/interactive/screenshots/written-arithmetic-${width}.png` })
    await navigate(page, '(−61) + (+28) = □')
    await reveal(page, '(−33)')
    assert.equal(await page.locator('.ci-question-prompt').innerText(), '(−61) + (+28) = □')
    results.push({ viewport: `${width}x${height}`, class: 'six cards, collective teacher reveal, missing first operand or divisor retained, finite decimal sum/product and signed answer', correction: 'key colored, five wrong cards gray, no duplicated answer; the equation keeps its blank', resume: 'same decimal question and revealed correction after reload', ambiguous: 'zero-product operand task excluded with a visible reason', layout: 'controls and answer cards fit; axe passes' })
    if (width === 390) {
      await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor()
      await button(page, 'Tout désélectionner').click()
      await page.locator('.ci-question-list fieldset > label').filter({ hasText: '1 ÷ 8 = □' }).locator('input').check()
      await button(page, 'Compétition').click(); await button(page, 'Préparer le défi local').click()
      await button(page, 'Ajouter cette mascotte').click(); await button(page, 'Renard').click(); await button(page, 'Ajouter cette mascotte').click()
      await button(page, 'Commencer la compétition').click(); await button(page, 'Je suis prêt').click()
      await page.locator('.ci-answer:enabled').first().waitFor()
      await context.setOffline(true)
      assert.equal(await page.locator('.ci-question-prompt').innerText(), '1 ÷ 8 = □')
      await card(page, '0,125').click(); await button(page, 'Je suis prêt').click()
      await page.locator('.ci-answer').filter({ hasNot: page.locator('.ci-answer-content > span').filter({ hasText: /^0,125$/ }) }).first().click()
      await page.locator('.ci-answer-key').waitFor()
      assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,125')
      assert.equal(await page.locator('.ci-answer-muted').count(), 5)
      await fits(page, width, height); await axe(page)
      results.push({ localCompetition: 'finite decimal quotient remains exact after all network access is disabled; two mascots, handoff and six-card correction' })
    }
    await context.close()
  }
  const { context, page } = await setup(390, 844)
  await button(page, 'Tout désélectionner').click()
  for (const prompt of ['12 ÷ □ = 3', '0,1 + 0,2 = □', '1 ÷ 8 = □']) await page.locator('.ci-question-list fieldset > label').filter({ hasText: prompt }).locator('input').check()
  await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check()
  await button(page, 'Mode de jeu').click()
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
  await button(page, 'Régler le minuteur').click(); await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1'); await button(page, 'Fermer les réglages').click()
  await page.clock.install(); await page.clock.pauseAt(new Date(Date.now() + 1000))
  await page.locator('.ci-launch').click(); await page.locator('.ci-answer:enabled').first().waitFor()
  await card(page, '4').click(); await page.locator('.ci-answer-correct').waitFor()
  await page.clock.runFor(1100)
  await page.locator('.ci-question-prompt').filter({ hasText: '0,1 + 0,2 = □' }).waitFor()
  const values = (await page.locator('.ci-answer-content').allTextContents()).map((text) => Number(text.replace('−', '-').replace(',', '.')))
  assert.deepEqual(values, [...values].sort((a, b) => a - b))
  await page.locator('.ci-answer').filter({ hasNot: page.locator('.ci-answer-content > span').filter({ hasText: /^0,3$/ }) }).first().click()
  await page.locator('.ci-answer-incorrect').waitFor()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,3')
  await page.clock.runFor(1100); await page.locator('.ci-question-prompt').filter({ hasText: '1 ÷ 8 = □' }).waitFor()
  await page.clock.runFor(5100); await page.locator('.ci-reveal').waitFor()
  assert.equal((await page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé')
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,125')
  await page.clock.runFor(1100); await page.locator('.ci-summary').waitFor()
  assert.equal(await page.locator('.ci-summary-questions > p').count(), 3)
  results.push({ solo: 'exact ascending decimal cards, correct operand then incorrect sum then timeout; automatic one-second progression and three-question report' })
  await context.close()
  assert.deepEqual(recipe, original); assert.ok(methods.every((method) => method === 'GET')); assert.deepEqual(errors, [])
  results.push({ sourceTemplate: 'unchanged', serverWrites: 0, errors })
  await writeFile('docs/interactive/written-arithmetic-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
