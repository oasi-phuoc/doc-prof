import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser
const button = (scope, name) => scope.getByRole('button', { name, exact: true })

async function open(context, exerciseType, overrides = {}) {
  const page = await context.newPage()
  await page.addInitScript(({ exerciseType, overrides }) => history.replaceState({
    ...history.state,
    clairfleFiche: {
      id: 'perimetre-fixture', name: 'Périmètre témoin',
      recipe: {
        version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
        libreMode: false, libreSnapshot: null, printCorrections: true,
        pages: [{
          domain: 'géométrie', topic: 'perimetres', exerciseType, difficulty: 'moyen',
          count: 2, columns: 1, ...overrides,
        }],
      },
    },
  }, ''), { exerciseType, overrides })
  await page.goto('/generateur')
  const preview = page.locator('.a4-frame .worksheet-sheet').first()
  const print = page.locator('.print-only-sheets .worksheet-sheet')
  await preview.waitFor()
  const before = await print.first().textContent()
  assert.equal(await page.getByRole('region', { name: 'Périmètres', exact: true }).count(), 0)
  await button(page, 'Mode libre').click()
  const panel = page.locator('#activity-editor')
  const editor = panel.getByRole('region', { name: 'Périmètres', exact: true })
  await editor.waitFor()
  assert.equal(await print.first().textContent(), before)
  assert.equal(await button(panel, 'Valider les changements').count(), 0)
  return { page, panel, editor, print }
}

const question = (editor, number) => editor.getByRole('group', { name: `Question ${number}`, exact: true })
const field = (row, name) => row.getByRole('textbox', { name, exact: true })
const answer = (print) => print.last().locator('.response-value').first().textContent()

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: baseURL }])

  const square = await open(context, 'perimetres-carre')
  const row = question(square.editor, 1)
  const side = field(row, 'Côté')
  await side.fill('12,5')
  assert.equal(await answer(square.print), '50 cm')
  assert.match(await square.print.first().textContent(), /12,5 cm/)
  assert.doesNotMatch(await square.print.first().textContent(), /50 cm/)
  await side.fill('-8')
  assert.equal(await side.getAttribute('aria-invalid'), 'true')
  assert.equal(await answer(square.print), '50 cm')
  await side.fill('12,5')
  await row.getByRole('combobox', { name: 'Unité des cotes', exact: true }).selectOption('m')
  assert.equal(await answer(square.print), '50 m')
  await button(row, 'Verrou de la question 1').click()
  await button(square.editor, 'Régénérer les questions déverrouillées').click()
  assert.equal(await side.inputValue(), '12,5')
  assert.equal(await answer(square.print), '50 m')
  await square.panel.getByRole('spinbutton', { name: 'Nombre de questions', exact: true }).fill('3')
  await question(square.editor, 3).waitFor()
  assert.equal(await answer(square.print), '50 m')
  await button(square.page, 'Annuler').click()
  assert.equal(await question(square.editor, 3).count(), 0)
  await square.panel.getByText('Mise en page de la fiche', { exact: true }).click()
  await square.panel.getByRole('radio', { name: /Paysage — double A5/ }).click()
  assert(await button(square.page, 'Mode libre').isDisabled())
  assert.match(await square.page.locator('.print-only-sheets .a5-half').first().textContent(), /12,5 m/)
  await square.page.close()

  const rectangle = await open(context, 'perimetres-rectangle-manquant')
  const rectangleRow = question(rectangle.editor, 1)
  await field(rectangleRow, 'Longueur').fill('10')
  const given = field(rectangleRow, 'Périmètre donné')
  await given.fill('100')
  assert.equal(await answer(rectangle.print), '40 cm')
  assert.match(await rectangle.print.first().textContent(), /Le périmètre mesure 100 cm/)
  await given.fill('15')
  assert.equal(await given.getAttribute('aria-invalid'), 'true')
  assert.equal(await answer(rectangle.print), '40 cm')
  await rectangle.page.close()

  const triangle = await open(context, 'perimetres-triangle', { count: 1, libreItems: [{
    layout: 'geo', figure: 'triangle', dims: { a: 30, b: 40, c: 50, unit: 'cm', triangleKind: 'scalene' },
    prompt: 'Calculez le périmètre.', calcAnswer: '30 + 40 + 50', responseAnswer: '120 cm', answer: '120 cm',
  }] })
  const triangleRow = question(triangle.editor, 1)
  const sideC = field(triangleRow, 'Côté C')
  await sideC.fill('7')
  assert.equal(await sideC.getAttribute('aria-invalid'), 'true')
  assert.equal(await answer(triangle.print), '120 cm')
  await field(triangleRow, 'Côté A').fill('3')
  await field(triangleRow, 'Côté B').fill('4')
  assert.equal(await answer(triangle.print), '120 cm')
  await sideC.fill('6')
  assert.equal(await answer(triangle.print), '13 cm')
  assert.equal(await triangleRow.locator('[aria-invalid="true"]').count(), 0)
  await triangle.page.close()

  const circle = await open(context, 'perimetres-cercle')
  const circleRow = question(circle.editor, 1)
  await field(circleRow, 'Rayon').fill('10')
  await field(circleRow, 'Valeur de π').fill('3,1416')
  assert.match(await circle.print.first().textContent(), /Prenez π = 3,1416/)
  assert.equal(await answer(circle.print), '62,83 cm')
  await circle.page.close()

  const quadrilateral = await open(context, 'perimetres-quadrilatere')
  const quadRow = question(quadrilateral.editor, 1)
  await quadRow.getByRole('combobox', { name: 'Figure', exact: true }).selectOption('rectangle')
  assert(await field(quadRow, 'Longueur').isVisible())
  assert(await field(quadRow, 'Largeur').isVisible())
  await quadrilateral.page.close()
  await context.close()
  console.log('Périmètres A4 vérifiés avec cote manquante, unité, π, contraintes, verrou et conversion double A5.')
} finally {
  await browser?.close()
  await server?.close()
}
