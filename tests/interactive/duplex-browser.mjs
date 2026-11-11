import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = []
const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < .2, `${label}: ${actual} / ${expected}`)
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/cartes`)
  await page.getByRole('heading', { name: 'Cartes de la classe', exact: true }).waitFor({ timeout: 120000 })
  const edgeControl = page.getByRole('combobox', { name: 'Retournement recto verso', exact: true })
  assert.equal(await edgeControl.inputValue(), 'long')
  // Custom colors and swapped shapes must use the identity of a card, not its position.
  await page.getByLabel('Couleur de la carte A', { exact: true }).fill('#123456')
  await page.waitForFunction(() => document.querySelector('.ci-paper-card').style.getPropertyValue('--card-color') === '#123456')
  await page.getByLabel('Forme de la carte A', { exact: true }).selectOption('star')
  await page.waitForFunction(() => document.querySelector('.ci-paper-card svg').getAttribute('aria-label').toLowerCase().includes('étoile'))
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await mkdir('docs/interactive/screenshots', { recursive: true })
  for (const edge of ['long', 'short']) {
    await edgeControl.selectOption(edge)
    for (const inkSaving of [false, true]) {
      await page.getByRole('checkbox', { name: 'Économiser l’encre', exact: true }).setChecked(inkSaving)
      for (const sets of [1, 2]) {
        await page.getByRole('spinbutton', { name: 'Jeux de cartes', exact: true }).fill(String(sets))
        await page.emulateMedia({ media: 'print' })
        const sheets = await page.locator('.ci-card-sheet').evaluateAll((sheets) => sheets.map((sheet) => {
          const bounds = sheet.getBoundingClientRect()
          return {
            side: sheet.dataset.side, set: Number(sheet.dataset.set), width: bounds.width, height: bounds.height,
            cards: [...sheet.querySelectorAll('.ci-paper-card')].map((card) => {
              const rect = card.getBoundingClientRect(), style = getComputedStyle(card)
              return { letter: card.dataset.cardSlot, text: card.textContent.trim(), shape: card.querySelector('svg').outerHTML,
                color: style.backgroundColor, pattern: style.backgroundImage, ink: getComputedStyle(card.querySelector('.ci-card-badge')).color,
                x: rect.x - bounds.x + rect.width / 2, y: rect.y - bounds.y + rect.height / 2, width: rect.width, height: rect.height }
            }),
          }
        }))
        assert.equal(sheets.length, sets * 2)
        for (let set = 0; set < sets; set++) {
          const front = sheets[set * 2], back = sheets[set * 2 + 1]
          assert.equal(front.side, 'front'); assert.equal(back.side, 'back')
          assert.equal(front.set, set + 1); assert.equal(back.set, set + 1)
          assert.equal(front.cards.length, 6); assert.equal(back.cards.length, 6)
          assert.equal(new Set(front.cards.map((card) => card.letter)).size, 6)
          near(front.width, 210 * 96 / 25.4, 'A4 width'); near(front.height, 297 * 96 / 25.4, 'A4 height')
          if (inkSaving) assert.equal(new Set(front.cards.map((card) => card.pattern)).size, 6)
          for (const card of front.cards) {
            const reverse = back.cards.find((other) => other.letter === card.letter)
            assert.ok(reverse)
            assert.equal(card.text, card.letter); assert.equal(reverse.text, card.letter)
            assert.equal(card.shape, reverse.shape); assert.equal(card.color, reverse.color)
            assert.equal(card.pattern, reverse.pattern); assert.equal(card.ink, reverse.ink)
            near(card.width, 88 * 96 / 25.4, '88 mm width'); near(card.height, card.width, 'square')
            near(reverse.width, card.width, 'same width'); near(reverse.height, card.height, 'same height')
            near(edge === 'long' ? front.width - reverse.x : reverse.x, card.x, 'aligned horizontal center')
            near(edge === 'short' ? front.height - reverse.y : reverse.y, card.y, 'aligned vertical center')
          }
          if (!inkSaving) assert.equal(front.cards[0].color, 'rgb(18, 52, 86)')
        }
        assert.equal(await page.locator('.ci-print-pages small').count(), 0)
        const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true,
          ...(edge === 'long' && !inkSaving && sets === 1 ? { path: 'docs/interactive/screenshots/cartes-recto-verso-a4.pdf' } : {}) })
        assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length, sets * 2)
        results.push({ flip: edge, inkSaving, sets, pages: sheets.length, squaresPerFace: 6,
          alignment: 'matching letter, shape, color and pattern at reflected A4 centers', captions: 'letters only' })
        await page.emulateMedia({ media: 'screen' })
      }
    }
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/interactive/duplex-results.json', JSON.stringify({ results, errors, limitation: 'PDF imposition verified; physical printer registration requires a paper test.' }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
