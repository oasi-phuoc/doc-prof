import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
await test('vendored fonts match their provenance, licenses and 150 KiB total budget', async () => {
  const base = new URL('../../public/fonts/interface/', import.meta.url)
  const manifest = JSON.parse(await readFile(new URL('manifest.json', base), 'utf8'))
  let bytes = 0
  for (const font of manifest.fonts) {
    const data = await readFile(new URL(font.file, base))
    assert.equal(data.subarray(0, 4).toString(), 'wOF2')
    assert.equal(data.length, font.bytes)
    assert.equal(createHash('sha256').update(data).digest('hex'), font.sha256)
    assert.match(await readFile(new URL(`${font.family}-OFL.txt`, base), 'utf8'), /SIL OPEN FONT LICENSE/)
    bytes += data.length
  }
  assert.ok(bytes <= 150 * 1024)
  const css = await readFile(new URL('../../src/fonts.css', import.meta.url), 'utf8')
  assert.ok(!css.includes('https://'))
  for (const file of ['App.css', 'index.css']) assert.ok(!(await readFile(new URL(`../../src/${file}`, import.meta.url), 'utf8')).includes('fonts.googleapis.com'))
})
