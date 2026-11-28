import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
const button = (scope, name) => scope.getByRole('button', { name, exact: true })
let browser

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: baseURL }])
  const variants = ['reperage-lire', 'reperage-placer', 'reperage-cadrans-lire', 'reperage-cadrans-placer', 'reperage-cadrans-libre']
  const fixtures = variants.map((exerciseType) => ({ exerciseType, domain: 'géométrie' }))
  fixtures.push({ exerciseType: 'reperage-cadrans-lire', domain: 'tpm' })
  for (const { exerciseType, domain } of fixtures) {
    const shapes = !exerciseType.includes('cadrans')
    const page = await context.newPage()
    await page.addInitScript(({ exerciseType, domain }) => history.replaceState({
      ...history.state,
      clairfleFiche: {
        id: 'repere-a4', name: 'Repérage témoin',
        recipe: {
          version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
          libreMode: false, libreSnapshot: null, printCorrections: true,
          pages: [{
            domain, topic: 'reperage', exerciseType, difficulty: 'moyen',
            count: 2, columns: 1, coordCols: 10, coordRows: 10,
          }],
        },
      },
    }, ''), { exerciseType, domain })
    await page.goto('/generateur')
    const printed = page.locator('.print-only-sheets .worksheet-sheet').last().locator('svg.coord-grid').first()
    const preview = page.locator('.a4-frame svg.coord-grid').first()
    await preview.waitFor()
    const marks = (grid) => shapes
      ? grid.locator('[data-coord-shape]').evaluateAll((nodes) => nodes.map((node) =>
        [node.getAttribute('data-coord-shape'), node.parentElement.getAttribute('data-coord-cell')]))
      : grid.locator('.point-label').evaluateAll((nodes) => nodes.map((node) =>
        [node.textContent, node.getAttribute('x'), node.getAttribute('y')]))
    const original = await marks(printed)
    assert(original.length >= 2)
    await button(page, 'Mode libre').click()
    const panel = page.locator('#activity-editor')
    assert.equal(await button(panel, 'Valider les changements').count(), 0)
    assert.deepEqual(await marks(printed), original)
    const composition = panel.getByRole('group', { name: shapes ? 'Mode du tableau' : 'Mode du repère', exact: true })
    await button(composition, 'Libre').click()
    assert.deepEqual(await marks(printed), original)

    if (exerciseType === 'reperage-lire') {
      const palette = panel.getByRole('listbox', { name: 'Formes à placer', exact: true })
      const used = new Set(original.map(([kind]) => kind))
      const available = [['triangle', 'triangle'], ['carré', 'square'], ['disque', 'circle']].find(([, kind]) => !used.has(kind))
      await palette.getByRole('option', { name: available[0], exact: true }).click()
      const empty = preview.locator('g[data-coord-cell]:not(:has([data-coord-shape]))').first()
      const cell = await empty.getAttribute('data-coord-cell')
      const target = preview.locator(`g[data-coord-cell="${cell}"]`)
      await target.locator('.coord-hit').click()
      assert.equal(await target.locator(`[data-coord-shape="${available[1]}"]`).count(), 1)
      assert.equal((await marks(printed)).length, 3)
      await target.locator('.coord-hit').click()
      assert.deepEqual(await marks(printed), original)
    }
    if (exerciseType === 'reperage-cadrans-lire') {
      const quantity = panel.getByRole('spinbutton', { name: 'Nombre de questions', exact: true })
      await quantity.fill('3')
      const grown = await marks(printed)
      assert.equal(grown.length, 3)
      assert.deepEqual(grown.slice(0, 2), original)
      await button(page, 'Annuler').click()
      assert.deepEqual(await marks(printed), original)
    }
    if (exerciseType === 'reperage-cadrans-libre') {
      const origin = panel.getByRole('group', { name: 'Outil de placement', exact: true })
      await button(origin, 'Origine').click()
      await panel.locator('.coord-axes-editor circle.coord-hit').first().click()
      assert.equal((await marks(printed)).length, original.length)
      await button(page, 'Annuler').click()
      assert.deepEqual(await marks(printed), original)
    }
    await button(page, 'Fermer le mode libre').click()
    assert.equal(await preview.locator('.coord-hit').count(), 0)
    await page.close()
  }
  await context.close()
  console.log('Repérages de Géométrie et TPM vérifiés en A4 avec maintien du tirage, quantité et annulation.')
} finally {
  await browser?.close()
  await server?.close()
}
