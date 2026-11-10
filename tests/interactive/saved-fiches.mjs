import { skipQuestion } from './browser-actions.mjs'
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.INTERACTIVE_SAVED_TEST_URL ?? 'http://127.0.0.1:5182'
const recipe = JSON.parse(
  await readFile('docs/interactive/demo-source-recipe.json', 'utf8'),
)
recipe.pages = recipe.pages.slice(0, 2)
const saved = {
  id: 'saved-test-fixture',
  name: 'Fiche de test enregistrée',
  domains: ['algèbre', 'géométrie'],
  recipe,
  createdAt: '2026-11-07T00:00:00Z',
  updatedAt: '2026-11-07T00:00:00Z',
}
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  headless: true,
  args: ['--no-sandbox'],
})
const results = []
try {
  const context = await browser.newContext()
  await context.addCookies([
    { name: 'clairfle-fiche-access', value: 'admin', url: base },
  ])
  await context.addInitScript(() =>
    localStorage.setItem('clairfle-fiche-sync', 'interactive-test-only'),
  )
  const page = await context.newPage()
  page.setDefaultNavigationTimeout(120000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  let response = { status: 200, body: { fiches: [saved] } }
  let requests = 0
  await page.route('**/__test_api/fiches', async (route) => {
    assert.equal(route.request().method(), 'GET')
    assert.equal(
      route.request().headers().authorization,
      'Bearer interactive-test-only',
    )
    requests++
    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response.body),
    })
  })
  const initialResponse = page.waitForResponse((response) => new URL(response.url()).pathname === '/__test_api/fiches' && response.status() === 200, { timeout: 120000 })
  await page.goto(`${base}/fiches`)
  assert.equal((await (await initialResponse).json()).fiches.length, 1)
  await page.getByRole('heading', { name: 'Fiches enregistrées', exact: true }).waitFor()
  await page
    .getByRole('button', { name: 'Jouer', exact: true })
    .waitFor({ timeout: 120000 })
  await page.getByRole('button', { name: 'Jouer', exact: true }).click()
  await page.waitForURL(`**/interactif/${saved.id}`)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor()
  assert.equal(
    await page.locator('.ci-question-list fieldset > label').count(),
    3,
  )
  results.push({ savedListLaunch: 'passed' })
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor()
  assert.equal(
    await page.locator('.ci-question-list fieldset > label').count(),
    3,
  )
  results.push({ directSavedLink: 'passed' })
  response = { status: 200, body: { fiches: [] } }
  await page.goto(`${base}/interactif/deleted`)
  assert.match(
    await page.getByRole('alert').innerText(),
    /introuvable ou inaccessible/,
  )
  results.push({ deletedOrNotAuthorized: 'clear error' })
  for (const status of [401, 403, 404]) {
    response = { status, body: {} }
    await page.goto(`${base}/interactif/${saved.id}`)
    assert.ok((await page.getByRole('alert').innerText()).length > 10)
    results.push({ apiStatus: status, result: 'clear error' })
  }
  const brokenMedia = structuredClone(recipe)
  brokenMedia.pages = [
    {
      ...brokenMedia.pages[0],
      libreItems: [
        {
          layout: 'select',
          prompt: 'Test de média absent',
          answer: 'un',
          options: ['un', 'deux'],
          optionImages: ['/__missing_image.webp', '/__missing_image.webp'],
          audioSrc: '/__missing_audio.mp3',
        },
      ],
    },
  ]
  await page.route('**/__missing_*', (route) =>
    route.fulfill({ status: 404, body: '' }),
  )
  await page.goto(`${base}/generateur`)
  await page.evaluate((recipe) => {
    history.pushState(
      { clairfleInteractive: { recipe, name: 'Médias indisponibles' } },
      '',
      '/interactif',
    )
    dispatchEvent(new PopStateEvent('popstate'))
  }, brokenMedia)
  await page
    .getByRole('checkbox', { name: 'Exclure les questions concernées' })
    .uncheck()
  await page.getByRole('button', { name: /Commencer la séance/ }).click()
  await page
    .getByText('Image indisponible : Choix A', { exact: true })
    .waitFor()
  await page
    .getByText(
      'Piste audio indisponible. Vous pouvez réessayer ou passer cette question.',
      {
        exact: true,
      },
    )
    .waitFor()
  await skipQuestion(page)
  assert.equal(await page.locator('.ci-summary').count(), 1)
  results.push({ missingImageAndAudio: 'clear errors; session can continue' })
  await context.addCookies([
    { name: 'clairfle-fiche-access', value: 'partial', url: base },
  ])
  await page.goto(`${base}/interactif/demo`)
  assert.match(
    await page.getByRole('alert').innerText(),
    /compte ne permet pas/,
  )
  results.push({
    clientDomainRestriction:
      'preserved; server authorization remains authoritative',
  })
  assert.ok(requests >= 6)
  assert.deepEqual(errors, [])
  await writeFile(
    'docs/interactive/saved-fiches-results.json',
    JSON.stringify(
      { api: 'mocked; no server security claim', results },
      null,
      2,
    ) + '\n',
  )
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
