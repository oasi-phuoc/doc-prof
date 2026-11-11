import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
async function settings(page) { return page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('settings', 'readonly', (store) => store.get('classroom'))).settings }) }
try {
  for (const [width, height] of [[390, 844], [1366, 768]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    page.on('pageerror', (error) => errors.push(error.message))
    await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await page.goto(`${base}/interactif/cartes`)
    await page.getByRole('heading', { name: 'Cartes de la classe', exact: true }).waitFor({ timeout: 120000 })
    assert.equal(await page.locator('.ci-calibration-picks button').count(), 6)
    assert.equal(await button(page, 'Enregistrer la comparaison').isDisabled(), true)
    await page.getByLabel('Couleur de la carte A', { exact: true }).fill('#111111')
    await page.waitForFunction(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('settings', 'readonly', (store) => store.get('classroom'))).settings.paletteVersion === 2 })
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.ci-calibration-swatch')).backgroundColor === 'rgb(17, 17, 17)')
    assert.equal(await page.locator('.ci-calibration-swatch').evaluate((element) => getComputedStyle(element).color), 'rgb(255, 255, 255)')
    await page.getByRole('checkbox', { name: 'J’ai comparé les six cartes avec cet écran.', exact: true }).check()
    await button(page, 'Enregistrer la comparaison').click()
    await page.getByRole('status').filter({ hasText: 'Comparaison des six cartes enregistrée' }).waitFor()
    const confirmed = await settings(page)
    assert.equal(confirmed.calibration.paletteVersion, 2)
    assert.ok(confirmed.calibration.paletteHash.startsWith('palette-'))
    await page.reload()
    await page.getByText(/^Comparaison confirmée le/).waitFor()
    assert.equal(await page.getByLabel('Couleur de la carte A', { exact: true }).inputValue(), '#111111')
    await page.getByLabel('Forme de la carte A', { exact: true }).selectOption('star')
    await page.getByText('La palette a changé : comparez à nouveau vos cartes.', { exact: true }).waitFor()
    const changed = await settings(page)
    assert.equal(changed.paletteVersion, 3)
    assert.equal(changed.shapes[0], 'star')
    assert.equal(changed.shapes[4], 'circle')
    const concurrent = await page.evaluate(async () => {
      const { readClassroomPreferences, patchClassroomPreferences } = await import('/src/interactive/preferences.ts')
      const { paletteFingerprint } = await import('/src/interactive/domain/calibration.ts')
      const { requestLocal } = await import('/src/interactive/storage.ts')
      const initial = (await requestLocal('settings', 'readonly', (store) => store.get('classroom'))).settings
      const stale = await readClassroomPreferences(initial)
      await patchClassroomPreferences({ colors: stale.colors.map((color, index) => index === 1 ? '#222222' : color) }, initial)
      let error = ''
      try { await patchClassroomPreferences({ calibration: { paletteVersion: stale.paletteVersion, paletteHash: paletteFingerprint(stale.colors, stale.shapes), confirmedAt: Date.now() } }, initial) } catch (reason) { error = reason.message }
      return { error, after: await readClassroomPreferences(initial) }
    })
    assert.match(concurrent.error, /autre onglet/)
    assert.equal(concurrent.after.paletteVersion, 4)
    assert.deepEqual(concurrent.after.calibration, confirmed.calibration)
    await button(page, 'Recharger la palette').click()
    await button(page, 'Comparer la carte B').click()
    assert.equal(await page.getByLabel('Couleur de la carte B', { exact: true }).inputValue(), '#222222')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.screenshot({ path: `docs/interactive/screenshots/calibration-${width}.png`, fullPage: true })

    await page.getByRole('checkbox', { name: 'Économiser l’encre', exact: true }).check()
    await page.getByRole('spinbutton', { name: 'Jeux de cartes', exact: true }).fill('2')
    await page.emulateMedia({ media: 'print' })
    const print = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.ci-card-sheet:first-child .ci-paper-card')]
      return { rects: cards.map((card) => { const rect = card.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }), patterns: cards.map((card) => getComputedStyle(card).backgroundImage), inks: cards.map((card) => getComputedStyle(card.querySelector('.ci-card-badge')).color), captions: cards.map((card) => card.querySelector('small').textContent) }
    })
    assert.equal(print.rects.length, 6)
    assert.equal(new Set(print.rects.map((rect) => Math.round(rect.x))).size, 2)
    assert.equal(new Set(print.rects.map((rect) => Math.round(rect.y))).size, 3)
    assert.ok(print.rects.every((rect) => Math.abs(rect.width - rect.height) < 1 && Math.abs(rect.width / (96 / 25.4) - 88) < .1))
    assert.equal(new Set(print.patterns).size, 6)
    assert.ok(print.inks.every((color) => color === 'rgb(0, 0, 0)'))
    assert.ok(print.captions.every((caption) => caption.includes('palette 4')))
    const pdf = await page.pdf({ format: 'A4', printBackground: true })
    assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length, 2)
    await writeFile(`/tmp/clairfle-calibration-${width}.pdf`, pdf)
    await page.emulateMedia({ media: 'screen' })
    await page.goto(`${base}/interactif/demo`)
    await page.locator('.ci-launch:enabled').waitFor()
    await page.getByLabel('Nom du préréglage', { exact: true }).fill('Palette réutilisée')
    await button(page, 'Enregistrer le préréglage').click()
    await page.getByRole('status').filter({ hasText: 'Préréglage enregistré' }).waitFor()
    const presetVersion = await page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('presets-local', 'readonly', (store) => store.getAll()))[0].paletteVersion })
    assert.equal(presetVersion, 4)
    await button(page, 'Mode de jeu').click()
    await page.locator('.ci-launch').click()
    const answer = page.locator('.ci-answer').first()
    await page.keyboard.press('Tab')
    await answer.focus()
    const outline = await answer.evaluate((element) => { const style = getComputedStyle(element); return { border: style.borderTopColor, width: style.borderTopWidth, outline: style.outlineColor, shadow: style.boxShadow } })
    assert.equal(outline.border, 'rgb(24, 34, 56)')
    assert.equal(outline.width, '3px')
    assert.equal(outline.outline, 'rgb(24, 34, 56)')
    assert.ok(outline.shadow.includes('rgb(255, 255, 255)'))
    results.push({ viewport: `${width}x${height}`, directRoute: 'six cards and visual-comparison workflow load without requiring a worksheet', preferences: 'color, distinct shape swap, confirmation and version persist; palette edits invalidate the confirmation', concurrency: 'a stale comparison cannot be confirmed after another palette change', print: 'two A4 sheets, six 88 mm squares per sheet in two columns and three rows; six distinct monochrome patterns, readable marks and current palette version', playing: 'neutral border and two-layer focus remain visible', layout: 'no horizontal overflow' })
    await page.close()
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/interactive/calibration-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
