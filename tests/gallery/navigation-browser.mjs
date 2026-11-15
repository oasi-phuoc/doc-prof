import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5195'
const server = await createServer({ cacheDir: '/tmp/catalogue-menu-browser-vite', server: { host: '127.0.0.1', port: 5195, strictPort: true } })
await server.listen()
const results = [], navigations = [], errors = []
let browser
try {
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    for (const route of ['images', 'audios', 'fiches', 'generateur']) {
      const visit = async () => {
        await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' })
        await page.getByRole('button', { name: 'Catalogue', exact: true }).waitFor()
      }
      await visit()
      const catalogue = page.getByRole('button', { name: 'Catalogue', exact: true })
      const settings = page.getByRole('button', { name: 'Paramètres', exact: true })
      assert.equal((await catalogue.textContent()).trim(), '', 'The catalogue trigger is an icon')
      assert.equal((await settings.textContent()).trim(), '', 'The settings trigger is an icon')
      const cb = await catalogue.boundingBox(), sb = await settings.boundingBox()
      assert(cb && sb && cb.x >= 0 && sb.x + sb.width <= width + 1)
      assert(cb.x + cb.width <= sb.x + 1 && Math.abs(cb.y - sb.y) < 2, 'Catalogue sits immediately left of settings')
      assert.equal(await page.getByRole('button', { name: 'Catalogue des fiches', exact: true }).count(), 0)
      await catalogue.focus(); await catalogue.press('ArrowDown')
      const menu = page.getByRole('menu', { name: 'Catalogue', exact: true })
      await menu.waitFor()
      const items = menu.getByRole('menuitem')
      assert.equal(await items.count(), 3)
      assert.equal(await items.nth(0).evaluate(node => node === document.activeElement), true)
      await page.keyboard.press('ArrowDown')
      assert.equal(await items.nth(1).evaluate(node => node === document.activeElement), true)
      await page.keyboard.press('End')
      assert.equal(await items.nth(2).evaluate(node => node === document.activeElement), true)
      await page.keyboard.press('Escape')
      assert.equal(await menu.count(), 0)
      assert.equal(await catalogue.evaluate(node => node === document.activeElement), true)
      await catalogue.click(); await menu.waitFor()
      const mb = await menu.boundingBox()
      assert(mb && mb.x >= 0 && mb.x + mb.width <= width + 1 && mb.y + mb.height <= 1000)
      await page.locator('header.topbar').screenshot({ path: `/tmp/catalogue-menu-${route}-${width}.png` })
      await page.mouse.click(width - 3, 350)
      assert.equal(await menu.count(), 0)
      await settings.click()
      const panel = route === 'generateur' ? page.getByRole('menu', { name: 'Paramètres', exact: true }) : page.getByRole('dialog', { name: 'Paramètres', exact: true })
      await panel.waitFor()
      if (route === 'images' || route === 'audios') assert.equal(await page.getByRole('button', { name: 'Se déconnecter', exact: true }).count(), 0)
      if (route !== 'generateur') {
        const slider = panel.locator('input[type="range"]')
        const previous = Number(await slider.inputValue())
        await slider.focus(); await slider.press(previous < 24 ? 'ArrowRight' : 'ArrowLeft')
        assert.equal(await page.evaluate(() => localStorage.getItem('clairfle-base-font-size')), String(previous < 24 ? previous + 1 : previous - 1))
        await slider.press(previous < 24 ? 'ArrowLeft' : 'ArrowRight')
      }
      await page.keyboard.press('Escape')
      results.push({ route: `/${route}`, viewport_width: width, catalogue_icon: true, left_of_settings: true, menu_items: 3, keyboard_and_escape: true, outside_click_closes: true, menu_inside_viewport: true, settings_open: true })
      for (const [target, label] of [['fiches', 'Catalogue des fiches'], ['images', 'Catalogue des images'], ['audios', 'Catalogue des audios']]) {
        await visit(); await catalogue.click()
        await page.getByRole('menuitem', { name: label, exact: true }).click()
        await page.waitForURL(`${base}/${target}`)
        await page.getByRole('button', { name: 'Catalogue', exact: true }).waitFor()
        assert.equal(await page.getByRole('menu', { name: 'Catalogue', exact: true }).count(), 0)
        assert((await context.cookies()).some(cookie => cookie.name === 'clairfle-fiche-access' && cookie.value === 'admin'))
        navigations.push({ from: `/${route}`, to: `/${target}`, viewport_width: width, session_preserved: true })
      }
    }
    await context.close()
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/tcf/catalogue-menu-20261115-browser.json', JSON.stringify({ date: '2026-11-15', results, navigations, errors }, null, 2) + '\n')
  console.log(JSON.stringify({ headers: results.length, navigations: navigations.length, errors }))
} finally { await browser?.close(); await server.close() }
