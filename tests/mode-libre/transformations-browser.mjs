import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser
const button = (scope, name) => scope.getByRole('button', { name, exact: true })
const field = (editor, point, coordinate) => editor.getByRole('group', { name: point, exact: true })
  .getByRole('textbox', { name: coordinate, exact: true })
const fixture = [
  { x: -2, y: -1, label: 'A', kind: 'point' },
  { x: 2, y: -1, label: 'B', kind: 'point' },
  { x: 0, y: 3, label: 'C', kind: 'point' },
  { x: -3, y: 2, label: 'D', kind: 'point' },
]

async function open(context, exerciseType, automatic = false) {
  const page = await context.newPage()
  const axial = exerciseType.includes('-axiale-')
  const coordMarks = axial ? fixture : [...fixture, { x: 1, y: 0, label: 'Ω', kind: 'point' }]
  await page.addInitScript(({ exerciseType, edit }) => history.replaceState({
    ...history.state,
    clairfleFiche: {
      id: 'symetrie-fixture', name: 'Symétrie témoin',
      recipe: {
        version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
        libreMode: false, libreSnapshot: null, printCorrections: true,
        pages: [{
          domain: 'géométrie', topic: 'transformations', exerciseType, difficulty: 'moyen',
          count: 4, columns: 1, coordCols: 24, coordRows: 24, coordCellMm: 4, ...edit,
        }],
      },
    },
  }, ''), {
    exerciseType,
    edit: automatic ? {} : { coordLibre: true, coordMarks, coordSymmetryAxis: axial ? 'x' : undefined },
  })
  await page.goto('/generateur')
  await page.locator('.a4-frame .worksheet-sheet').first().waitFor()
  return page
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: baseURL }])

  for (const type of ['axiale-figure', 'centrale-figure', 'axiale-placer', 'centrale-placer']) {
    const page = await open(context, `transformations-${type}`)
    const axial = type.startsWith('axiale')
    const placer = type.endsWith('placer')
    const panel = page.locator('#activity-editor')
    const preview = page.locator('.a4-frame .worksheet-sheet').first()
    const print = page.locator('.print-only-sheets .worksheet-sheet')
    const subject = print.first()
    const correction = print.last()
    const before = await preview.innerText()
    assert.equal(await page.getByLabel('Figure et symétrie', { exact: true }).count(), 0)
    assert.equal(await preview.locator('.coord-hit').count(), 0)
    await button(page, 'Mode libre').click()
    const editor = panel.getByRole('region', { name: 'Figure et symétrie', exact: true })
    await editor.waitFor()
    assert.equal(await preview.innerText(), before)
    assert.equal(await button(panel, 'Valider les changements').count(), 0)
    assert(await preview.locator('.coord-hit').count() > 0)

    const firstX = field(editor, 'Sommet A', 'Abscisse')
    await firstX.fill('200')
    assert.equal(await firstX.getAttribute('aria-invalid'), 'true')
    assert.equal(await preview.innerText(), before)
    await firstX.fill('-4')
    assert.equal(await firstX.getAttribute('aria-invalid'), 'false')
    if (axial) {
      await button(editor, 'Ordonnées (Oy)').click()
      assert.match(await subject.textContent(), /ordonnées \(Oy\)/)
    } else {
      await field(editor, 'Centre Ω', 'Abscisse').fill('2')
      assert.match(await subject.textContent(), /centre Ω\(2\s*;\s*0\)/)
    }

    const vertex = correction.locator('text.point-label').filter({ hasText: /^A′$/ })
    assert.equal(await vertex.count(), 1)
    assert.equal(await subject.locator('text.point-label').filter({ hasText: /^A′$/ }).count(), 0)
    if (placer) {
      const firstAnswer = correction.locator('.coord-transform-col').last().locator('li').first()
      assert.match(await firstAnswer.textContent(), axial ? /A′\(4\s*;\s*−1\)/ : /A′\(8\s*;\s*1\)/)
    }

    const vertices = panel.getByRole('spinbutton', { name: 'Nombre de sommets', exact: true })
    await vertices.fill('5')
    await editor.getByRole('group', { name: 'Sommet E', exact: true }).waitFor()
    assert.equal(await firstX.inputValue(), '-4')
    await button(page, 'Annuler').click()
    assert.equal(await editor.getByRole('group', { name: 'Sommet E', exact: true }).count(), 0)
    assert.equal(await firstX.inputValue(), '-4')

    if (!placer) {
      const previewGrid = preview.locator('svg.coord-grid')
      const hit = (x, y) => previewGrid.locator('circle.coord-hit').nth((x + 12) * 25 + y + 12)
      if (!axial) {
        await button(editor, 'Centre Ω').click()
        await hit(3, 0).click()
        assert.equal(await field(editor, 'Centre Ω', 'Abscisse').inputValue(), '3')
        await button(page, 'Annuler').click()
        await button(editor, 'Sommets').click()
      }
      await hit(0, -4).click()
      assert.equal(await field(editor, 'Sommet E', 'Ordonnée').inputValue(), '-4')
      await hit(0, -4).click()
      assert.equal(await editor.getByRole('group', { name: 'Sommet E', exact: true }).count(), 0)
      assert.equal(await vertices.inputValue(), '4')
    }

    await editor.getByText('Dimensions et graduation du repère', { exact: true }).click()
    const grid = subject.locator('svg.coord-grid').first()
    const widthBefore = parseFloat(await grid.getAttribute('width'))
    await button(editor.getByRole('group', { name: 'Côté du carré', exact: true }), '5 mm').click()
    assert.equal(parseFloat(await grid.getAttribute('width')) - widthBefore, 24)
    await button(page, 'Fermer le mode libre').click()
    assert.match(await subject.textContent(), axial ? /ordonnées \(Oy\)/ : /centre Ω\(2\s*;\s*0\)/)
    assert.equal(await preview.locator('.coord-hit').count(), 0)
    await page.emulateMedia({ media: 'print' })
    const renderedMm = await grid.evaluate((svg) => svg.getBoundingClientRect().width * 25.4 / 96)
    assert(Math.abs(renderedMm - (widthBefore + 24)) < 0.6)
    await page.close()
  }
  const automatic = await open(context, 'transformations-axiale-figure', true)
  const autoPreview = automatic.locator('.a4-frame .worksheet-sheet').first()
  const initial = await autoPreview.innerText()
  await button(automatic, 'Mode libre').click()
  assert.equal(await autoPreview.innerText(), initial)
  await button(automatic, initial.includes('(Ox)') ? 'Ordonnées (Oy)' : 'Abscisses (Ox)').click()
  assert.match(await autoPreview.innerText(), initial.includes('(Ox)') ? /\(Oy\)/ : /\(Ox\)/)
  await button(automatic, 'Annuler').click()
  assert.equal(await autoPreview.innerText(), initial)
  await context.close()
  console.log('Quatre symétries A4 testées en édition directe, avec correction, annulation et dimensions imprimées.')
} finally {
  await browser?.close()
  await server?.close()
}
