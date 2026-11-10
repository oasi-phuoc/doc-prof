import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { classroomRecipe } from './classroom-fixture.mjs'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
const output = 'docs/interactive/screenshots'
await mkdir(output, { recursive: true })
try {
  for (const width of [360, 390, 700]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' })
    page.setDefaultTimeout(30000)
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await page.goto(`${base}/interactif/demo`)
    await page.getByRole('button', { name: /Commencer la séance/ }).waitFor({ timeout: 120000 })
    const brand = await page.locator('.ci-header .brand').boundingBox()
    const create = await page.getByRole('link', { name: 'Créer des fiches', exact: true }).boundingBox()
    assert.ok(Math.abs(brand.y + brand.height / 2 - create.y - create.height / 2) < 2)
    assert.equal(await page.getByRole('link', { name: 'Créer des fiches' }).innerText(), 'Créer des fiches')
    const options = await page.locator('.ci-header-tools').boundingBox()
    assert.ok(options.y >= brand.y + brand.height)
    for (const label of ['Contraste', 'Plein écran', 'Mes fiches']) {
      const bounds = await page.getByRole('button', { name: label, exact: true }).boundingBox()
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width)
    }
    const names = ['Esprit feuille', 'Hibou', 'Pieuvre', 'Hérisson', 'Lapin lunaire', 'Dragon']
    const ids = ['leaf', 'owl', 'octopus', 'hedgehog', 'rabbit', 'dragon']
    for (let index = 0; index < names.length; index++) {
      await page.getByRole('button', { name: 'Mascotte', exact: true }).click()
      const gallery = page.getByRole('dialog', { name: 'Choisir la mascotte' })
      assert.equal(await gallery.getByRole('button').count(), 6)
      assert.equal((await gallery.innerText()).trim(), '')
      const previews = await gallery.locator('.ci-mascot-sprite').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).backgroundImage))
      for (let i = 0; i < ids.length; i++) assert.ok(previews[i].includes(`${ids[i]}-mascot`))
      const slots = await gallery.getByRole('button').evaluateAll((elements) => elements.map((element) => ({ x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y })))
      assert.equal(slots[0].y, slots[1].y)
      assert.equal(slots[1].y, slots[2].y)
      assert.equal(slots[3].y, slots[4].y)
      assert.equal(slots[4].y, slots[5].y)
      assert.ok(slots[3].y > slots[0].y)
      await gallery.getByRole('button', { name: names[index], exact: true }).click()
      assert.equal(await page.getByRole('dialog', { name: 'Choisir la mascotte' }).count(), 0)
      assert.equal(await page.locator('.ci-app').getAttribute('data-mascot'), ids[index])
    }
    await page.getByRole('button', { name: /Commencer la séance/ }).click()
    await page.locator('.ci-controls').waitFor()
    assert.equal(await page.getByRole('link', { name: 'Créer des fiches', exact: true }).count(), 0)
    const stage = await page.locator('.ci-phase-art').boundingBox()
    const timer = await page.locator('.ci-timer-value').boundingBox()
    assert.ok(Math.abs(stage.x + stage.width / 2 - width / 2) < 2)
    assert.ok(Math.abs(timer.x + timer.width / 2 - width / 2) < 2)
    const sprite = await page.locator('.ci-phase-art .ci-mascot-sprite').evaluate((el) => getComputedStyle(el).backgroundImage)
    assert.match(sprite, /dragon-mascot/)
    await page.screenshot({ path: `${output}/mobile-thinking-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: 'Mascotte', exact: true }).click()
    await page.getByRole('dialog', { name: 'Choisir la mascotte' }).getByRole('button', { name: 'Hibou', exact: true }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    await page.reload()
    await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor({ timeout: 120000 })
    await page.getByRole('button', { name: 'Mascotte', exact: true }).click()
    assert.equal(await page.getByRole('dialog', { name: 'Choisir la mascotte' }).getByRole('button', { name: 'Hibou', exact: true }).getAttribute('aria-pressed'), 'true')
    await page.keyboard.press('Escape')
    await page.evaluate((recipe) => {
      history.pushState({ clairfleInteractive: { recipe, name: 'Questions doubles' } }, '', '/interactif')
      dispatchEvent(new PopStateEvent('popstate'))
    }, await classroomRecipe())
    await page.getByRole('button', { name: /Commencer la séance/ }).click()
    await page.locator('.ci-controls').waitFor()
    await page.getByRole('button', { name: 'Passer', exact: true }).click()
    assert.equal(await page.locator('.ci-numbered-heading').count(), 2)
    const headings = await page.locator('.ci-numbered-heading').evaluateAll((elements) => elements.map((element) => {
      const prompt = element.querySelector('.ci-question-prompt')
      const range = document.createRange()
      range.selectNodeContents(prompt)
      return { number: element.querySelector('.ci-question-number').getBoundingClientRect().right, lines: [...range.getClientRects()].map((rect) => ({ x: rect.x, y: rect.y })) }
    }))
    assert.ok(headings.some((heading) => heading.lines.length > 1))
    for (const heading of headings) {
      assert.ok(heading.lines[0].x > heading.number)
      for (const line of heading.lines) assert.ok(Math.abs(line.x - heading.lines[0].x) < 1)
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.screenshot({ path: `${output}/mobile-paired-${width}.png`, fullPage: true })
    await page.goto(`${base}/generateur`)
    await page.getByRole('button', { name: 'Jouer avec la classe', exact: true }).waitFor()
    const generatorBrand = await page.locator('.topbar .brand').boundingBox()
    const play = await page.getByRole('button', { name: 'Jouer avec la classe', exact: true }).boundingBox()
    assert.ok(Math.abs(generatorBrand.y + generatorBrand.height / 2 - play.y - play.height / 2) < 2)
    const generatorOptions = await page.locator('.topbar-right').boundingBox()
    assert.ok(generatorOptions.y >= generatorBrand.y + generatorBrand.height)
    assert.deepEqual(errors, [])
    results.push({ width, header: 'identity and primary action aligned; options below', mascot: '6 choices; persisted and switchable in session', phaseAndTimer: 'centered', numbering: 'hanging indent verified on wrapped lines' })
    await page.close()
  }
  console.log(JSON.stringify(results, null, 2))
  await writeFile('docs/interactive/mobile-results.json', JSON.stringify(results, null, 2) + '\n')
} finally { await browser.close() }
