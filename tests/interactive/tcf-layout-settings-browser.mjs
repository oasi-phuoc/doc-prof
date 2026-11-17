import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { gameControl } from './browser-actions.mjs'

const base = 'http://127.0.0.1:5196'
const server = await createServer({ cacheDir: '/tmp/tcf-layout-browser-vite', server: { host: '127.0.0.1', port: 5196, strictPort: true },
  define: { 'import.meta.env.VITE_FICHES_API_URL': JSON.stringify('/__test_api') } })
await server.listen()
let browser
const results = [], errors = []
try {
  const { tcfSlotBank } = await server.ssrLoadModule('/src/tcf/loader.ts')
  const { tcfSlotByTypeId } = await server.ssrLoadModule('/src/tcf/catalog.ts')
  const template = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
  for (const [domain, level, difficulty, width] of [
    ['tcf-csc', 'A0-A1', 'facile', 1440], ['tcf-cfr', 'A1-A2', 'moyen', 1440],
    ['tpf', 'A1-A2', 'moyen', 1440], ['tcf-csc', 'A0-A1', 'facile', 390],
  ]) {
    console.log(`Checking ${domain} at ${width}px`)
    const ce = tcfSlotBank(level, tcfSlotByTypeId['tcf-ce-ex-4']).filter(ex => ex.questions.length > 5)
      .sort((a, b) => JSON.stringify(a.support).length - JSON.stringify(b.support).length)[0]
    assert(ce)
    const bank = JSON.parse(await readFile(`src/tcf/content/${level === 'A0-A1' ? 'a0-a1' : 'a1-a2'}/co.json`, 'utf8'))
    const source = bank.find(ex => ex.type_exercice === 'complet' && ex.questions.length >= 5 && (ex.support.audios?.length ?? 0) <= 1 && Boolean(ex.support.audio || ex.support.audios?.[0]))
    assert(source)
    const audio = { ...source, questions: source.questions.slice(0, 5) }
    const config = { domain, difficulty, count: 1, columns: 1 }
    const recipe = { ...template, institutional: { ...template.institutional, course: 'Français' }, sheetFont: 'arial', evalMode: true,
      pages: [{ ...config, topic: 'tcf-ce', exerciseType: 'tcf-ce-ex-4', tcfBankId: ce.id, tcfAudioPickMode: 'libre' },
        { ...config, topic: 'tcf-co', exerciseType: 'tcf-co-ex-3', tcfExercise: audio, tcfPageBreakAfter: [true] }] }
    const fixture = { id: `layout-${domain}-${width}`, name: 'Réglages TCF', recipe }
    const context = await browser.newContext({ viewport: { width, height: 1100 } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(fiche => {
      localStorage.setItem('clairfle-fiche-sync', 'layout-test-only')
      if (location.pathname === '/generateur' && !history.state?.clairfleFiche) history.replaceState({ clairfleFiche: fiche }, '', location.href)
    }, fixture)
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    let saved
    await page.route('**/__test_api/fiches/**', async route => {
      assert.equal(route.request().method(), 'PUT')
      const body = route.request().postDataJSON()
      saved = { ...fixture, ...body, domains: [domain], createdAt: '2026-11-17T00:00:00Z', updatedAt: '2026-11-17T00:00:00Z' }
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ fiche: saved }) })
    })
    await page.goto(base + '/generateur')
    const sheets = page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible')
    await sheets.locator('.tcf-ce-doc').first().waitFor({ timeout: 120000 })
    const border = await sheets.locator('.tcf-sms-bubble,.tcf-email,.tcf-annonce,.tcf-assoc-doc').first().evaluate(el => {
      const probe = document.createElement('span'); probe.style.color = 'var(--purple)'; el.append(probe)
      const result = { border: getComputedStyle(el).borderTopColor, theme: getComputedStyle(probe).color }; probe.remove(); return result
    })
    assert.equal(border.border, border.theme)
    const ceFont = page.getByRole('combobox', { name: 'Police du texte CE', exact: true })
    await ceFont.waitFor()
    assert.equal(await ceFont.locator('option').count(), 4)
    const count = page.getByRole('spinbutton', { name: 'Nombre de questions CE', exact: true })
    assert.equal(await count.inputValue(), '5')
    assert.equal(await sheets.locator('.tcf-question').count(), 5)
    await count.fill(String(ce.questions.length))
    await page.waitForFunction(expected => [...document.querySelectorAll('.sheet-stage:not(.print-only-sheets) .tcf-question')].filter(e => e.getClientRects().length).length === expected, ce.questions.length)
    await count.fill('5')
    await page.waitForFunction(() => [...document.querySelectorAll('.sheet-stage:not(.print-only-sheets) .tcf-question')].filter(e => e.getClientRects().length).length === 5)
    await page.getByRole('button', { name: 'Paramètres', exact: true }).click()
    const globalFont = page.getByRole('combobox', { name: 'Police de la fiche', exact: true })
    assert.equal(await globalFont.locator('option').count(), 2)
    await globalFont.selectOption('gothic')
    await page.locator('.theme-color-swatch').nth(1).click()
    await page.keyboard.press('Escape')
    for (const [font, family] of [['arial', 'DM Sans'], ['gothic', 'Didact Gothic'], ['marelle', 'Calli Marelle'], ['playwrite', 'Calli Playwrite']]) {
      await ceFont.selectOption(font)
      await page.evaluate(async family => { await document.fonts.load(`16px "${family}"`); await document.fonts.ready }, family)
      assert.match(await sheets.locator('.tcf-ce-doc .tcf-text').first().evaluate(el => getComputedStyle(el).fontFamily), new RegExp(family))
      assert.match(await sheets.locator('.exercise-heading h3').first().evaluate(el => getComputedStyle(el).fontFamily), /Didact Gothic/)
      assert.match(await sheets.locator('.tcf-enonce-text').first().evaluate(el => getComputedStyle(el).fontFamily), /Didact Gothic/)
    }
    await page.getByRole('button', { name: 'Paramètres', exact: true }).click()
    await globalFont.selectOption('arial')
    await page.keyboard.press('Escape')
    assert.match(await sheets.locator('.tcf-ce-doc .tcf-text').first().evaluate(el => getComputedStyle(el).fontFamily), /Calli Playwrite/)
    assert.match(await sheets.locator('.tcf-enonce-text').first().evaluate(el => getComputedStyle(el).fontFamily), /DM Sans/)
    const themedBorder = await sheets.locator('.tcf-sms-bubble,.tcf-email,.tcf-annonce,.tcf-assoc-doc').first().evaluate(el => {
      const probe = document.createElement('span'); probe.style.color = 'var(--purple)'; el.append(probe)
      const result = { border: getComputedStyle(el).borderTopColor, theme: getComputedStyle(probe).color }; probe.remove(); return result
    })
    assert.equal(themedBorder.border, themedBorder.theme)
    assert.notEqual(themedBorder.border, border.border)
    await sheets.locator('.exercise-item').filter({ has: page.locator('.tcf-question') }).nth(1).getByRole('button', { name: 'Passer cette question et les suivantes sur une nouvelle page', exact: true }).click()
    await page.waitForFunction(() => document.querySelectorAll('.sheet-stage.is-page-stack .worksheet-sheet').length === 2)
    assert.equal(await sheets.locator('.tcf-question').count(), 5)
    console.log(`Fonts and CE frame verified for ${domain} at ${width}px`)
    await sheets.first().screenshot({ path: `/tmp/tcf-ce-font-${domain}-${width}.png`, animations: 'disabled' })
    await page.getByRole('button', { name: 'Page 2', exact: true }).click()
    const question = index => sheets.locator(`[data-tcf-question-index="${index}"]`)
    await question(3).waitFor()
    await sheets.locator('.exercise-item').filter({ has: page.locator('.tcf-audio-cadre-q') }).getByRole('button', { name: 'Remettre cette question et les suivantes sur la page précédente', exact: true }).click()
    await page.waitForFunction(() => [...document.querySelectorAll('.sheet-stage:not(.print-only-sheets) .worksheet-sheet')].filter(el => el.getClientRects().length).length === 1)

    const original = await sheets.locator('.tcf-audio-cadre-q').evaluateAll(elements => elements.map(el => el.textContent))
    await question(3).getByRole('button', { name: /Saut de page/ }).click()
    await page.waitForFunction(() => document.querySelectorAll('.sheet-stage.is-page-stack .worksheet-sheet').length === 2)
    await question(5).getByRole('button', { name: /Saut de page/ }).click()
    await page.waitForFunction(() => document.querySelectorAll('.sheet-stage.is-page-stack .worksheet-sheet').length === 3)
    assert.deepEqual(await sheets.evaluateAll(elements => elements.map(el => [...el.querySelectorAll('.tcf-audio-cadre-q')].map(q => Number(q.dataset.tcfQuestionIndex)))), [[1, 2], [3, 4], [5]])
    await question(3).getByRole('button', { name: /Saut de page/ }).click()
    await page.waitForFunction(() => document.querySelectorAll('.sheet-stage.is-page-stack .worksheet-sheet').length === 2)
    await question(3).getByRole('button', { name: /Saut de page/ }).click()
    await page.waitForFunction(() => document.querySelectorAll('.sheet-stage.is-page-stack .worksheet-sheet').length === 3)
    assert.deepEqual(await sheets.locator('.tcf-audio-cadre-q').evaluateAll(elements => elements.map(el => el.textContent)), original)
    await gameControl(page, 'Fiche élève (cliquer pour corrigé)').click()
    assert.equal(await sheets.locator('.tcf-audio-cadre-q').count(), 5)
    await gameControl(page, 'Corrigé (cliquer pour fiche élève)').click()
    await sheets.nth(1).screenshot({ path: `/tmp/tcf-audio-cut-${domain}-${width}.png`, animations: 'disabled' })
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await page.getByRole('dialog', { name: 'Enregistrer la fiche' }).getByRole('button', { name: 'Mettre à jour', exact: true }).click()
    await page.getByRole('dialog', { name: 'Enregistrer la fiche' }).waitFor({ state: 'hidden' })
    assert.equal(saved.recipe.sheetFont, 'arial')
    assert.equal(saved.recipe.pages[0].tcfCeTextFont, 'playwrite')
    assert.equal(saved.recipe.pages[0].tcfQuestionCount, 5)
    assert.deepEqual(saved.recipe.pages[1].tcfQuestionPageBreakBefore, [3, 5])
    assert.deepEqual(saved.recipe.pages[1].tcfExercise, audio)
    await page.reload()
    await sheets.locator('.tcf-ce-doc').first().waitFor({ timeout: 120000 })
    assert.equal(await ceFont.inputValue(), 'playwrite')
    await page.getByRole('button', { name: 'Page 2', exact: true }).click()
    await page.waitForFunction(() => document.querySelectorAll('.sheet-stage.is-page-stack .worksheet-sheet').length === 3)
    await page.emulateMedia({ media: 'print' })
    const printed = page.locator('.print-only-sheets .worksheet-sheet')
    assert.equal(await printed.locator('.tcf-audio-cadre-q').count(), 10)
    assert.equal(await printed.getByRole('button', { name: /Saut de page/, includeHidden: false }).count(), 0)
    const footerClashes = await printed.locator('.tcf-question').evaluateAll(elements => elements.filter(el => {
      const footer = el.closest('.worksheet-sheet')?.querySelector('.doc-footer')
      return footer && el.getBoundingClientRect().bottom > footer.getBoundingClientRect().top + 2
    }).map(el => el.textContent))
    assert.deepEqual(footerClashes, [])

    await page.emulateMedia({ media: 'screen' })
    results.push({ domain, width, ce_default: 5, ce_expanded: ce.questions.length, ce_saved: 5, ce_manual_pages: 2, no_printed_footer_overlap: true, ce_fonts: 4, sheet_fonts: 2, independent_fonts: true, ce_frame_uses_theme: true,
      question_groups: [[1, 2], [3, 4], [5]], undo_and_restore: true, legacy_frame_cut_undo: true, saved_and_reopened: true, printed_student_and_correction: true })
    await context.close()
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/tcf/reglages-mise-en-page-20261117-browser.json', JSON.stringify({ date: '2026-11-17', results, errors }, null, 2) + '\n')
  console.log(JSON.stringify({ cases: results.length, errors }))
} finally { await browser?.close(); await server.close() }
