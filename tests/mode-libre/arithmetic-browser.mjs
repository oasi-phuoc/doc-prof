import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser

const operations = [
  { topic: 'addition', op: '+', result: 15, later: 24 },
  { topic: 'soustraction', op: '−', result: 9, later: 18 },
  { topic: 'multiplication', op: '×', result: 36, later: 63 },
  { topic: 'division', op: '÷', result: 4, later: 7 },
]

function state({ topic, op, result }, hole) {
  const item = { layout: 'inline', a: 12, b: 3, result, op, missing: hole ? 'a' : 'result',
    prompt: `${hole ? '□' : 12} ${op} 3 = ${hole ? result : '□'}`, answer: String(hole ? 12 : result) }
  return {
    version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
    libreMode: false, libreSnapshot: null,
    pages: [{
      domain: 'algèbre', topic, exerciseType: topic + (hole ? '-trou' : '-ligne'),
      difficulty: 'moyen', count: 1, columns: 1, libreItems: [item],
    }],
  }
}

async function checkCalculation(context, operation, hole) {
  const page = await context.newPage()
  await page.addInitScript((recipe) => history.replaceState({
    ...history.state, clairfleFiche: { id: 'arithmetic-fixture', name: 'Calcul témoin', recipe },
  }, ''), state(operation, hole))
  const button = (name) => page.getByRole('button', { name, exact: true })
  try {
    await page.goto('/generateur')
    await button('Mode libre').click()
    assert.equal(await button('Valider les changements').count(), 0)
    await button('Fiche élève (cliquer pour corrigé)').click()
    const calculation = page.getByRole('group', { name: 'Calcul 1', exact: true })
    const updated = calculation.getByRole('textbox', { name: hole ? 'Résultat' : '1ʳᵉ', exact: true })
    const equation = page.locator('.a4-frame .eq-row').first()
    await updated.fill(String(hole ? operation.later : 21))
    assert.equal((await equation.innerText()).replace(/[^0-9+−×÷=]/g, ''), `21${operation.op}3=${operation.later}`)

    if (operation.op === '÷') {
      const divisor = calculation.getByRole('textbox', { name: '2ᵉ', exact: true })
      await divisor.fill('0')
      assert.equal(await divisor.getAttribute('aria-invalid'), 'true')
      assert.match(await calculation.getByRole('alert').innerText(), /diviseur/)
      assert.equal((await equation.innerText()).replace(/[^0-9÷=]/g, ''), '21÷3=7')
    }
  } finally {
    await page.close()
  }
}

async function checkDoubleA5(context) {
  const page = await context.newPage()
  const recipe = state(operations[0], false)
  recipe.sheetFormat = 'a5-double-landscape'
  recipe.pages[0].count = 2
  recipe.pages[0].libreItems = undefined
  recipe.pages[0].contentSeedTwin = 42
  await page.addInitScript((value) => history.replaceState({
    ...history.state, clairfleFiche: { id: 'a5-fixture', name: 'Calcul double A5', recipe: value },
  }, ''), recipe)
  const button = (name) => page.getByRole('button', { name, exact: true })
  const visible = (half) => page.locator(`.a4-frame .a5-half.is-${half} .eq-row`).allTextContents()
  try {
    await page.goto('/generateur')
    await button('Mode libre').click()
    await button('Fiche élève (cliquer pour corrigé)').click()
    const beforeLeft = await visible('left')
    const beforeRight = await visible('right')
    assert.equal(beforeLeft.length, 2)
    assert.equal(beforeRight.length, 2)
    await button('Droite').click()
    const first = page.getByRole('group', { name: 'Calcul 1', exact: true })
    await first.getByRole('textbox', { name: '1ʳᵉ', exact: true }).fill('321')
    const editedRight = await visible('right')
    assert.match(editedRight[0], /321/)
    assert.equal(editedRight[1], beforeRight[1])
    assert.deepEqual(await visible('left'), beforeLeft)
    await button('Annuler').click()
    assert.deepEqual(await visible('right'), beforeRight)
    await button('Rétablir').click()
    await button('Verrou de la question 1').click()
    await button('Fermer le mode libre').click()
    await button('Régénérer la mini-fiche de droite').click()
    await button('Fiche élève (cliquer pour corrigé)').click()
    assert.deepEqual(await visible('left'), beforeLeft)
    assert.equal((await visible('right'))[0], editedRight[0])
    assert.notEqual((await visible('right'))[1], editedRight[1])
    await button('Mode libre').click()
    await button('Gauche').click()
    await first.getByRole('textbox', { name: '1ʳᵉ', exact: true }).fill('123')
    assert.match((await visible('left'))[0], /123/)
    assert.equal((await visible('right'))[0], editedRight[0])
    await button('Fermer le mode libre').click()
    const print = await page.locator('.print-only-sheets .a5-half.is-right').last().textContent()
    assert.match(print, /321/)
  } finally {
    await page.close()
  }
}

