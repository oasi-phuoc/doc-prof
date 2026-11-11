import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { paletteFingerprint, paletteContrast, contrastRatio, calibrationMatches } = await server.ssrLoadModule('/src/interactive/domain/calibration.ts')
  const { PALETTE, defaultShapes, inkForColor } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const colors = PALETTE.map((entry) => entry.color)
  await test('sRGB contrasts match reference values and default cards keep readable text and boundaries', () => {
    assert.equal(contrastRatio('#000000', '#FFFFFF'), 21)
    assert.equal(contrastRatio('#FFFFFF', '#FFFFFF'), 1)
    for (const ratio of paletteContrast(colors)) { assert.ok(ratio.text >= 7); assert.ok(ratio.outer >= 3); assert.ok(ratio.selection >= 3) }
  })
  await test('automatic ink and the double ring remain readable across the RGB cube and threshold grays', () => {
    for (let red = 0; red <= 255; red += 17) for (let green = 0; green <= 255; green += 17) for (let blue = 0; blue <= 255; blue += 17) {
      const color = `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`
      const ratio = paletteContrast([color])[0]
      assert.ok(ratio.text >= 4.5, `${color} ${inkForColor(color)} ${ratio.text}`)
      assert.ok(ratio.selection >= 3, color)
    }
    for (const color of ['#747474', '#757575', '#767676', '#777777']) assert.ok(contrastRatio(color, inkForColor(color)) >= 4.5)
  })
  await test('confirmation belongs to exact colors, shapes and palette version', () => {
    const stamp = { paletteVersion: 2, paletteHash: paletteFingerprint(colors, defaultShapes), confirmedAt: Date.now() }
    assert.equal(calibrationMatches(colors, defaultShapes, 2, stamp), true)
    assert.equal(calibrationMatches(colors.map((color) => color.toLowerCase()), defaultShapes, 2, stamp), true)
    assert.equal(calibrationMatches(colors, defaultShapes, 3, stamp), false)
    assert.equal(calibrationMatches(['#000000', ...colors.slice(1)], defaultShapes, 2, stamp), false)
    assert.equal(calibrationMatches(colors, [...defaultShapes].reverse(), 2, stamp), false)
    assert.equal(calibrationMatches(colors, defaultShapes, 2), false)
  })
} finally { await server.close() }
