import { setTimeout as delay } from 'node:timers/promises'

/** Playwright's synchronous predicate poll treats a Promise as truthy, even
 * when it later resolves false. Await each storage read on the test side.
 * The deadline uses Node's real clock, independent of a frozen page clock. */
export async function waitForBrowserValue(page, read, timeout = 30000) {
  const deadline = performance.now() + timeout
  do {
    const value = await page.evaluate(read)
    if (value) return value
    await delay(50)
  } while (performance.now() < deadline)
  throw new Error('La donnée attendue n’a pas été enregistrée dans le navigateur avant le délai de test.')
}

/** Exercise the teacher confirmation; Solo keeps its direct Skip action. */
export async function skipQuestion(page) {
  const solo = await page.locator('.ci-solo-session').count() > 0
  await page.getByRole('button', { name: 'Passer', exact: true }).click()
  if (!solo) await page.getByRole('dialog', { name: /Passer (cette question|ces deux questions) \?/ }).getByRole('button', { name: 'Passer sans correction', exact: true }).click()
}
