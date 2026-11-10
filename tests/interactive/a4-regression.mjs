import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const recipe = JSON.parse(
  await readFile('docs/interactive/demo-source-recipe.json', 'utf8'),
)
recipe.pages = recipe.pages.slice(0, 2)
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  headless: true,
  args: ['--no-sandbox'],
})
const captures = [],
  dimensions = []
try {
  for (const [label, base] of [
    ['baseline', process.env.A4_BASELINE_URL ?? 'http://127.0.0.1:5181'],
    ['prototype', process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 1000 },
    })
    page.setDefaultNavigationTimeout(120000)
    await page
      .context()
      .addCookies([
        { name: 'clairfle-fiche-access', value: 'admin', url: base },
      ])
    // Load interactive CSS first on the new version: it must not affect a subsequent worksheet.
    await page.goto(
      `${base}${label === 'prototype' ? '/interactif/demo' : '/'}`,
    )
    if (label === 'prototype')
      await page
        .getByRole('button', { name: /Commencer la séance/ })
        .waitFor({ timeout: 120000 })
    else await page.locator('.landing-page').waitFor({ timeout: 120000 })
    await page.evaluate((recipe) => {
      history.pushState(
        {
          clairfleFiche: {
            id: 'a4-regression-fixture',
            name: 'A4 regression fixture',
            recipe,
          },
        },
        '',
        '/generateur',
      )
      window.dispatchEvent(new PopStateEvent('popstate'))
    }, recipe)
    const frame = page.locator('.a4-frame').first()
    await frame.waitFor({ timeout: 120000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)
    const sheet = frame.locator('.worksheet-sheet').first()
    await sheet.locator('img').evaluateAll(async (images) => {
      await Promise.all(images.map((image) => image.decode()))
    })
    dimensions.push(
      await sheet.evaluate((el) => ({
        width: getComputedStyle(el).width,
        height: getComputedStyle(el).height,
        overflow: getComputedStyle(el).overflow,
      })),
    )
    captures.push(
      await frame.screenshot({
        path: `docs/interactive/screenshots/a4-${label}.png`,
        animations: 'disabled',
      }),
    )
    // Draft launch is an actual generator action, preserving the working recipe.
    if (label === 'prototype') {
      await page.getByRole('button', { name: 'Jouer avec la classe' }).click()
      await page.waitForURL('**/interactif')
      await page.getByRole('button', { name: /Commencer la séance/ }).waitFor()
      assert.equal(
        await page.locator('.ci-question-list fieldset > label').count(),
        3,
      )
      const staged = await page.evaluate(
        () => history.state.clairfleInteractive.recipe,
      )
      assert.equal(staged.seed, recipe.seed)
      assert.deepEqual(
        staged.pages.map((p) => p.libreItems),
        recipe.pages.map((p) => p.libreItems),
      )
    }
    await page.close()
  }
  assert.deepEqual(dimensions[1], dimensions[0])
  assert.ok(
    captures[0].equals(captures[1]),
    'A4 screenshot differs from baseline',
  )
  await writeFile(
    'docs/interactive/a4-results.json',
    JSON.stringify(
      {
        identicalScreenshot: true,
        dimensions,
        draftLaunch: 'passed',
        baseline: '726a9ec5 (main before media and Word changes)',
        viewport: '1366x1000',
      },
      null,
      2,
    ) + '\n',
  )
  console.log('A4 screenshot identical; draft launch preserved recipe.')
} finally {
  await browser.close()
}
