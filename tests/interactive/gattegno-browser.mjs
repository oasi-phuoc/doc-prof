import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5182'
const server = await createServer({ cacheDir: '/tmp/clairfle-gattegno-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
const { PHRASE_THEME_DEFS } = await server.ssrLoadModule('/src/francais/phrase-themes.ts')
const { PHRASE_COLORS } = await server.ssrLoadModule('/src/francais/phrase-banks.ts')
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = ['colorier', 'ordre', 'construire', 'ecrire'].map((kind) => ({
  ...defaultPage('gattegno'), topic: 'phrase-pronominaux', exerciseType: `phrase-pronominaux-${kind}`,
  count: 4, columns: 1, verbGroup: 'mixte', phrasePolarity: 'mixed',
}))
recipe.seed = 75
recipe.libreMode = false
recipe.libreSnapshot = null
recipe.printCorrections = true
recipe.institutional = { ...recipe.institutional, course: 'Français' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const preview = (page) => page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible').first()
async function select(page, label, value) {
  await page.getByRole('button', { name: label, exact: true }).click()
  await page.getByRole('option', { name: value, exact: true }).click()
  await page.getByRole('button', { name: label, exact: true }).getByText(value, { exact: true }).waitFor()
}
async function countInPreview(page, selector, count) {
  await page.waitForFunction(({ selector, count }) => document.querySelector('.sheet-stage:not(.print-only-sheets) .worksheet-sheet')?.querySelectorAll(selector).length === count, { selector, count })
  assert.equal(await preview(page).locator(selector).count(), count)
}
try {
  await mkdir('docs/gattegno/screenshots', { recursive: true })
  for (const [width, height] of [[1366, 1000], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript((fiche) => {
      if (location.pathname === '/generateur') history.replaceState({ clairfleFiche: fiche }, '', location.href)
    }, { id: 'gattegno-audit-fixture', name: 'Audit Gattegno', recipe })
    const page = await context.newPage()
    page.setDefaultTimeout(30000)
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/generateur`)
    await preview(page).locator('.phrase-color-block').first().waitFor({ timeout: 120000 })
    await page.evaluate(() => document.fonts.ready)

    const verbs = page.getByRole('group', { name: 'Groupe de verbes', exact: true })
    const forms = page.getByRole('group', { name: 'Forme des phrases', exact: true })
    await verbs.getByRole('button', { name: '2e', exact: true }).click()
    await verbs.locator('button.active').filter({ hasText: /^2e$/ }).waitFor()
    await countInPreview(page, '.phrase-color-block', 4)
    await forms.getByRole('button', { name: 'Négative', exact: true }).click()
    await forms.getByRole('button', { name: 'Négative', exact: true }).and(page.locator('[aria-pressed="true"]')).waitFor()
    for (const block of await preview(page).locator('.phrase-color-block').all()) {
      assert.match(await block.innerText(), /\b(?:ne|n’)\b|n’/)
    }
    for (const category of ['Adverbes', 'Prépositions', 'Conjonctions', 'Adjectifs']) {
      await page.getByRole('group', { name: category, exact: true }).getByRole('button', { name: 'Sans', exact: true }).click()
    }
    assert.ok(await preview(page).locator('.phrase-color-block').count() >= 1)
    await button(page, 'Fiche élève (cliquer pour corrigé)').click()
    const words = await preview(page).locator('.phrase-word-slot').evaluateAll((slots) => slots.map((slot) => ({ word: slot.querySelector('.phrase-word').textContent, color: slot.querySelector('.phrase-pastille').style.backgroundColor })))
    const rgb = (hex) => `rgb(${[1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(', ')})`
    for (const { word, color } of words) {
      for (const category of ['preposition', 'conjonction', 'adjectif']) assert.notEqual(color, rgb(PHRASE_COLORS[category]))
      if (color === rgb(PHRASE_COLORS.adverbe)) assert.ok(['ne', 'n’', 'pas'].includes(word.toLowerCase()))
    }
    await button(page, 'Corrigé (cliquer pour fiche élève)').click()
    for (const category of ['Adverbes', 'Prépositions', 'Conjonctions', 'Adjectifs']) {
      await page.getByRole('group', { name: category, exact: true }).getByRole('button', { name: 'Avec', exact: true }).click()
    }
    await verbs.getByRole('button', { name: 'Mixte', exact: true }).click()
    await forms.getByRole('button', { name: 'Mixte', exact: true }).click()
    await page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true }).fill('4')
    for (const { label } of PHRASE_THEME_DEFS) {
      await select(page, 'Thème', label)
      await page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true }).fill('4')
      await countInPreview(page, '.phrase-color-block', 4)
    }
    await select(page, 'Thème', 'Verbes pronominaux')
    await page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true }).fill('4')
    await countInPreview(page, '.phrase-color-block', 4)
    const before = await preview(page).innerText()
    await button(page, 'Générer').click()
    await page.waitForFunction((before) => document.querySelector('.sheet-stage:not(.print-only-sheets) .worksheet-sheet')?.innerText !== before, before)
    assert.notEqual(await preview(page).innerText(), before, 'A new draw changes the phrases.')

    for (const [index, selector] of ['.phrase-color-block', '.phrase-order-block', '.phrase-build-block', '.phrase-write-block'].entries()) {
      await page.getByLabel(`Page ${index + 1}`, { exact: true }).click()
      await preview(page).locator(selector).first().waitFor()
      await countInPreview(page, selector, 4)
      await button(page, 'Fiche élève (cliquer pour corrigé)').click()
      if (index === 0) assert.ok(await preview(page).locator('.phrase-pastille.filled').count() > 4)
      else assert.equal(await preview(page).locator('.phrase-slot-answer').count(), 4)
      await button(page, 'Corrigé (cliquer pour fiche élève)').click()
    }
    await page.getByLabel('Page 1', { exact: true }).click()
    await preview(page).screenshot({ path: `docs/gattegno/screenshots/fiche-${width}.png` })
    await page.emulateMedia({ media: 'print' })
    const printed = page.locator('.print-only-sheets .worksheet-sheet')
    assert.equal(await printed.count(), 8, 'Four student sheets and their four corrections.')
    const dimensions = await printed.evaluateAll((sheets) => sheets.map((sheet) => ({ width: sheet.getBoundingClientRect().width, height: sheet.getBoundingClientRect().height, overflow: sheet.scrollHeight - sheet.clientHeight })))
    for (const sheet of dimensions) { assert.ok(sheet.width > 790 && sheet.width < 800); assert.ok(sheet.height > 1120 && sheet.height < 1130); assert.ok(sheet.overflow <= 1, JSON.stringify(sheet)) }
    if (width === 1366) {
      const pdf = await page.pdf({ path: 'docs/gattegno/fiches-et-corriges.pdf', preferCSSPageSize: true, printBackground: true })
      assert.equal([...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length, 8)
    }
    results.push({ width, themes: PHRASE_THEME_DEFS.length, formats: 4, secondGroupReflexives: 'usable', categoryFilters: 'whole predicates retained', newDraw: 'different', print: dimensions })
    await context.close()
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/gattegno/browser-results.json', JSON.stringify({ results, errors }, null, 2) + '\n')
  console.log('Gattegno : sept thèmes, quatre formats, verbes pronominaux du deuxième groupe, filtres, nouveau tirage et impression A4 vérifiés sur ordinateur et mobile.')
} finally { await browser.close(); await server.close() }
