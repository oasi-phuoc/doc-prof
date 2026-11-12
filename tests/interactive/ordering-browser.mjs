import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-ordering-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const pageFor = (domain, type, items) => ({ ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, count: items.length, libreItems: items })
const numbers = ['34', '24', '6', '68', '76', '19', '7']
recipe.pages = [
  pageFor('tcm-csc', 'tcm-csc-ex06', [
    { layout: 'order', sequence: numbers, placeParts: ['6', '7', '19', '24', '34', '68', '76'], orderOp: '<', prompt: 'Du plus petit au plus grand :', answer: '6 < 7 < 19 < 24 < 34 < 68 < 76' },
    { layout: 'order', sequence: ['5,79', '5,07', '5,48', '5,5', '5,4'], placeParts: ['5,79', '5,5', '5,48', '5,40', '5,07'], orderOp: '>', prompt: 'Du plus grand au plus petit :', answer: '5,79 > 5,5 > 5,48 > 5,4 > 5,07' },
  ]),
  pageFor('alphabetisation', 'alpha-alphabet-alphabet-ordre', [
    { layout: 'order', sequence: ['T', 'H', 'B', 'Q', 'S'], placeParts: ['B', 'H', 'Q', 'S', 'T'], orderOp: '<', prompt: 'Classez ces lettres par ordre alphabétique.', answer: 'B H Q S T' },
  ]),
  pageFor('alphabetisation', 'alpha-phrase-le-chat-ordre-phrases', [
    { layout: 'order', sequence: ['le', 'chat', 'voit', 'Le', 'chien'], placeParts: ['Le', 'chat', 'voit', 'le', 'chien'], prompt: 'Remettez la phrase en ordre.', answer: 'Le chat voit le chien' },
    { layout: 'order', sequence: ['Elle', 'achète', 'des', 'tomates', 'et', 'des', 'carottes'], placeParts: ['Elle', 'achète', 'des', 'tomates', 'et', 'des', 'carottes'], prompt: 'Remettez la phrase en ordre.', answer: 'Elle achète des tomates et des carottes' },
  ]),
]
const original = structuredClone(recipe)
const saved = { id: 'ordering-source', name: 'Nombres, alphabet et phrases', domains: ['tcm-csc', 'alphabetisation'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], methods = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const card = (page, value) => page.locator('.ci-answer').filter({ has: page.getByText(value, { exact: true }) })
const words = (page) => page.locator('.ci-word-sequence > button > b').allTextContents()
async function setup(width, height) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'ordering-fixture-only'))
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
async function reveal(page, expected, open = false) {
  for (const name of [open ? 'Commencer l’échange' : 'Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await button(page, name).click()
  if (!open) { assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), expected); assert.equal(await page.locator('.ci-answer-muted').count(), await page.locator('.ci-answer').count() - 1); assert.equal(await page.locator('.ci-model-answer, .ci-margin-answer').count(), 0) }
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
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 18)
    await page.getByText(/hors limite de deux à six éléments/).waitFor({ state: 'attached' })
    await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
    await page.locator('.ci-launch').click(); await page.locator('.ci-answer').first().waitFor()
    assert.equal(await page.locator('.ci-question-prompt').innerText(), 'Quel est le plus petit nombre ?')
    assert.equal(await page.locator('.ci-answer').count(), 6); assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
    const given = await page.locator('.ci-context').innerText()
    assert.ok(numbers.every((term) => given.includes(term))); assert.ok(!given.includes('6 < 7'))
    const read = page.getByRole('button', { name: /Suite.*Lire la question et le document/ })
    let fullReading = false
    if (await read.count()) { await read.click(); fullReading = true; assert.match(await page.locator('.ci-text-dialog').innerText(), /34 · 24 · 6 · 68 · 76 · 19 · 7/); await axe(page); await button(page, 'Fermer la lecture').click() }
    await reveal(page, '6')
    await navigate(page, 'Quel est le 7e plus petit nombre ?'); await reveal(page, '76')
    await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor(); await page.reload(); await button(page, 'Reprendre la séance').click()
    await page.locator('.ci-answer-key').waitFor()
    assert.equal(await page.locator('.ci-question-prompt').innerText(), 'Quel est le 7e plus petit nombre ?'); assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '76')
    await fits(page, width, height); await axe(page)
    if (width !== 360) await page.screenshot({ path: `docs/interactive/screenshots/ordering-${width}.png` })
    await navigate(page, 'Quel est le 3e plus grand nombre ?'); await reveal(page, '5,48')
    await navigate(page, 'Quelle est la première lettre ?')
    assert.equal(await page.locator('.ci-answer').count(), 5); await reveal(page, 'B')
    await navigate(page, 'Remets les mots dans l’ordre.')
    const start = await words(page)
    assert.deepEqual(start, ['le', 'chat', 'voit', 'Le', 'chien']); assert.equal(await page.locator('.ci-model-answer').count(), 0)
    await page.locator('.ci-word-sequence > button').first().click(); await page.locator('.ci-word-sequence > button').nth(3).click()
    assert.deepEqual(await words(page), ['Le', 'chat', 'voit', 'le', 'chien'])
    await button(page, 'Annuler le déplacement').click(); assert.deepEqual(await words(page), start)
    await page.locator('.ci-word-sequence > button').first().focus(); await page.keyboard.press('ArrowRight')
    const moved = await words(page)
    await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor(); await page.reload(); await button(page, 'Reprendre la séance').click()
    await page.locator('.ci-word-sequence').waitFor(); assert.deepEqual(await words(page), moved)
    await reveal(page, undefined, true); assert.match(await page.locator('.ci-model-answer').innerText(), /Le chat voit le chien/)
    assert.equal(await page.locator('.ci-answer-key').count(), 0); await button(page, 'Acquis').click()
    await axe(page); await fits(page, width, height)
    results.push({ viewport: `${width}x${height}`, numericOrder: 'seven independent ranks with six source cards and all seven given numbers, correct smallest/largest rank, exact descending decimal order', alphabet: 'five source letters and teacher-only key', correction: 'only the correct card is colored, no duplicated key; rank and correction resume after reload', words: 'original tokens, repeated words by distinct positions, touch swap, undo, keyboard move and reload; source model only after reveal and human assessment', longPhrase: 'visible exclusion without truncating its seven words', fullReadingOpened: fullReading, layout: 'answers and commands fit; axe passes' })
    if (width === 390) {
      await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor(); await button(page, 'Tout désélectionner').click()
      await page.locator('.ci-question-list fieldset > label').filter({ hasText: 'Quel est le 2e plus petit nombre ?' }).locator('input').check()
      await button(page, 'Compétition').click(); await button(page, 'Préparer le défi local').click()
      await button(page, 'Ajouter cette mascotte').click(); await button(page, 'Renard').click(); await button(page, 'Ajouter cette mascotte').click()
      await button(page, 'Commencer la compétition').click(); await button(page, 'Je suis prêt').click(); await page.locator('.ci-answer:enabled').first().waitFor()
      await context.setOffline(true)
      const localGiven = await page.locator('.ci-context').innerText()
      assert.ok(numbers.every((term) => localGiven.includes(term))); await card(page, '7').click(); await button(page, 'Je suis prêt').click()
      assert.equal(await page.locator('.ci-answer-key').count(), 0)
      await page.locator('.ci-answer').filter({ hasNot: page.getByText('7', { exact: true }) }).first().click(); await page.locator('.ci-answer-key').waitFor()
      assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '7'); assert.equal(await page.locator('.ci-answer-muted').count(), 5)
      await fits(page, width, height); await axe(page)
      results.push({ localCompetition: 'all given numbers retained after network is disabled; two mascot turns, rank key and five gray source alternatives' })
    }
    await context.close()
  }
  const { context, page } = await setup(390, 844)
  await button(page, 'Tout désélectionner').click()
  for (const rank of [2, 3, 4]) await page.locator('.ci-question-list fieldset > label').filter({ hasText: `Quel est le ${rank}e plus petit nombre ?` }).locator('input').check()
  await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check(); await button(page, 'Mode de jeu').click()
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
  await button(page, 'Régler le minuteur').click(); await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1'); await button(page, 'Fermer les réglages').click()
  await page.clock.install(); await page.clock.pauseAt(new Date(Date.now() + 1000)); await page.locator('.ci-launch').click(); await page.locator('.ci-answer:enabled').first().waitFor()
  const sorted = (await page.locator('.ci-answer-content').allTextContents()).map(Number); assert.deepEqual(sorted, [...sorted].sort((a, b) => a - b))
  await card(page, '7').click(); await page.locator('.ci-answer-correct').waitFor(); await page.clock.runFor(1100)
  await page.locator('.ci-question-prompt').filter({ hasText: 'Quel est le 3e plus petit nombre ?' }).waitFor()
  await page.locator('.ci-answer').filter({ hasNot: page.getByText('19', { exact: true }) }).first().click(); await page.locator('.ci-answer-incorrect').waitFor()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '19'); await page.clock.runFor(1100)
  await page.locator('.ci-question-prompt').filter({ hasText: 'Quel est le 4e plus petit nombre ?' }).waitFor(); await page.clock.runFor(5100); await page.locator('.ci-reveal').waitFor()
  assert.equal((await page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé'); assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '24')
  await page.clock.runFor(1100); await page.locator('.ci-summary').waitFor(); assert.equal(await page.locator('.ci-summary-questions > p').count(), 3)
  results.push({ solo: 'three selected ranks, ascending source cards, correct choice then wrong rank then timeout; one-second automatic correction transitions and three-question report' })
  await context.close()
  assert.deepEqual(recipe, original); assert.ok(methods.every((method) => method === 'GET')); assert.deepEqual(errors, [])
  results.push({ sourceTemplate: 'unchanged', serverWrites: 0, errors })
  await writeFile('docs/interactive/ordering-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
