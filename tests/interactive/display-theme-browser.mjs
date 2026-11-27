import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { gameControl, chooseSixCards, waitForBrowserValue } from './browser-actions.mjs'

const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })

const contrast = (text, background) => {
  const luma = rgb => rgb.match(/\d+/g).slice(0, 3).reduce((sum, channel, index) => {
    const s = Number(channel) / 255
    return sum + [0.2126, 0.7152, 0.0722][index] * (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4)
  }, 0)
  const [dark, light] = [luma(text), luma(background)].sort((a, b) => a - b)
  return (light + 0.05) / (dark + 0.05)
}
const colors = locator => locator.evaluateAll(elements => elements.map(element => {
  const style = getComputedStyle(element)
  return [style.color, style.backgroundColor]
}))
async function auditContrast(page) {
  const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  assert.deepEqual(result.violations.map(rule => rule.nodes.map(node => node.target)), [])
}

try {
  for (const [width, height, mode] of [[1366, 768, 'class'], [390, 844, 'solo']]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(mode => {
      sessionStorage.setItem('clairfle.interactive.mode.v1', mode)
      localStorage.setItem('clairfle.interactive.timer.v1', JSON.stringify({ enabled: mode === 'class', seconds: 90, feedbackSeconds: 5 }))
    }, mode)
    const page = await context.newPage()
    page.setDefaultTimeout(30_000)
    await page.goto(`${base}/interactif/demo`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120_000 })
    await page.getByRole('button', { name: /^Préparer la séance/ }).click()
    const theme = page.getByRole('combobox', { name: 'Thème', exact: true })
    assert.equal(await theme.inputValue(), 'light')
    await page.getByText('Ordre des questions et préréglages', { exact: true }).click()
    const choiceCount = page.getByRole('combobox', { name: 'Nombre maximal de choix', exact: true })
    assert.equal(await choiceCount.inputValue(), '3')
    await choiceCount.selectOption('6')
    assert.equal(await choiceCount.inputValue(), '6')
    await choiceCount.selectOption('3')
    await theme.selectOption('dark')
    const badgeSetting = page.getByRole('checkbox', { name: 'Proposer le badge « Bien expliqué »', exact: true })
    if (mode === 'class') {
      assert.equal(await badgeSetting.isChecked(), false)
      await badgeSetting.check()
    } else assert.equal(await badgeSetting.count(), 0)
    await auditContrast(page)
    await waitForBrowserValue(page, async () => {
      const { requestLocal } = await import('/src/interactive/storage.ts')
      const preferences = (await requestLocal('settings', 'readonly', store => store.get('classroom')))?.settings
      const expectedBadge = sessionStorage.getItem('clairfle.interactive.mode.v1') === 'class'
      return preferences?.theme === 'dark' && (!expectedBadge || preferences.teacherBadges === true)
    })
    await page.reload()
    await page.locator('.ci-app.ci-dark').first().waitFor()
    await page.locator('.ci-launch:enabled').click()
    await page.locator('.ci-answer > .ci-card-badge').first().waitFor()
    assert.equal(await page.locator('.ci-answer').count(), 3)
    const palette = () => colors(page.locator('.ci-answer > .ci-card-badge'))
    const darkColors = await palette()
    for (const [ink, surface] of darkColors) assert.ok(contrast(ink, surface) >= 4.5)
    const [[paperText]] = await colors(page.locator('.ci-app.ci-dark').first())
    assert.equal(paperText, 'rgb(245, 247, 252)')
    await auditContrast(page)
    const dark = gameControl(page, 'Thème sombre')
    await dark.focus()
    await page.keyboard.press('Space')
    await page.waitForFunction(() => !document.querySelector('.ci-app.ci-dark'))
    assert.deepEqual(await palette(), darkColors)
    const high = gameControl(page, 'Contraste')
    await high.click()
    await page.locator('.ci-app.ci-high-contrast').first().waitFor()
    assert.equal(await page.locator('.ci-answer').first().evaluate(element => getComputedStyle(element).borderTopWidth), '4px')
    await dark.click()
    await page.locator('.ci-app.ci-dark').first().waitFor()
    assert.equal(await high.getAttribute('aria-pressed'), 'false')
    const badge = page.getByRole('button', { name: 'Bien expliqué', exact: true })
    assert.equal(await badge.count(), 0)
    if (mode === 'class') {
      const mask = gameControl(page, 'Masquer l’écran')
      const maskDialog = page.getByRole('dialog', { name: 'Écran masqué', exact: true })
      const timer = page.locator('.ci-timer-value')
      await mask.click()
      await maskDialog.waitFor()
      const accessibility = await context.newCDPSession(page)
      const { nodes } = await accessibility.send('Accessibility.getFullAXTree')
      assert.ok(nodes.every(node => node.ignored || node.role?.value !== 'heading'))
      await accessibility.detach()
      assert.equal(await maskDialog.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(0, 0, 0)')
      const time = await timer.textContent()
      await page.waitForTimeout(1_100)
      assert.equal(await timer.textContent(), time)
      await page.keyboard.press('Escape')
      await maskDialog.waitFor({ state: 'hidden' })
      assert.equal(await mask.evaluate(element => document.activeElement === element), true)
      await mask.click()
      await maskDialog.getByRole('button', { name: 'Afficher la séance' }).click()
      await maskDialog.waitFor({ state: 'hidden' })
      assert.equal(await page.getByRole('button', { name: 'Options du jeu', exact: true }).evaluate(element => document.activeElement === element), true)
      await gameControl(page, 'Signal : levez vos cartes').click()
      await gameControl(page, 'Discuter').click()
      await gameControl(page, 'Enseignant : révéler').click()
      await badge.click()
      assert.equal(await badge.getAttribute('aria-pressed'), 'true')
      await auditContrast(page)
      await gameControl(page, 'Terminer la séance').click()
      await gameControl(page, 'Terminer et voir le bilan').click()
      assert.equal(await badge.getAttribute('aria-pressed'), 'true')
      await badge.click()
      assert.equal(await badge.getAttribute('aria-pressed'), 'false')
    }
    await waitForBrowserValue(page, async () => {
      const { requestLocal } = await import('/src/interactive/storage.ts')
      return (await requestLocal('settings', 'readonly', store => store.get('classroom')))?.settings?.theme === 'dark'
    })
    await page.goto(`${base}/interactif/rejoindre`)
    await page.locator('.ci-competition.ci-dark').waitFor()
    await auditContrast(page)
    if (mode === 'class') {
      await page.goto(`${base}/interactif/cartes`)
      const cards = page.getByRole('combobox', { name: 'Cartes par jeu', exact: true })
      assert.equal(await cards.inputValue(), '3')
      const slots = side => page.locator(`.ci-card-sheet[data-side="${side}"] .ci-paper-card`).evaluateAll(nodes => nodes.map(node => node.dataset.cardSlot))
      assert.deepEqual(await slots('front'), ['A', 'B', 'C'])
      assert.deepEqual(await slots('back'), ['B', 'A', 'C'])
      await page.emulateMedia({ media: 'print' })
      const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true })
      assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length, 2)
      await page.emulateMedia({ media: 'screen' })
      const binding = page.getByRole('combobox', { name: 'Retournement recto verso', exact: true })
      await binding.selectOption('short')
      assert.deepEqual(await slots('back'), ['C', 'A', 'B'])
      await binding.selectOption('long')
      await cards.selectOption('6')
      assert.deepEqual(await slots('front'), ['A', 'B', 'C', 'D', 'E', 'F'])
      assert.deepEqual(await slots('back'), ['B', 'A', 'D', 'C', 'F', 'E'])
      await page.goto(`${base}/interactif/demo`)
      await page.locator('.ci-launch:enabled').waitFor()
      await chooseSixCards(page)
      await page.locator('.ci-launch:enabled').click()
      await page.locator('.ci-answer').first().waitFor()
      assert.equal(await page.locator('.ci-answer').count(), 6)
    }
    await context.close()
    console.log(`${mode} ${width}×${height} : thème, clavier, contraste des cartes, persistance et compétition vérifiés${mode === 'class' ? ', ainsi que le masquage de la projection et le badge dans le bilan' : ''}.`)
  }
} finally {
  await browser.close()
}
