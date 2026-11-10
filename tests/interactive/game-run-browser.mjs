import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

// A local HTTP fixture exercises the real saved-fiche client without server writes.
const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-game-run-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], count: 10, numberLibre: true, numberMin: 1, numberMax: 10, numberDecimals: false }]
delete recipe.pages[0].libreItems
recipe.libreMode = false
const original = structuredClone(recipe)
const saved = { id: 'generated-addition-template', name: 'Dix additions entre 1 et 10', domains: ['algèbre'], recipe, createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-10T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true })
  page.setDefaultTimeout(30000)
  const errors = []
  const methods = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'interactive-test-only'))
  await page.route('**/__test_api/fiches', async (route) => {
    methods.push(route.request().method())
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) })
  })
  const prompts = () => page.locator('.ci-question-list fieldset > label b').allTextContents()
  const validAdditions = (values) => {
    assert.equal(values.length, 10)
    for (const value of values) {
      const operands = [...value.replace(/^\d+\.\s*/, '').matchAll(/\d+/g)].map((match) => Number(match[0]))
      assert.equal(operands.length, 2)
      assert.ok(operands.every((n) => n >= 1 && n <= 10), value)
    }
  }
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const first = await prompts()
  validAdditions(first)
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('20')
  await page.getByRole('button', { name: 'Régler le minuteur', exact: true }).click()
  await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('7')
  await page.getByRole('button', { name: 'Fermer les réglages', exact: true }).click()
  await page.locator('.ci-launch').click()
  await page.locator('.ci-controls').waitFor()
  for (let question = 1; question <= 10; question++) {
    await page.locator('.ci-progress').filter({ hasText: `Question ${question} / 10` }).waitFor()
    await page.getByRole('button', { name: 'Passer', exact: true }).click()
  }
  await page.locator('.ci-summary').waitFor()
  await page.getByRole('button', { name: 'Nouvelle partie', exact: true }).click()
  await page.locator('.ci-progress').filter({ hasText: 'Question 1 / 10' }).waitFor()
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const second = await prompts()
  validAdditions(second)
  assert.notDeepEqual(second, first)
  assert.equal(await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).inputValue(), '20')
  const selection = page.locator('.ci-question-list fieldset > label input')
  await selection.first().uncheck()
  await page.reload()
  await page.locator('.ci-launch:enabled').waitFor()
  assert.deepEqual(await prompts(), second)
  assert.equal(await selection.first().isChecked(), false)
  await selection.first().check()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  await page.getByRole('button', { name: /Reprendre la séance/ }).click()
  await page.locator('.ci-progress').filter({ hasText: 'Question 1 / 10' }).waitFor()
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: 'Nouvelle partie', exact: true }).click()
  await page.locator('.ci-progress').filter({ hasText: 'Question 1 / 10' }).waitFor()
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const third = await prompts()
  validAdditions(third)
  assert.notDeepEqual(third, second)
  await page.getByRole('button', { name: 'Régler le minuteur', exact: true }).click()
  assert.equal(await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).inputValue(), '7')
  await page.getByRole('button', { name: 'Fermer les réglages', exact: true }).click()
  assert.ok(methods.length >= 2)
  assert.ok(methods.every((method) => method === 'GET'))
  assert.deepEqual(recipe, original)
  assert.deepEqual(errors, [])
  results.push({ template: 'saved server recipe fetched read-only', newGames: 'three different sets of ten additions, operands 1–10', resume: 'same questions and selection after reload', timing: '20 s reflection and 7 s feedback retained', serverWrites: 0, errors })
  await writeFile('docs/interactive/game-run-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
