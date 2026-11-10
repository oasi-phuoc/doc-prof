import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const source = JSON.parse(
  await readFile('docs/interactive/demo-source-recipe.json', 'utf8'),
)
const fixture = JSON.parse(
  await readFile('docs/interactive/demo-fixture.json', 'utf8'),
)
const image = await readFile('public/lib/images/tcf/co/objets/5-tomates.webp')
const audio = await readFile(
  `public${fixture.questions.find((q) => q.audio).audio}`,
)
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  headless: true,
  args: ['--no-sandbox'],
})
const results = []
function recipe(media = '/__media_missing.webp') {
  return {
    ...source,
    pages: [
      {
        ...source.pages[0],
        libreItems: [
          {
            layout: 'inline',
            a: 2,
            b: 3,
            op: '+',
            missing: 'result',
            answer: '5',
          },
          ...['Première question illustrée', 'Deuxième question illustrée'].map(
            (prompt) => ({
              layout: 'select',
              prompt,
              answer: 'un',
              options: ['un', 'deux'],
              optionImages: [
                media,
                '/lib/images/tcf/co/objets/10-tomates.webp',
              ],
              audioSrc: '/__media_audio.mp3',
            }),
          ),
        ],
      },
    ],
  }
}
async function stage(page, value) {
  await page.evaluate((recipe) => {
    history.pushState(
      { clairfleInteractive: { recipe, name: 'Contrôle des médias' } },
      '',
      '/interactif',
    )
    dispatchEvent(new PopStateEvent('popstate'))
  }, value)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor()
}
async function ready(page) {
  await page.waitForFunction(
    () =>
      document.querySelector('.ci-media-check')?.getAttribute('aria-busy') ===
      'false',
  )
}
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  page.setDefaultNavigationTimeout(120000)
  await page
    .context()
    .addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  const errors = [],
    probes = new Map()
  page.on('pageerror', (error) => errors.push(error.message))
  let missing = true,
    hold = true,
    release
  const barrier = new Promise((resolve) => {
    release = resolve
  })
  let releasePending
  const pendingBarrier = new Promise((resolve) => {
    releasePending = resolve
  })
  await page.route('**/__media_*', async (route) => {
    const url = new URL(route.request().url())
    if (route.request().headers().range === 'bytes=0-0')
      probes.set(url.pathname, (probes.get(url.pathname) ?? 0) + 1)
    if (url.pathname === '/__media_audio.mp3')
      return route.fulfill({
        status: 200,
        contentType: 'audio/mpeg',
        body: audio,
      })
    if (url.pathname === '/__media_html.webp')
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html>Not an image</html>',
      })
    if (url.pathname === '/__media_pending.webp') {
      await pendingBarrier
      return route.fulfill({ status: 404, body: '' }).catch(() => {})
    }
    if (hold) await barrier
    await route
      .fulfill(
        missing
          ? { status: 404, body: '' }
          : { status: 200, contentType: 'image/webp', body: image },
      )
      .catch(() => {})
  })
  await page.goto(`${base}/interactif/demo`)
  await page
    .getByRole('button', { name: /Commencer la séance/ })
    .waitFor({ timeout: 120000 })
  await stage(page, recipe())
  const launch = page.getByRole('button', { name: /Commencer la séance/ })
  assert.equal(await launch.isDisabled(), true)
  hold = false
  release()
  await ready(page)
  assert.equal(
    await page.locator('.ci-media-check-list [data-status="missing"]').count(),
    1,
  )
  assert.equal(
    await page
      .locator('.ci-question-list fieldset > label input:checked')
      .count(),
    3,
  )
  assert.match(
    await page.locator('.ci-setup-grid').innerText(),
    /1 question retenue/,
  )
  await page.locator('.ci-launch:enabled').waitFor()
  assert.equal(await launch.isEnabled(), true)
  assert.equal(probes.get('/__media_missing.webp'), 1)
  assert.equal(probes.get('/__media_audio.mp3'), 1)
  await page.screenshot({
    path: 'docs/interactive/screenshots/13-media-missing.png',
    fullPage: true,
  })
  results.push({
    missing:
      'shared image checked once; both affected questions excluded without clearing selection',
  })

  missing = false
  await page.getByRole('button', { name: 'Réessayer la vérification' }).click()
  await ready(page)
  assert.equal(
    await page.locator('.ci-media-check-list [data-status="missing"]').count(),
    0,
  )
  assert.match(
    await page.locator('.ci-setup-grid').innerText(),
    /3 questions retenues/,
  )
  assert.equal(probes.get('/__media_missing.webp'), 2)
  const countBefore = new Map(probes)
  await page
    .locator('.ci-question-list fieldset > label input')
    .nth(1)
    .uncheck()
  await ready(page)
  assert.deepEqual(probes, countBefore)
  await page.locator('.ci-question-list fieldset > label input').nth(1).check()
  await ready(page)
  assert.deepEqual(probes, countBefore)
  results.push({
    retry:
      'fixed image decoded; questions restored; URL cache reused across selection changes',
  })

  await stage(page, recipe('/__media_pending.webp'))
  assert.equal(await launch.isDisabled(), true)
  await page
    .locator('.ci-question-list fieldset > label input')
    .nth(1)
    .uncheck()
  await page
    .locator('.ci-question-list fieldset > label input')
    .nth(2)
    .uncheck()
  await page.locator('.ci-launch:enabled').waitFor()
  assert.equal(await launch.isEnabled(), true)
  releasePending()
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
  assert.equal(await page.locator('.ci-media-check').count(), 0)
  assert.equal(
    await page
      .locator('.ci-question-list fieldset > label input:checked')
      .count(),
    1,
  )
  assert.match(
    await page.locator('.ci-setup-grid').innerText(),
    /1 question retenue/,
  )
  results.push({
    cancellation:
      'removing pending media questions cancels probes; late results do not alter selection or block launch',
  })

  await stage(page, recipe('/__media_html.webp'))
  await ready(page)
  assert.equal(
    await page.locator('.ci-media-check-list [data-status="invalid"]').count(),
    1,
  )
  assert.match(
    await page.locator('.ci-setup-grid').innerText(),
    /1 question retenue/,
  )
  await page
    .getByRole('checkbox', { name: 'Exclure les questions concernées' })
    .uncheck()
  assert.match(
    await page.locator('.ci-setup-grid').innerText(),
    /3 questions retenues/,
  )
  await launch.click()
  await page.getByRole('button', { name: 'Passer', exact: true }).click()
  await page
    .getByText('Image indisponible : Choix A', { exact: true })
    .waitFor()
  assert.equal(await page.locator('.ci-answer:visible').count(), 4)
  await page.getByRole('button', { name: 'Quitter la séance' }).click()
  results.push({
    invalidMime:
      'HTML fallback excluded; explicit keep preserves runtime error and skip fallback',
  })

  let externalRequests = 0
  page.on('request', (request) => {
    if (request.url().startsWith('https://unapproved.example/'))
      externalRequests++
  })
  await stage(page, recipe('https://unapproved.example/never-request.webp'))
  await ready(page)
  assert.equal(
    await page.locator('.ci-media-check-list [data-status="blocked"]').count(),
    1,
  )
  await page
    .getByRole('checkbox', { name: 'Exclure les questions concernées' })
    .uncheck()
  await launch.click()
  await page.getByRole('button', { name: 'Passer', exact: true }).click()
  await page
    .getByText('Image indisponible : Choix A', { exact: true })
    .waitFor()
  assert.equal(externalRequests, 0)
  results.push({
    originPolicy:
      'unapproved origin blocked before network, including explicit keep at runtime',
  })
  assert.deepEqual(errors, [])
  await page.close()
  await writeFile(
    'docs/interactive/media-results.json',
    JSON.stringify({ browser: 'Chromium', results, errors }, null, 2) + '\n',
  )
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
