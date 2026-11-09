import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { classroomRecipe } from './classroom-fixture.mjs'

const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const output = 'docs/interactive/screenshots'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  headless: true,
  args: ['--no-sandbox'],
})
const recipe = await classroomRecipe()
const results = []
async function openFixture(page) {
  page.setDefaultNavigationTimeout(120000)
  await page.goto(`${base}/interactif/demo`)
  await page
    .getByRole('button', { name: /Commencer la séance/ })
    .waitFor({ timeout: 120000 })
  await page.evaluate((recipe) => {
    history.pushState(
      { clairfleInteractive: { recipe, name: 'Lecture et écoute en classe' } },
      '',
      '/interactif',
    )
    dispatchEvent(new PopStateEvent('popstate'))
  }, recipe)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor()
}
async function fit(page, height) {
  const box = await page.locator('.ci-controls').boundingBox()
  assert.ok(
    box.y + box.height <= height + 2,
    `Controls exceed ${height}: ${JSON.stringify(box)}`,
  )
}
try {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [1280, 800],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: 'reduce',
      hasTouch: true,
    })
    await page
      .context()
      .addCookies([
        { name: 'clairfle-fiche-access', value: 'admin', url: base },
      ])
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await openFixture(page)
    assert.equal(
      await page.locator('.ci-question-list fieldset > label').count(),
      7,
    )
    assert.match(
      await page.locator('.ci-setup-grid').innerText(),
      /3 questions retenues/,
    )
    assert.equal(
      await page
        .getByRole('spinbutton', { name: 'Temps de réflexion (secondes)' })
        .inputValue(),
      '30',
    )
    await page.getByText('Palette de la classe', { exact: true }).click()
    await page
      .getByRole('combobox', { name: 'Forme de la carte A' })
      .selectOption('cross')
    const shapeLabels = await page
      .locator('.ci-palette-card > .ci-card-badge .ci-shape')
      .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')))
    assert.deepEqual(shapeLabels, [
      'Croix',
      'Carré',
      'Triangle',
      'Losange',
      'Étoile',
      'Cercle',
    ])
    await page.screenshot({
      path: `${output}/08-classroom-setup-${width}.png`,
      fullPage: true,
    })
    await page.clock.install({ time: new Date('2026-11-09T12:00:00Z') })
    await page.clock.pauseAt(new Date('2026-11-09T12:01:00Z'))
    await page.getByRole('button', { name: /Commencer la séance/ }).click()
    assert.equal(
      await page
        .getByRole('button', { name: 'Précédente', exact: true })
        .count(),
      0,
    )
    assert.equal(
      await page.getByText(/Aperçu · nouvelle expérience|Version 1/).count(),
      0,
    )
    assert.equal(await page.locator('.ci-context p').isVisible(), true)
    assert.match(
      await page.locator('.ci-context').innerText(),
      /Le marché du quartier/,
    )
    const document = page.locator('.ci-context p')
    const fontBefore = await document.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize),
    )
    await page
      .getByRole('button', { name: 'Agrandir le texte du document' })
      .click()
    assert.equal(
      await document.evaluate((el) =>
        parseFloat(getComputedStyle(el).fontSize),
      ),
      fontBefore + 2,
    )
    assert.equal(await page.locator('.ci-answer-content img').count(), 3)
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.ci-answer-content img')].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    )
    const badge = page.locator('.ci-answer > .ci-card-badge').first()
    assert.equal(
      await badge.locator('.ci-shape').getAttribute('aria-label'),
      'Croix',
    )
    const dimensions = await badge.evaluate((el) => ({
      letter: getComputedStyle(el.querySelector('b')).fontSize,
      shape: getComputedStyle(el.querySelector('svg')).width,
    }))
    assert.equal(dimensions.letter, dimensions.shape)
    const center = await page.locator('.ci-progress').boundingBox()
    assert.ok(Math.abs(center.x + center.width / 2 - width / 2) < 1)
    await page.clock.runFor(1100)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:29')
    await page.getByRole('button', { name: 'Pause', exact: true }).click()
    assert.equal(await page.locator('.ci-answer:visible').count(), 0)
    await page.clock.runFor(10000)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:29')
    await page
      .getByRole('button', { name: 'Reprendre la séance', exact: true })
      .click()
    await page.clock.runFor(1100)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:28')
    await page.clock.runFor(60000)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:00')
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    assert.equal(
      await page.locator('.ci-phase-banner').innerText(),
      'Je réfléchis',
    )
    await fit(page, height)
    await page.screenshot({ path: `${output}/09-reading-${width}.png` })
    await page
      .getByRole('button', { name: 'Signal : levez vos cartes' })
      .click()
    await page.locator('.ci-answer').first().tap()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    await page.getByRole('button', { name: 'Discuter', exact: true }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    await page.getByRole('button', { name: 'Enseignant : révéler' }).click()
    assert.equal(await page.locator('.ci-correction-answer img').count(), 1)
    assert.match(
      await page.locator('.ci-correction-answer img').getAttribute('src'),
      /5-tomates/,
    )
    assert.match(
      await page.locator('.ci-correction-status').innerText(),
      /À retravailler/,
    )
    const good = await page.locator('.ci-correction-card').boundingBox()
    const verdict = await page.locator('.ci-correction-status').boundingBox()
    assert.ok(good.x < verdict.x)
    await page.screenshot({
      path: `${output}/10-image-correction-${width}.png`,
    })
    await page.getByRole('button', { name: 'Question suivante' }).click()
    assert.equal(await page.locator('.ci-dual-session').count(), 1)
    assert.equal(await page.locator('.ci-round-question').count(), 2)
    assert.equal(await page.locator('audio').count(), 1)
    assert.equal(await page.locator('.ci-answer').count(), 6)
    assert.deepEqual(
      await page.locator('.ci-answer > .ci-card-badge b').allTextContents(),
      ['A', 'B', 'C', 'D', 'E', 'F'],
    )
    const audioBox = await page.locator('.ci-audio').boundingBox()
    const questionBox = await page.locator('.ci-round-questions').boundingBox()
    assert.ok(audioBox.y + audioBox.height <= questionBox.y)
    await page.clock.runFor(60000)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:30')
    await page
      .locator('audio')
      .evaluate((audio) => audio.dispatchEvent(new Event('play')))
    await page.clock.runFor(1000)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:30')
    await page
      .locator('audio')
      .evaluate((audio) => audio.dispatchEvent(new Event('ended')))
    await page.clock.runFor(1100)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:29')
    await fit(page, height)
    await page.screenshot({ path: `${output}/11-paired-audio-${width}.png` })
    await page.getByRole('button', { name: 'Régler', exact: true }).click()
    await page
      .getByRole('spinbutton', { name: 'Temps de réflexion (secondes)' })
      .fill('5')
    await page.getByRole('button', { name: 'Régler', exact: true }).click()
    await page.clock.runFor(6000)
    assert.equal(await page.locator('.ci-timer-value').innerText(), '0:00')
    assert.equal(
      await page.locator('.ci-phase-banner').innerText(),
      'Je réfléchis',
    )
    await page
      .getByRole('button', { name: 'Signal : levez vos cartes' })
      .click()
    await page
      .locator('.ci-round-question')
      .nth(0)
      .locator('.ci-answer')
      .nth(1)
      .tap()
    assert.equal(
      await page.getByRole('button', { name: 'Discuter', exact: true }).count(),
      0,
    )
    await page
      .locator('.ci-round-question')
      .nth(1)
      .locator('.ci-answer')
      .nth(0)
      .tap()
    assert.equal(await page.locator('.ci-chosen').count(), 2)
    await page.reload()
    await page.clock.resume()
    await page.getByRole('button', { name: /Reprendre la séance/ }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    assert.equal(await page.locator('.ci-chosen').count(), 0)
    assert.match(
      await page.locator('.ci-progress').innerText(),
      /Questions 2 et 3 \/ 3/,
    )
    await page
      .getByRole('button', { name: 'Signal : levez vos cartes' })
      .click()
    await page
      .locator('.ci-round-question')
      .nth(0)
      .locator('.ci-answer')
      .nth(1)
      .tap()
    await page
      .locator('.ci-round-question')
      .nth(1)
      .locator('.ci-answer')
      .nth(0)
      .tap()
    await page.getByRole('button', { name: 'Discuter', exact: true }).click()
    await page.getByRole('button', { name: 'Enseignant : révéler' }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 2)
    assert.equal(
      await page.getByText('Réponse correcte', { exact: true }).count(),
      1,
    )
    assert.equal(
      await page.getByText('À retravailler', { exact: true }).count(),
      1,
    )
    assert.equal(await page.locator('.ci-correction-answer img').count(), 2)
    await fit(page, height)
    await page.screenshot({
      path: `${output}/12-paired-correction-${width}.png`,
    })
    await page.getByRole('button', { name: 'Voir le bilan' }).click()
    assert.equal(await page.locator('.ci-summary .ci-panel > p').count(), 3)
    assert.equal(
      await page
        .getByText('À retravailler au tableau', { exact: false })
        .count(),
      2,
    )
    assert.deepEqual(errors, [])
    results.push({
      viewport: `${width}x${height}`,
      touch: true,
      timer: 'reflection, audio end, pause, expiry, configuration passed',
      imageVariants: 'passed',
      pairedAudio: '6 source questions → 2 simultaneous questions / 6 cards',
      separateCorrections: 'passed',
      resume: 'reflection without selected answers',
      fit: 'passed',
      errors,
    })
    await page.close()
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  })
  await page
    .context()
    .addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await openFixture(page)
  await page.getByRole('button', { name: /Commencer la séance/ }).click()
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  )
  await page.getByRole('button', { name: 'Contraste', exact: true }).click()
  assert.ok(
    (await page.locator('.ci-app').getAttribute('class')).includes(
      'ci-high-contrast',
    ),
  )
  await page.getByRole('button', { name: 'Passer', exact: true }).click()
  assert.equal(await page.locator('.ci-answer').count(), 6)
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  )
  results.push({
    viewport: '390x844',
    horizontalOverflow: false,
    highContrast: 'passed',
    sixCards: 'passed',
  })
  await page.close()
  await writeFile(
    'docs/interactive/classroom-results.json',
    JSON.stringify(results, null, 2) + '\n',
  )
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
