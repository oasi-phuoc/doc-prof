import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const plan = JSON.parse(await readFile(new URL('../../docs/logistique/preparation/references-illustrees-v002.json', import.meta.url), 'utf8'))
const curriculum = JSON.parse(await readFile(new URL('../../src/logistique/curriculum.generated.json', import.meta.url), 'utf8'))
const preparation = new URL('../../docs/logistique/preparation/', import.meta.url)
const photoFiles = (await readdir(preparation)).filter((file) => /^\d{3}-v002\.json$/.test(file)).sort()
const photoPlans = new Map(await Promise.all(photoFiles.map(async (file) => [
  file.slice(0, 3),
  JSON.parse(await readFile(new URL(file, preparation), 'utf8')),
])))
const requestedModules = process.argv.slice(2)
assert(requestedModules.every((module) => photoPlans.has(module)), 'Module illustré inconnu')
const externalUrl = process.env.LOGISTIQUE_TEST_URL
const base = externalUrl ?? 'http://127.0.0.1:5190'
const server = externalUrl ? null : await createServer({ server: { host: '127.0.0.1', port: 5190, strictPort: true } })
let browser
try {
  await server?.listen()
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ viewport: { width: 1366, height: 1000 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => { Math.random = () => 0 })
  const page = await context.newPage()
  await page.clock.setFixedTime(20261126)
  page.setDefaultTimeout(90000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('dialog', async (dialog) => {
    assert.match(dialog.message(), /^Changer de domaine remplacera les activités/)
    await dialog.accept()
  })
  const sheet = page.locator('.a4-frame .worksheet-sheet').first()

  async function select(label, choice) {
    await page.getByRole('button', { name: label, exact: true }).click()
    await page.getByRole('option', { name: choice, exact: true }).click()
  }

  async function inspectPrint(label) {
    await page.emulateMedia({ media: 'print' })
    const printed = page.locator('.print-only-sheets .worksheet-sheet')
    await printed.first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    const pages = await printed.evaluateAll(async (elements) => {
      await Promise.all(elements.flatMap((element) => [...element.querySelectorAll('img')]).map((img) => img.decode()))
      return elements.map((element) => {
        const bounds = element.getBoundingClientRect()
        const items = [...element.querySelectorAll('.exercise-item')]
        const body = element.querySelector('.sheet-body').getBoundingClientRect()
        const lastBottom = Math.max(...items.map((item) => item.getBoundingClientRect().bottom))
        const footer = element.querySelector('.doc-footer')
        return {
          height: bounds.height,
          count: items.length,
          reserve: Math.min(body.bottom, footer?.getBoundingClientRect().top ?? bounds.bottom) - lastBottom,
          images: element.querySelectorAll('.exercise-item img').length,
          numbers: items.flatMap((item) => [...item.querySelectorAll('.item-number')].map((label) => parseInt(label.textContent, 10))),
        }
      })
    })
    assert(pages.every(({ height }) => Math.abs(height - 1122.52) < 3), label + ' A4')
    assert(pages.every(({ reserve }) => reserve >= 25), label + ' reserve: ' + JSON.stringify(pages))
    const printText = await page.locator('.print-only-sheets').innerText()
    await page.emulateMedia({ media: 'screen' })
    return { pages, printText }
  }

  async function verifyPdf() {
    const pdf = await page.pdf({ preferCSSPageSize: true })
    assert.equal(pdf.subarray(0, 4).toString(), '%PDF')
  }

  await page.goto(base + '/generateur')
  await sheet.waitFor()
  for (const diploma of ['CFC', 'AFP']) {
    await select('Domaine', 'Logistique ' + diploma)
    let currentTheme = '100'
    for (const { module, figures } of requestedModules.length ? [] : plan.modules) {
      const { title, theme, year } = curriculum.modules.find(({ code }) => code === module)
      if (!year[diploma]) continue
      if (theme !== currentTheme) {
        await select('Thème', theme + ' — ' + curriculum.themes.find(({ code }) => code === theme).title)
        currentTheme = theme
      }
      await select('Sous-thème', module + ' — ' + title)
      await select('Type d’exercice', 'Objectifs et aperçu')
      await sheet.getByText('Objectifs et aperçu : module ' + module, { exact: true }).waitFor()
      const intro = await inspectPrint(`${module} ${diploma} objectifs et aperçu`)
      assert.equal(intro.pages.length, 1, `${module} ${diploma} objectifs et aperçu : ${JSON.stringify(intro.pages)}`)
      assert.match(intro.printText, /Objectifs/)
      assert.match(intro.printText, /Aperçu du module/)
      assert.doesNotMatch(intro.printText, /EnterSite|ASFL|SVBL|^Source$/im)

      await select('Type d’exercice', 'Théorie')
      await sheet.getByText('Théorie : module ' + module, { exact: true }).waitFor()
      const theory = await inspectPrint(`${module} ${diploma} théorie`)
      const expectedImages = photoPlans.get(module)?.visuals.length ?? (figures.length + 1)
      assert(theory.pages.reduce((sum, item) => sum + item.images, 0) >= expectedImages, `${module} ${diploma} illustrations`)
      assert.doesNotMatch(theory.printText, /Aperçu du module|Objectifs du module/)
      if (module === '105') {
        assert.match(theory.printText, /L’humidité relative est le rapport/)
        assert.match(theory.printText, /5\.7\.2 La manutention des marchandises/)
      }
    }
    if (!requestedModules.length) {
      console.log(`Logistique ${diploma} : objectifs, aperçus et théories illustrées vérifiés sur les modules actifs.`)

      await select('Thème', '100 — ' + curriculum.themes.find(({ code }) => code === '100').title)
      await select('Sous-thème', '105 — Marchandises')
      await select('Type d’exercice', 'Glossaires')
      const glossary = await inspectPrint('Glossaire ' + diploma)
      assert.equal(glossary.pages.reduce((sum, item) => sum + item.count, 0), 45)
      await select('Type d’exercice', 'Mathématiques')
      const questionCount = page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true })
      const max = Number(await questionCount.getAttribute('max'))
      await questionCount.fill(String(max))
      const calculations = await inspectPrint('Mathématiques ' + diploma)
      assert.equal(calculations.pages.reduce((sum, item) => sum + item.count, 0), max * 2)
      assert(calculations.pages.some(({ count }) => count >= 2))
      assert.match(calculations.printText, /1 200 CHF/)
      await select('Type d’exercice', 'Vérification des connaissances')
      await inspectPrint('Vérification ' + diploma)
      await select('Type d’exercice', 'Mises en situation')
      await inspectPrint('Situations ' + diploma)

      await select('Sous-thème', '110 — ' + curriculum.modules.find(({ code }) => code === '110').title)
      await select('Type d’exercice', 'Mathématiques')
      const warehouse = await inspectPrint('Mathématiques 110 ' + diploma)
      const count = Number(await questionCount.inputValue())
      const numbers = Array.from({ length: count }, (_, index) => index + 1)
      assert.deepEqual(warehouse.pages.flatMap((sheet) => sheet.numbers), [...numbers, ...numbers])
      assert(warehouse.pages.every((sheet) => sheet.count >= 2))
      console.log(`Modules 105 et 110 ${diploma} : questions groupées dans la fiche élève et le corrigé.`)
    }

    let checkedModules = 0
    for (const [code, { visuals }] of photoPlans) {
      if (requestedModules.length && !requestedModules.includes(code)) continue
      const caption = visuals[0].summaryAnchor
      const photos = visuals.length
      const { title, theme, year } = curriculum.modules.find(({ code: module }) => code === module)
      if (!year[diploma]) continue
      await select('Thème', theme + ' — ' + curriculum.themes.find(({ code }) => code === theme).title)
      await select('Sous-thème', code + ' — ' + title)
      await select('Type d’exercice', 'Théorie')
      assert.equal(await page.getByRole('group', { name: 'Nombre de colonnes', exact: true }).count(), 0)
      const complete = await inspectPrint(`${code} ${diploma} complet`)
      assert.equal(await page.locator('.print-only-sheets img[src*="/assets/logistique/"][src$="-v002.webp"]').count(), photos)
      await verifyPdf()
      await page.getByRole('button', { name: 'Résumé', exact: true }).click()
      const summary = await inspectPrint(`${code} ${diploma} résumé`)
      assert(summary.printText.includes(caption))
      assert.notEqual(summary.printText, complete.printText)
      assert.equal(await page.locator('.print-only-sheets img[src*="/assets/logistique/"][src$="-v002.webp"]').count(), photos)
      assert(summary.pages.length <= complete.pages.length)
      await verifyPdf()
      await page.getByRole('button', { name: 'Complet', exact: true }).click()
      checkedModules += 1
      const restored = await inspectPrint(`${code} ${diploma} complet restauré`)
      assert.equal(restored.printText, complete.printText)
    }
    if (checkedModules) console.log(`Logistique ${diploma} : illustrations intégrées au cours et au résumé de ${checkedModules} modules.`)
  }
  assert.deepEqual(errors, [])
} finally {
  await browser?.close()
  await server?.close()
}
