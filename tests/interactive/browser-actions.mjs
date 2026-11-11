/** Exercise the teacher confirmation; Solo keeps its direct Skip action. */
export async function skipQuestion(page) {
  const solo = await page.locator('.ci-solo-session').count() > 0
  await page.getByRole('button', { name: 'Passer', exact: true }).click()
  if (!solo) await page.getByRole('dialog', { name: /Passer (cette question|ces deux questions) \?/ }).getByRole('button', { name: 'Passer sans correction', exact: true }).click()
}
