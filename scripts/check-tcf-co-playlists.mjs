import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { buildTcfCoPlaylist: build } = await vite.ssrLoadModule('/src/tcf/co-audio-playlist.ts')
  const dir = '/lib/audio/tcf/consignes/'
  const bip = `${dir}bip-d-annonce.mp3`
  for (const [kind, count, gap] of [
    ['six_courts', 6, 15], ['trois_moyens', 3, 15], ['association_images', 4, 15],
    ['complet', 1, 30], ['images_a_reconnaitre', 1, 15],
  ]) {
    const docs = Array.from({ length: count }, (_, i) => `/lib/audio/test-${i + 1}.mp3`)
    const urls = build(kind, docs)
    const sequence = docs.flatMap((doc, i) => [
      ...(count > 1 ? [`${dir}audio-numero-${i + 1}.mp3`] : []),
      bip, doc, `${dir}silence-${gap}s.mp3`,
      bip, doc, `${dir}silence-${gap}s.mp3`,
    ])
    assert.deepEqual(urls.slice(-sequence.length), sequence, `${kind}: numbered document, two listens with gaps, then next document`)
    assert.equal(urls.filter((u) => u.includes('/audio-numero-')).length, count > 1 ? count : 0)
    for (const url of urls.filter((u) => u.startsWith(dir))) assert.ok(existsSync(`public${url}`), `missing sequence asset: ${url}`)
  }
  assert.ok(!build('images_a_reconnaitre', ['  ']).some((u) => u === ''))
  assert.ok(!build('complet', []).some((u) => u.includes('/audio-numero-')))
  console.log('5 formats CO : ordre des deux écoutes, pauses, annonces uniques et fichiers vérifiés.')
} finally {
  await vite.close()
}
