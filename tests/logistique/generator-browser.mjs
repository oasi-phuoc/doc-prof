import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const fixture = JSON.parse(await readFile(new URL('./fixture.json', import.meta.url), 'utf8'))
const server = await createServer({
  define: { 'import.meta.env.VITE_FICHES_API_URL': JSON.stringify('/__logistique_test') },
  server: { host: '127.0.0.1', port: 5189, strictPort: true, hmr: false, watch: null },
  plugins: [{
    name: 'logistique-test-banks',
    enforce: 'pre',
    transform(_code, id) {
      if (!id.endsWith('/src/logistique/approved-banks.ts')) return
      return `
        export const currentLogistiquePublication = ${JSON.stringify(fixture)}
        export function logistiquePublication(revision) {
          return !revision || revision === currentLogistiquePublication.revision
            ? currentLogistiquePublication : undefined
        }
      `
    },
  }],
})
let browser
try {
  await server.listen()
  const base = 'http://127.0.0.1:5189'
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ viewport: { width: 1366, height: 1000 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'logistique-browser-fixture'))
  const page = await context.newPage()
  let saved
  await page.route('**/__logistique_test/fiches', async (route) => {
    const request = route.request()
    assert.equal(request.headers().authorization, 'Bearer logistique-browser-fixture')
    if (request.method() === 'POST') {
      saved = {
        ...request.postDataJSON(),
        id: 'logistique-test',
        domains: ['logistique-afp'],
        createdAt: '2026-11-26T00:00:00Z',
        updatedAt: '2026-11-26T00:00:00Z',
      }
      await route.fulfill({ json: { fiche: saved } })
      return
    }
    assert.equal(request.method(), 'GET')
    await route.fulfill({ json: { fiches: saved ? [saved] : [] } })
  })
  page.setDefaultTimeout(90000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  async function select(label, choice) {
    await page.getByRole('button', { name: label, exact: true }).click()
    await page.getByRole('option', { name: choice, exact: true }).click()
  }

  await page.goto(base + '/generateur')
  const sheet = page.locator('.a4-frame .worksheet-sheet').first()
  await sheet.waitFor()
  const originalSize = await sheet.evaluate((el) => [el.offsetWidth, el.offsetHeight])
  const shape = ['.doc-header', '.sheet-body', '.doc-footer']
  for (const diploma of ['CFC', 'AFP']) {
    await select('Domaine', 'Logistique ' + diploma)
    await select('Sous-thème', '100 — Introduction aux modules')
    await page.getByRole('heading', { name: 'Contenu à compléter.' }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Enregistrer', exact: true }).isDisabled(), true)
    await select('Sous-thème', '105 — Marchandises')
    await select('Type d’exercice', 'Théorie')
    await sheet.getByText('Cartons à réceptionner', { exact: true }).waitFor()
    assert.equal((await page.locator('.brand').textContent()).trim(), 'ClairFLE')
    assert.equal(await page.locator('.brand img').count(), 0)
    assert.equal(await sheet.locator('.doc-school-name').innerText(), 'Logistique ' + diploma)
    assert.deepEqual(await sheet.evaluate((el) => [el.offsetWidth, el.offsetHeight]), originalSize)
    for (const selector of shape) assert.equal(await sheet.locator(selector).count(), 1)
    await sheet.getByText('Théorie : module 105', { exact: true }).waitFor()

    await select('Type d’exercice', 'Mathématiques')
    await sheet.locator('.problem-block .draft-pad.with-grid').waitFor()
    assert.equal(await sheet.locator('.problem-response-line .answer-line-field').count(), 1)
    assert.doesNotMatch(await sheet.innerText(), /42 kg/)
    await page.getByRole('button', { name: 'Fiche élève (cliquer pour corrigé)', exact: true }).click()
    await sheet.getByText('7 × 6 kg = 42 kg', { exact: true }).waitFor()
    await sheet.getByText('Le poids total est de 42 kg.', { exact: true }).waitFor()
    const reserve = await sheet.evaluate((el) => {
      const bottom = el.querySelector('.exercise-item').getBoundingClientRect().bottom
      const footer = el.querySelector('.doc-footer').getBoundingClientRect().top
      return (footer - bottom) * el.offsetHeight / el.getBoundingClientRect().height
    })
    assert(reserve >= 25, `Le calcul tient dans la zone A4 en ${diploma} : ${reserve}px`)

    await page.getByRole('button', { name: 'Type d’exercice', exact: true }).click()
    const check = page.getByRole('option', { name: /^Vérification des connaissances/ })
    assert.equal(await check.isDisabled(), diploma === 'AFP')
    await page.keyboard.press('Escape')
    if (diploma === 'CFC') {
      await select('Type d’exercice', 'Vérification des connaissances')
      await sheet.getByText('Que comprend la masse brute ?', { exact: true }).waitFor()
    }
    await select('Type d’exercice', 'Mises en situation')
    await sheet.getByText(/^Vous repérez un carton mouillé/).waitFor()
    await select('Type d’exercice', 'Glossaires')
    await sheet.getByText('Tare. Masse de l’emballage vide.', { exact: true }).waitFor()

    await select('Type d’exercice', 'Mathématiques')
    await page.getByRole('button', { name: 'Évaluation', exact: true }).click()
    await select('Thème', '300 — Procurement Management')
    await select('Sous-thème', '308 — Les contrôles de quantités')
    await page.keyboard.press('Escape')
    const modules = page.getByRole('list', { name: 'Modules retenus', exact: true })
    assert.match(await modules.innerText(), /105.*Marchandises[\s\S]*308.*contrôles de quantités/)
    await page.getByRole('button', { name: 'Par module', exact: true }).click()
    assert.equal(await page.getByRole('spinbutton', { name: 'Nombre de questions du module 308' }).inputValue(), '1')
    await sheet.getByText('Mathématiques : modules 105 et 308', { exact: true }).waitFor()
    await page.getByRole('button', { name: 'Exercice', exact: true }).click()
    await sheet.getByText('Mathématiques : module 105', { exact: true }).waitFor()
    assert.equal(await page.getByRole('list', { name: 'Modules retenus', exact: true }).count(), 0)
    await page.getByRole('button', { name: 'Évaluation', exact: true }).click()
    await sheet.getByText('Mathématiques : modules 105 et 308', { exact: true }).waitFor()
    assert.equal(await page.getByRole('spinbutton', { name: 'Nombre de questions du module 105' }).inputValue(), '1')
    await page.getByRole('button', { name: 'Exercice', exact: true }).click()
  }

  await page.getByRole('button', { name: 'Évaluation', exact: true }).click()
  const saveResponse = page.waitForResponse((response) =>
    new URL(response.url()).pathname === '/__logistique_test/fiches' && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Enregistrer la fiche' })
  await dialog.getByLabel('Nom de la fiche').fill('Pilote technique AFP')
  await dialog.getByLabel('Enregistré par').fill('Formateur de test')
  await dialog.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  await saveResponse
  await dialog.waitFor({ state: 'hidden' })
  assert.equal(saved.recipe.pages[0].logistiqueBankRevision, fixture.revision)
  assert.deepEqual(saved.recipe.pages[0].logistiqueSelection, {
    modules: ['105', '308'], quantities: { '105': 1, '308': 1 },
  })
  await page.goto(base + '/fiches')
  await page.getByRole('button', { name: 'Ouvrir', exact: true }).click()
  await page.waitForURL('**/generateur')
  await sheet.getByText('Mathématiques : modules 105 et 308', { exact: true }).waitFor()
  await sheet.getByText(/^Vous réceptionnez 7 cartons/).waitFor()
  await page.emulateMedia({ media: 'print' })
  await page.locator('.print-only-sheets .worksheet-sheet').first().waitFor()
  assert.match(await page.locator('.print-only-sheets').innerText(), /Le poids total est de 42 kg\./)
  assert.match(await page.locator('.print-only-sheets').innerText(), /La masse brute est de 208 kg\./)
  assert((await page.pdf()).subarray(0, 4).equals(Buffer.from('%PDF')))

  await page.emulateMedia({ media: 'screen' })
  await page.getByRole('button', { name: 'Exercice', exact: true }).click()
  await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
  const editor = page.getByRole('complementary', { name: 'Mode libre' })
  await editor.getByText('Banque de questions', { exact: true }).click()
  await select('Module de la banque', '308 — Les contrôles de quantités')
  await editor.getByRole('searchbox', { name: 'Rechercher une question' }).fill('masse brute')
  await editor.getByRole('checkbox', { name: /^La palette pèse 28 kg/ }).check()
  await editor.getByText('Corrigé', { exact: true }).click()
  await editor.getByText('28 kg + 180 kg = 208 kg', { exact: true }).waitFor()
  await editor.getByRole('button', { name: 'Ajouter la sélection (1)', exact: true }).click()
  await editor.getByRole('status').getByText('1 question ajoutée.').waitFor()
  assert.equal(await editor.getByRole('checkbox', { name: /^La palette pèse 28 kg/ }).count(), 0)
  assert.equal(await editor.getByRole('button', { name: 'Ajouter un lot', exact: true }).isDisabled(), true)
  const alternativeCorrection = '180 kg + 28 kg = 208 kg'
  await editor.getByLabel('Calcul du corrigé').last().fill(alternativeCorrection)
  await sheet.getByText(/^La palette pèse 28 kg/).waitFor()
  await editor.getByRole('button', { name: 'Régénérer les questions tirées', exact: true }).click()
  assert.equal(await editor.getByLabel('Calcul du corrigé').last().inputValue(), alternativeCorrection)
  const firstQuestionEditor = editor.locator('.generic-libre-editor .libre-item-card').first()
  await firstQuestionEditor.getByText('Image de la question', { exact: true }).click()
  await select('Photo de la bibliothèque', 'Carton réceptionné')
  await firstQuestionEditor.getByLabel('Légende', { exact: true }).fill('Exemple de carton à contrôler')
  await select('Taille de l’image', 'Grande')
  const firstFigure = sheet.locator('.logistique-illustrated-prompt.is-droite .logistique-question-image')
  await firstFigure.waitFor()
  assert.equal(await firstFigure.count(), 1)
  assert.equal(await firstFigure.evaluate((figure) => getComputedStyle(figure).cssFloat), 'right')
  await select('Visibilité de l’image', 'Corrigé seulement')
  assert.equal(await sheet.locator('.logistique-question-image').count(), 0)
  const saveLibre = page.waitForResponse((response) =>
    new URL(response.url()).pathname === '/__logistique_test/fiches' && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  await dialog.getByRole('button', { name: 'Enregistrer une nouvelle fiche', exact: true }).click()
  await saveLibre
  await dialog.waitFor({ state: 'hidden' })
  const manual = saved.recipe.pages[0].libreItems.find((item) => item.logistiqueRetained)
  assert.equal(manual.logistiqueSource.id, 'fixture-308-maths')
  assert.equal(manual.calcAnswer, alternativeCorrection)
  const firstItem = saved.recipe.pages[0].libreItems[0]
  assert.equal(firstItem.logistiqueImage.visibility, 'answers')
  assert.equal(firstItem.logistiqueImage.width, 180)
  assert.equal(manual.logistiqueImage, undefined)
  await page.goto(base + '/fiches')
  await page.getByRole('button', { name: 'Ouvrir', exact: true }).click()
  await page.waitForURL('**/generateur')
  await page.waitForFunction(() =>
    document.querySelector('.print-only-sheets')?.textContent?.includes('La palette pèse 28 kg'))
  assert.equal(await sheet.locator('.logistique-question-image').count(), 0)
  await page.emulateMedia({ media: 'print' })
  assert.match(await page.locator('.print-only-sheets').innerText(), /180 kg \+ 28 kg = 208 kg/)
  const printablePhoto = page.locator('.print-only-sheets .logistique-question-image')
  assert.equal(await printablePhoto.count(), 1)
  assert.equal(await printablePhoto.locator('figcaption').innerText(), 'Exemple de carton à contrôler')
  assert(await printablePhoto.locator('img').evaluate(async (img) => { await img.decode(); return img.naturalWidth > 0 }))
  assert((await page.pdf()).subarray(0, 4).equals(Buffer.from('%PDF')))

  await page.emulateMedia({ media: 'screen' })
  const layout = editor.getByText('Mise en page de la fiche', { exact: true })
  await layout.click()
  await editor.getByRole('radio', { name: /Paysage — double A5/ }).click()
  await layout.click()
  await page.emulateMedia({ media: 'print' })
  assert.equal(await printablePhoto.count(), 1)
  assert.equal(await page.locator('.print-only-sheets .a5-half.is-left .logistique-question-image').count(), 1)
  const a5Reserves = await printablePhoto.evaluateAll((figures) => figures.map((figure) => {
    const item = figure.closest('.exercise-item')
    const footer = figure.closest('.a5-half').querySelector('.doc-footer')
    return footer.getBoundingClientRect().top - item.getBoundingClientRect().bottom
  }))
  assert(a5Reserves.every((reserve) => reserve >= 25), JSON.stringify(a5Reserves))
  assert((await page.pdf()).subarray(0, 4).equals(Buffer.from('%PDF')))

  await page.emulateMedia({ media: 'screen' })
  await layout.click()
  await editor.getByRole('radio', { name: /Portrait A4/ }).click()
  await layout.click()
  await page.getByRole('button', { name: 'Fermer le mode libre', exact: true }).click()
  page.on('dialog', (confirmation) => confirmation.accept())
  await select('Thème', '300 — Procurement Management')
  await select('Sous-thème', '306 — Contrôle des supports de charge')
  await select('Type d’exercice', 'Vérification des connaissances')
  await select('Présentation des questions', 'Texte à trous sans liste')
  await sheet.locator('.logistique-gaps').waitFor({ timeout: 12000 }).catch(async () => {
    throw new Error('Texte à trous absent avant Libre : ' + await sheet.innerText())
  })
  await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
  await editor.getByLabel('Texte à trous', { exact: true }).fill('Sur le quai, une ___ reçoit les colis. Un ___ retient les pièces en vrac.', { timeout: 12000 })
    .catch(async () => { throw new Error('Éditeur de texte à trous absent : ' + await editor.innerText()) })
  await editor.getByLabel('Réponses, une par ligne dans l’ordre des blancs').fill('palette')
  await editor.getByRole('status').getByText(/2 blanc\(s\).*1 réponse/).waitFor()
  await editor.getByLabel('Réponses, une par ligne dans l’ordre des blancs').fill('palette\ncaisson')
  await editor.getByRole('checkbox', { name: 'Afficher la liste de mots' }).check()
  await editor.getByLabel('Mots supplémentaires, un par ligne').fill('couvercle')
  await sheet.locator('.logistique-words').getByText(/couvercle/).waitFor()
  await editor.getByRole('checkbox', { name: 'Afficher la liste de mots' }).uncheck()
  assert.equal(await sheet.locator('.logistique-words').count(), 0)

  const saveGap = page.waitForResponse((response) =>
    new URL(response.url()).pathname === '/__logistique_test/fiches' && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  await dialog.getByRole('button', { name: 'Enregistrer une nouvelle fiche', exact: true }).click()
  await saveGap
  await dialog.waitFor({ state: 'hidden' })
  const savedGap = saved.recipe.pages[0].libreItems[0].logistiqueGaps
  assert.deepEqual(savedGap, { answers: ['palette', 'caisson'], distractors: ['couvercle'] })
  await page.goto(base + '/fiches')
  await page.getByRole('button', { name: 'Ouvrir', exact: true }).click()
  await page.waitForURL('**/generateur')
  await sheet.locator('.logistique-gaps').waitFor()
  assert.equal(await sheet.locator('.tcf-blank-inline.filled').count(), 0)
  await page.emulateMedia({ media: 'print' })
  assert.deepEqual(await page.locator('.print-only-sheets .tcf-blank-inline.filled').allTextContents(), ['palette', 'caisson'])
  assert((await page.pdf({ preferCSSPageSize: true })).subarray(0, 4).equals(Buffer.from('%PDF')))

  await page.emulateMedia({ media: 'screen' })
  await page.getByRole('button', { name: 'Fermer le mode libre', exact: true }).click()
  await select('Présentation des questions', 'Tableau de données à compléter')
  const table = sheet.locator('.logistique-exercise-table')
  await table.locator('.logistique-table-blank').waitFor()
  assert(!await table.getByText('800 mm').count())
  await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
  await editor.getByText('Modifier le tableau', { exact: true }).click()
  await editor.getByLabel('En-tête de la colonne 1').fill('Type de palette')
  const tableAnswer = editor.getByLabel('Réponse — Largeur, ligne 1')
  await tableAnswer.fill('')
  await editor.getByRole('status').getByText(/Remplissez les en-têtes et les réponses/).waitFor()
  await tableAnswer.fill('800 millimètres')
  await table.getByRole('columnheader', { name: 'Type de palette' }).waitFor()
  assert(!await table.getByText('800 millimètres').count())
  await page.emulateMedia({ media: 'print' })
  assert.deepEqual(await page.locator('.print-only-sheets .logistique-table-answer .filled-answer').allTextContents(), ['800 millimètres'])
  assert.deepEqual(errors, [])
  console.log('Pilotes CFC et AFP : sélection, édition Libre des photos, textes à trous et tableaux, enregistrement et PDF.')
} finally {
  await browser?.close()
  await server.close()
}
