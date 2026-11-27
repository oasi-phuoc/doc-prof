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
  await context.close()
  console.log('Huit types d’opérations en ligne, recalcul et division par zéro vérifiés.')
} finally {
  await browser?.close()
  await server?.close()
}
