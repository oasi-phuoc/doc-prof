import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-numeracy-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], libreItems: [
  { layout: 'compare', left: '1/3', right: '0,3', answer: '>' },
  { layout: 'compare', left: '0,1 + 0,2', right: '0,3', answer: '=' },
  { layout: 'compare', left: "9'007'199'254'740'993", right: "9'007'199'254'740'992", answer: '>' },
  { layout: 'sequence', sequence: ['5', '□', '15', '□', '25', '□', '35', '40'], blankIndexes: [1, 3, 5], answer: '10 ; 20 ; 30', prompt: 'Aide : +5' },
  { layout: 'sequence', sequence: ['0,05', '0,4', '0,75', '1,1', '1,45', '1,8'], blankIndexes: [0, 1, 4, 5], answer: '0,05 ; 0,4 ; 1,45 ; 1,8' },
] }]
const original = structuredClone(recipe)
const saved = { id: 'numeracy-source', name: 'Comparaisons et suites', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const decimalMask = ['□', '□', '0,75', '1,1', '□', '□']
const terms = (page) => page.locator('.ci-question .ci-number-sequence b').allTextContents()
async function setup(width, height) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'numeracy-fixture-only'))
  await context.route('**/__test_api/fiches', (route) => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.setDefaultTimeout(30000)
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return { context, page }
}
async function navigate(page, prompt) {
  await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').filter({ hasText: prompt }).first().click()
  await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
}
async function reveal(page) { for (const name of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await button(page, name).click() }
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
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 10)
    await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
    await page.locator('.ci-launch').click()
    await page.locator('.ci-answer').first().waitFor()
    assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
    assert.deepEqual((await page.locator('.ci-answer-content').allTextContents()).sort(), ['<', '=', '>'].sort())
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '>')
    assert.equal(await page.locator('.ci-answer-muted').count(), 2)
    await navigate(page, '0,1 + 0,2')
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '=')
    await navigate(page, "9'007'199'254'740'993")
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '>')
    await navigate(page, 'Quel nombre manque à la position 2 ?')
    const intMask = ['5', '□', '15', '□', '25', '□', '35', '40']
    assert.deepEqual(await terms(page), intMask)
    assert.equal(await page.locator('.ci-number-target').getAttribute('aria-label'), 'Position 2 : nombre à trouver')
    assert.equal(await page.locator('.ci-number-hint').innerText(), 'Aide : +5')
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '10')
    assert.equal(await page.locator('.ci-answer-muted').count(), 5)
    assert.deepEqual(await terms(page), intMask)
    assert.equal(await page.locator('.ci-model-answer, .ci-margin-answer').count(), 0)
    await button(page, 'Quitter la séance').click()
    await page.locator('.ci-launch:enabled').waitFor()
    await page.reload()
    await button(page, 'Reprendre la séance').click()
    await page.locator('.ci-number-target').waitFor()
    assert.deepEqual(await terms(page), intMask)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '10')
    await navigate(page, 'Quel nombre manque à la position 1 ?')
    assert.deepEqual(await terms(page), decimalMask)
    await fits(page, width, height)
    // Small screens can open the whole sequence without leaking the missing terms.
    const read = page.getByRole('button', { name: /Suite.*Lire la question et le document/ })
    if (await read.count()) {
      await read.click()
      assert.deepEqual(await page.locator('.ci-text-dialog .ci-number-sequence b').allTextContents(), decimalMask)
      await axe(page)
      await button(page, 'Fermer la lecture').click()
    }
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,05')
    assert.deepEqual(await terms(page), decimalMask)
    await axe(page)
    if (width !== 360) await page.screenshot({ path: `docs/interactive/screenshots/numeracy-${width}.png` })
    results.push({ viewport: `${width}x${height}`, comparisons: 'fractions, exact decimal sum and integers beyond floating-point precision', sequence: 'one target per missing term, source hint, other blanks stay hidden even in correction and full reading', correction: 'only the correct card remains colored; no duplicate answer', resume: 'same target, masked terms and revealed key after reload', layout: 'controls and answer grid fit; accessible full reading if needed; axe passes' })
    if (width === 390) {
      await button(page, 'Quitter la séance').click()
      await page.locator('.ci-launch:enabled').waitFor()
      await button(page, 'Tout désélectionner').click()
      await page.locator('.ci-question-list fieldset > label').filter({ hasText: 'Quel nombre manque à la position 1 ?' }).locator('input').check()
      await button(page, 'Compétition').click()
      await button(page, 'Préparer le défi local').click()
      await button(page, 'Ajouter cette mascotte').click()
      await button(page, 'Renard').click(); await button(page, 'Ajouter cette mascotte').click()
      await button(page, 'Commencer la compétition').click(); await button(page, 'Je suis prêt').click()
      assert.deepEqual(await terms(page), decimalMask)
      await context.setOffline(true)
      await page.locator('.ci-answer').filter({ hasText: '0,05' }).click()
      await button(page, 'Je suis prêt').click()
      assert.deepEqual(await terms(page), decimalMask)
      await page.locator('.ci-answer').filter({ hasNotText: '0,05' }).first().click()
      await page.locator('.ci-answer-key').waitFor()
      assert.deepEqual(await terms(page), decimalMask)
      assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '0,05')
      assert.equal(await page.locator('.ci-answer-muted').count(), 5)
      await fits(page, width, height)
      await axe(page)
      results.push({ localCompetition: 'same masked sequence passed between two mascots after all network access was disabled; source correction and five gray cards' })
    }
    await context.close()
  }
  const { context, page } = await setup(390, 844)
  await button(page, 'Tout désélectionner').click()
  for (const position of [1, 5, 6]) await page.locator('.ci-question-list fieldset > label').filter({ hasText: `Quel nombre manque à la position ${position} ?` }).last().locator('input').check()
  await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check()
  await button(page, 'Mode de jeu').click()
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
  await button(page, 'Régler le minuteur').click()
  await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1')
  await button(page, 'Fermer les réglages').click()
  await page.clock.install(); await page.clock.pauseAt(new Date(Date.now() + 1000))
  await page.locator('.ci-launch').click()
  await page.locator('.ci-answer:enabled').first().waitFor()
  assert.deepEqual(await terms(page), decimalMask)
  const values = (await page.locator('.ci-answer-content').allTextContents()).map((text) => Number(text.replaceAll('−', '-').replace(',', '.')))
  assert.deepEqual(values, [...values].sort((a, b) => a - b))
  await page.locator('.ci-answer').filter({ hasText: '0,05' }).click()
  await page.locator('.ci-answer-correct').waitFor()
  assert.deepEqual(await terms(page), decimalMask)
  await page.clock.runFor(1100)
  await page.locator('.ci-number-target[aria-label="Position 5 : nombre à trouver"]').waitFor()
  assert.equal(await page.locator('.ci-chosen, .ci-answer-key').count(), 0)
  await page.locator('.ci-answer').filter({ hasNotText: '1,45' }).first().click()
  await page.locator('.ci-answer-incorrect').waitFor()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '1,45')
  await page.clock.runFor(1100)
  await page.locator('.ci-number-target[aria-label="Position 6 : nombre à trouver"]').waitFor()
  await page.clock.runFor(5100)
  await page.locator('.ci-reveal').waitFor()
  assert.match(await page.locator('.ci-correction-status').innerText(), /Temps écoulé/)
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '1,8')
  assert.deepEqual(await terms(page), decimalMask)
  await page.clock.runFor(1100)
  await page.locator('.ci-summary').waitFor()
  assert.equal(await page.locator('.ci-summary-questions > p').count(), 3)
  results.push({ solo: 'three separately selected blanks, exact ascending decimal cards, correct and incorrect answers then timeout; one-second automatic transitions; masks preserved in correction' })
  await context.close()
  assert.deepEqual(recipe, original); assert.ok(methods.every((method) => method === 'GET')); assert.deepEqual(errors, [])
  results.push({ serverWrites: 0, sourceTemplate: 'unchanged', errors })
  await writeFile('docs/interactive/numeracy-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
