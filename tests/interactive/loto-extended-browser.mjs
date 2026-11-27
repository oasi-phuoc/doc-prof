import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { gameControl, waitForBrowserValue } from './browser-actions.mjs'

const base = 'http://127.0.0.1:5182'
const vite = await createServer({ server: { host: '127.0.0.1', port: 5182, strictPort: true, hmr: false } })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
try {
  await vite.listen()
  const { demoRecipe } = await vite.ssrLoadModule('/src/interactive/demo.ts')
  const { defaultPage } = await vite.ssrLoadModule('/src/math/catalog.ts')
  const { defaultThemeGameContent } = await vite.ssrLoadModule('/src/jeux/bank.ts')
  const { convertRecipe } = await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { applyPlanOptions, NEW_PLAN_OPTIONS } = await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const pageConfig = { ...defaultPage('jeux'), ...defaultThemeGameContent('jeux-loto', 'fruits'), domain: 'jeux', topic: 'jeux-fruits', exerciseType: 'jeux-loto', count: 1, columns: 1 }
  pageConfig.gameEntries = pageConfig.gameEntries.slice(0, 27)
  const recipe = { ...demoRecipe(), libreMode: false, pages: [pageConfig] }
  const game = convertRecipe(recipe, 'Loto collectif')
  const plan = applyPlanOptions(game, { ...NEW_PLAN_OPTIONS, loto: 'line', lotoLayout: 'extended' })
  assert.equal(game.questions.length, 27)
  const images = new Set(game.questions.flatMap(q => q.images.map(src => new URL(src, base).href)))
  const imageFixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aE/gAAAAASUVORK5CYII=', 'base64')

  for (const [width, height, mode] of [[1366, 768, 'class'], [390, 844, 'solo']]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(mode => {
      sessionStorage.setItem('clairfle.interactive.mode.v1', mode)
      localStorage.setItem('clairfle.interactive.timer.v1', JSON.stringify({ enabled: false, seconds: 30, feedbackSeconds: 10 }))
    }, mode)
    await context.route(url => images.has(url.href), route => route.fulfill({ contentType: 'image/png', body: imageFixture }))
    const page = await context.newPage()
    page.setDefaultTimeout(30_000)
    await page.goto(base)
    const id = await page.evaluate(async recipe => {
      const { createLocalDraft } = await import('/src/interactive/drafts.ts')
      return createLocalDraft(recipe, 'Loto collectif')
    }, recipe)
    await page.goto(`${base}/interactif?d=${id}`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120_000 })
    await page.getByRole('button', { name: /^Préparer la séance/ }).click()
    const settings = page.getByRole('dialog', { name: 'Préparer la séance', exact: true })
    await settings.getByText('Ordre des questions et préréglages', { exact: true }).click()
    await settings.getByRole('checkbox', { name: 'Loto : grille collective', exact: true }).check()
    assert.equal(await settings.getByRole('combobox', { name: 'Format du Loto' }).inputValue(), 'extended')
    await settings.getByRole('button', { name: 'Fermer · Préparer la séance', exact: true }).click()
    await page.locator('.ci-launch:enabled').click()
    const cards = page.locator('.ci-answer')
    await cards.first().waitFor()
    assert.equal(await cards.count(), 3)
    const overview = page.getByRole('region', { name: 'Suivi du Loto' })
    assert.match(await overview.getByRole('status').innerText(), /0\/25/)
    const viewGrid = overview.getByRole('button', { name: 'Voir la grille' })
    const grid = page.getByRole('dialog', { name: 'Grille de Loto' })
    await viewGrid.click()
    assert.equal(await grid.getByRole('listitem').count(), 25)
    assert.equal(await grid.getByRole('button', { name: /^Cocher/ }).count(), 0)
    assert.equal(await grid.locator('.ci-loto-large-grid').evaluate(element => element.scrollWidth <= element.clientWidth), true)
    await page.keyboard.press('Escape')
    assert.equal(await viewGrid.evaluate(element => document.activeElement === element), true)

    if (mode === 'class') {
      for (const label of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await gameControl(page, label).click()
      assert.match(await overview.getByRole('status').innerText(), /0\/25/)
      await viewGrid.click()
      await grid.getByRole('button', { name: /^Cocher «/ }).click()
      assert.equal(await grid.locator('[data-loto-checked="true"]').count(), 1)
      await page.keyboard.press('Escape')
      await waitForBrowserValue(page, async () => {
        const { requestLocal } = await import('/src/interactive/storage.ts')
        const sessions = await requestLocal('sessions', 'readonly', store => store.getAll())
        return sessions.some(record => record.events.some(event => event.action.type === 'TEACHER_MARK_SET') || Object.keys(record.checkpoint?.state.teacherMarks ?? {}).length)
      })
      await page.reload()
      await page.locator('.ci-launch:enabled').click()
      await overview.getByRole('status').filter({ hasText: '1/25 cases cochées' }).waitFor()
    } else {
      const first = plan.questions[0]
      const correct = first.choices.find(choice => choice.id === plan.corrections[first.id].choiceId)
      await cards.filter({ has: page.getByText(correct.text, { exact: true }) }).click()
      await overview.getByRole('status').filter({ hasText: '1/25 cases cochées' }).waitFor()
    }
    await context.close()
    console.log(`${mode} ${width}×${height} : 25 cases, 3 propositions et comptage validés.`)
  }
} finally {
  await browser.close()
  await vite.close()
}