async function checkStructuredCalculations(context) {
  const fixtures = [
    {
      config: { domain: 'algèbre', topic: 'division', exerciseType: 'division-colonne-poser', libreItems: [
        { layout: 'division-column', a: 12, b: 3, dividend: 12, divisor: 3, quotient: 4, op: '÷', blankOperands: true, answer: '4', prompt: '12 ÷ 3' },
      ] },
      async check(page) {
        const calculation = page.getByRole('group', { name: 'Calcul colonne 1', exact: true })
        await calculation.getByRole('textbox', { name: 'Premier nombre' }).fill('14')
        assert.equal(await calculation.getByRole('status', { name: 'Corrigé 1' }).textContent(), '4 reste 2')
        const grid = page.locator('.a4-frame .division-column').first()
        assert.match(await grid.innerText(), /14 ÷ 3/)
        const divisor = calculation.getByRole('textbox', { name: 'Second nombre' })
        await divisor.fill('0')
        assert.equal(await divisor.getAttribute('aria-invalid'), 'true')
        assert.match(await grid.innerText(), /14 ÷ 3/)
      },
    },
    {
      config: { domain: 'géométrie', topic: 'conversions', exerciseType: 'conversions-longueur', libreItems: [
        { layout: 'inline', convert: { value: '2', from: 'm', to: 'cm', family: 'longueur' }, prompt: '2 m =', answer: '200 cm' },
      ] },
      async check(page) {
        await page.getByRole('textbox', { name: 'Valeur 1', exact: true }).fill('2,5')
        const panel = page.getByRole('group', { name: 'Conversion 1', exact: true })
        assert.equal(await panel.getByRole('status', { name: 'Corrigé conversion 1' }).textContent(), '250 cm')
        const row = page.locator('.a4-frame .convert-row').first()
        assert.match(await row.innerText(), /2,5/)
        assert.doesNotMatch(await row.innerText(), /250/)
        await page.getByRole('button', { name: 'Fiche élève (cliquer pour corrigé)', exact: true }).click()
        assert.match(await row.innerText(), /250/)
      },
    },
  ]
  for (const { config, check } of fixtures) {
    const page = await context.newPage()
    const recipe = state(operations[0], false)
    recipe.pages = [{ ...recipe.pages[0], ...config }]
    await page.addInitScript((value) => history.replaceState({
      ...history.state, clairfleFiche: { id: 'structured-math-fixture', name: 'Calcul témoin', recipe: value },
    }, ''), recipe)
    try {
      await page.goto('/generateur')
      await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
      assert.equal(await page.getByRole('button', { name: 'Valider les changements', exact: true }).count(), 0)
      await check(page)
    } finally {
      await page.close()
    }
  }
}

async function checkBatch(context) {
  const page = await context.newPage()
  const recipe = state(operations[0], false)
  recipe.pages[0].count = 3
  recipe.pages[0].columns = 2
  recipe.pages[0].libreItems = [12, 24, 36].map((a) => ({
    layout: 'inline', a, b: 3, result: a + 3, op: '+', missing: 'result', prompt: `${a} + 3 = □`, answer: String(a + 3),
  }))
  recipe.pages[0].extraBlocks = [{ topic: 'soustraction', exerciseType: 'soustraction-ligne', count: 2, columns: 1, difficulty: 'moyen' }]
  await page.addInitScript((value) => history.replaceState({
    ...history.state, clairfleFiche: { id: 'batch-fixture', name: 'Sélection de calculs', recipe: value },
  }, ''), recipe)
  const button = (name) => page.getByRole('button', { name, exact: true })
  try {
    await page.goto('/generateur')
    await button('Mode libre').click()
    const pdfItems = page.locator('.print-only-sheets .eq-row')
    const initial = await pdfItems.allTextContents()
    const grids = page.locator('.a4-frame .exercise-grid')
    assert.equal(await grids.count(), 2)
    const secondarySpacing = await grids.nth(1).evaluate((grid) => getComputedStyle(grid).rowGap)
    await page.getByText('Espacement de l’activité', { exact: true }).click()
    await page.getByRole('combobox', { name: 'Entre les lignes de questions', exact: true }).selectOption('24')
    await page.getByRole('combobox', { name: 'Entre les colonnes', exact: true }).selectOption('20')
    assert.equal(await grids.first().evaluate((grid) => getComputedStyle(grid).rowGap), '24px')
    assert.equal(await grids.first().evaluate((grid) => getComputedStyle(grid).columnGap), '20px')
    assert.equal(await grids.nth(1).evaluate((grid) => getComputedStyle(grid).rowGap), secondarySpacing)
    assert.deepEqual(await pdfItems.allTextContents(), initial)
    await page.getByText('Sélectionner des questions', { exact: true }).click()
    const search = page.getByRole('searchbox', { name: 'Rechercher par numéro ou énoncé' })
    await search.fill('24 +')
    await button('Questions visibles').click()
    await page.getByText('1 sélectionnée sur 3', { exact: true }).waitFor()
    assert.deepEqual(await pdfItems.allTextContents(), initial)
    await search.fill('')
    await page.getByRole('checkbox', { name: 'Sélectionner la question 3', exact: true }).check()
    await button('Verrouiller la sélection').click()
    assert.equal(await button('Verrou de la question 1').getAttribute('aria-pressed'), 'false')
    assert.equal(await button('Verrou de la question 2').getAttribute('aria-pressed'), 'true')
    assert.equal(await button('Verrou de la question 3').getAttribute('aria-pressed'), 'true')
    await button('Annuler').click()
    assert.equal(await button('Verrou de la question 2').getAttribute('aria-pressed'), 'false')
    assert.equal(await button('Verrou de la question 3').getAttribute('aria-pressed'), 'false')
    await button('Régénérer la sélection déverrouillée').click()
    const changed = await pdfItems.allTextContents()
    assert.equal(changed[0], initial[0])
    assert.notDeepEqual(changed, initial)
    await button('Annuler').click()
    assert.deepEqual(await pdfItems.allTextContents(), initial)
  } finally {
    await page.close()
  }
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'partial', url: baseURL }])
  for (const operation of operations) {
    await checkCalculation(context, operation, false)
    await checkCalculation(context, operation, true)
  }
  await checkDoubleA5(context)
  await checkStructuredCalculations(context)
  await checkBatch(context)
  await context.close()
  console.log('Opérations en ligne et posées, divisions, conversions et édition indépendante des deux moitiés A5 vérifiées.')
} finally {
  await browser?.close()
  await server?.close()
}
