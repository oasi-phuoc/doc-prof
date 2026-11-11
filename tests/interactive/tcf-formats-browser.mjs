import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5182'
const server = await createServer({ cacheDir: '/tmp/clairfle-tcf-formats-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { buildTpfFamilyTestPages } = await server.ssrLoadModule('/src/tcf/generate.ts')
const template = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const preview = (page) => page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible').first()
async function currentExercise(page, index) { return page.evaluate((index) => window.history.state.clairfleFiche.recipe.pages[index].tcfExercise, index) }
async function marks(sheet) {
  return sheet.locator('.tcf-case.is-filled').evaluateAll((cases) => cases.map((node) => {
    const tick = getComputedStyle(node, '::after')
    return { content: tick.content, borderLeft: parseFloat(tick.borderLeftWidth), borderBottom: parseFloat(tick.borderBottomWidth), color: tick.borderLeftColor }
  }))
}
try {
  await mkdir('docs/tcf/screenshots', { recursive: true })
  for (const [domain, difficulty] of [['tcf-csc', 'facile'], ['tcf-cfr', 'moyen'], ['tpf', 'avance']]) {
    const all = buildTpfFamilyTestPages(domain, 42).filter((config) => config.difficulty === difficulty)
    const pages = all.filter((config) => /^tcf-co-ex-[123]$/.test(config.exerciseType))
      .concat(all.filter((config) => /^tcf-ce-ex-[12]$/.test(config.exerciseType)).map((config) => ({ ...config, tcfQuestionCount: 3 })))
    assert.equal(pages.length, domain === 'tpf' ? 3 : 5)
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript((fiche) => {
      if (location.pathname === '/generateur') history.replaceState({ clairfleFiche: fiche }, '', location.href)
    }, { id: `tcf-formats-${domain}`, name: 'Formats TCF', recipe: { ...template, pages, seed: 42, evalMode: true, libreMode: false, libreSnapshot: null } })
    const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/generateur`)
    await preview(page).getByRole('group', { name: 'Forme de réponse', exact: true }).first().waitFor({ timeout: 120000 })
    let imageSwitches = 0
    for (const index of [0, 1, 2]) {
      if (index) await page.getByLabel(`Page ${index + 1}`, { exact: true }).click()
      const sheet = preview(page), groups = sheet.getByRole('group', { name: 'Forme de réponse', exact: true })
      const count = await groups.count(); assert.equal(count, index === 2 ? 5 : 6)
      assert.equal(await groups.getByRole('button').count(), count * 3)
      const source = await currentExercise(page, index)
      assert.ok(source, 'The fixture uses an assembled exercise, the previously hidden path.')
      const prompts = await sheet.locator('.tcf-enonce').allTextContents()
      const first = groups.first()
      await first.getByRole('button', { name: 'Forme Phrase', exact: true }).click()
      await first.locator('[aria-label="Forme Phrase"][aria-pressed="true"]').waitFor()
      assert.equal(await sheet.locator('.tcf-qcm-texte').count(), count - 1)
      await first.getByRole('button', { name: 'Forme Texte', exact: true }).click()
      await first.locator('[aria-label="Forme Texte"][aria-pressed="true"]').waitFor()
      const imageButton = groups.getByRole('button', { name: 'Forme Image', exact: true }).first()
      if (await imageButton.count()) {
        await imageButton.click()
        await sheet.locator('.tcf-qcm-images').first().waitFor()
        imageSwitches++
        const group = groups.filter({ has: page.locator('[aria-label="Forme Image"][aria-pressed="true"]') }).first()
        await group.getByRole('button', { name: 'Forme Texte', exact: true }).click()
      }
      assert.deepEqual(await currentExercise(page, index), source, 'Changing a format preserves the source questions, variants, scoring and audio.')
      assert.deepEqual(await sheet.locator('.tcf-enonce').allTextContents(), prompts)
      if (domain === 'tcf-csc' && index === 0) await sheet.screenshot({ path: 'docs/tcf/screenshots/co-formats.png' })
      if (domain === 'tcf-csc' && index === 1) await sheet.screenshot({ path: 'docs/tcf/screenshots/co-cadres.png' })
    }
    if (domain !== 'tpf') assert.ok(imageSwitches > 0, 'Real source image variants are exercised.')
    for (const index of pages.map((_, index) => index).slice(3)) {
      await page.getByLabel(`Page ${index + 1}`, { exact: true }).click()
      const sheet = preview(page), questions = sheet.locator('.tcf-qcm-texte, .tcf-qcm-images')
      const count = await questions.count(); assert.ok(count > 0)
      assert.equal(await sheet.locator('.tcf-case.is-filled').count(), 0, 'Student copies contain no correction marks.')
      const choices = await questions.allTextContents()
      await button(page, 'Fiche élève (cliquer pour corrigé)').click()
      assert.equal(await sheet.locator('.tcf-case.is-filled').count(), count)
      for (const question of await questions.all()) assert.equal(await question.locator('.is-correct .tcf-case.is-filled').count(), 1)
      assert.deepEqual(await questions.allTextContents(), choices, 'The same shuffled choices appear in the correction.')
      for (const tick of await marks(sheet)) { assert.equal(tick.content, '""'); assert.ok(tick.borderLeft > 0 && tick.borderBottom > 0); assert.notEqual(tick.color, 'rgba(0, 0, 0, 0)') }
      await page.emulateMedia({ media: 'print' })
      const printed = page.locator('.print-only-sheets .worksheet-sheet')
      const corrected = printed.filter({ has: page.locator('.tcf-case.is-filled') })
      assert.ok(await corrected.count() >= 2)
      for (const tick of await marks(corrected)) assert.ok(tick.borderLeft > 0 && tick.borderBottom > 0, 'Correction is drawn with printable borders, independent of background graphics.')
      assert.equal(await printed.getByRole('group', { name: 'Forme de réponse', exact: true }).count(), 0)
      if (domain === 'tcf-csc' && index === 4) {
        // Keep the CE document and all three questions on each of the two proof pages.
        const student = printed.filter({ has: page.locator('.tcf-qcm-texte, .tcf-qcm-images') }).filter({ hasNot: page.locator('.tcf-case.is-filled') }).last()
        const answer = corrected.last()
        await student.evaluate((node) => node.classList.add('tcf-proof'))
        await answer.evaluate((node) => node.classList.add('tcf-proof'))
        const style = await page.addStyleTag({ content: '@media print { .print-only-sheets > :not(.tcf-proof) { display:none!important } }' })
        const pdf = await page.pdf({ path: 'docs/tcf/corriges-ce-sans-arriere-plan.pdf', preferCSSPageSize: true, printBackground: false })
        assert.equal([...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length, 2)
        await style.evaluate((node) => node.remove())
      }
      await page.emulateMedia({ media: 'screen' })
      if (domain === 'tcf-csc' && index === 4) await sheet.screenshot({ path: 'docs/tcf/screenshots/ce-corrige.png' })
      await button(page, 'Corrigé (cliquer pour fiche élève)').click()
      assert.equal(await sheet.locator('.tcf-case.is-filled').count(), 0)
    }
    results.push({ domain, level: difficulty, co: 'three format buttons for each of 17 questions, including multi-question audio frames; Text / Image / Sentence switching preserves questions, variants, points and recordings', imageSwitches, ce: pages.length > 3 ? 'checkbox corrections on both reading exercises; empty student copies; stable shuffled answers; printable check strokes without background graphics' : 'no CE bank entries at this level; CE covered by CSC and CFR cases' })
    await context.close()
    console.log(`TCF : formats CO et corrigés CE vérifiés pour ${domain}.`)
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/tcf/formats-results.json', JSON.stringify({ results, errors }, null, 2) + '\n')
} finally { await browser.close(); await server.close() }
