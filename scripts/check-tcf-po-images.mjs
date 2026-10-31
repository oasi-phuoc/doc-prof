import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename } from 'node:path'
import { createServer } from 'vite'

const manifest = JSON.parse(readFileSync('public/lib/images/tcf/po/illustrations-manifest.json', 'utf8'))
const byPath = new Map(manifest.images.map((image) => [image.path, image]))
assert.equal(byPath.size, manifest.images.length, 'one final file per image')
assert.equal(manifest.images.length, 407, '308 A1 images and 99 A2 images')
const hashes = new Set()
const counts = { generated: 0, prepared: 0, pending: 0 }
for (const image of manifest.images) {
  assert.equal(basename(image.original), basename(image.path), 'original filename retained')
  assert.match(image.path, /^\/lib\/images\/tcf\/po\/a[12]\/[^/]+\.webp$/)
  assert.ok(Object.hasOwn(counts, image.status), image.path)
  counts[image.status]++
  const bytes = readFileSync(`public${image.path}`)
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', image.path)
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', image.path)
  const hash = createHash('sha256').update(bytes).digest('hex')
  assert.equal(hash, image.sha256, image.path)
  if (image.status === 'generated') {
    assert.equal(image.visual_reviewed, true, image.path)
    assert.ok(image.width >= 1200 && image.width > image.height, image.path)
    assert.notEqual(hash, image.original_sha256, 'image fully regenerated')
    assert.ok(!hashes.has(hash), `duplicate image: ${image.path}`)
    hashes.add(hash)
    if (image.level === 'a1') assert.equal(image.sequence_reviewed, true, image.path)
  } else {
    assert.equal(hash, image.original_sha256, 'unfinished series retains its original images')
  }
  if (image.status === 'prepared') {
    assert.match(image.prepared_path, /^\/lib\/images\/tcf\/po\/pending\/a[12]\//)
    assert.equal(basename(image.prepared_path), basename(image.path))
    const pending = readFileSync(`public${image.prepared_path}`)
    const preparedHash = createHash('sha256').update(pending).digest('hex')
    assert.equal(preparedHash, image.prepared_sha256)
    assert.notEqual(preparedHash, image.original_sha256)
    assert.ok(!hashes.has(preparedHash), image.prepared_path)
    hashes.add(preparedHash)
    assert.ok(image.prepared_width >= 1200 && image.prepared_width > image.prepared_height)
  }
  if (image.level === 'a2') assert.equal(image.mode, 'new-scene', image.path)
}
assert.deepEqual(counts, manifest.counts)
if (process.argv.includes('--complete')) assert.equal(counts.generated, 407, 'regeneration is still incomplete')

let exercises = 0
for (const [level, folder, count] of [['a0-a1', 'a1', 76], ['a1-a2', 'a2', 99]]) {
  const bank = JSON.parse(readFileSync(`src/tcf/content/${level}/po.json`, 'utf8'))
  const illustrated = bank.filter((exercise) => exercise.type_exercice === 'image_interaction')
  assert.equal(illustrated.length, count)
  for (const exercise of illustrated) {
    const paths = exercise.support.images
    assert.equal(paths.length, folder === 'a1' ? 4 : 1, exercise.id)
    const series = paths.map((path) => byPath.get(path))
    if (folder === 'a1') {
      const published = series.filter((image) => image?.status === 'generated').length
      assert.ok(published === 0 || published === 4, `partial cast replacement: ${exercise.id}`)
    }
    series.forEach((image, i) => {
      assert.ok(image, paths[i])
      assert.equal(image.exercise, exercise.id)
      assert.equal(image.level, folder)
      assert.equal(image.step, i + 1)
      if (folder === 'a1') {
        assert.equal(image.casting, series[0].casting, 'same cast across the sequence')
        assert.equal(image.story, series[0].story)
      }
    })
    exercises++
  }
  assert.equal(readdirSync(`public/lib/images/tcf/po/${folder}`).filter((file) => file.endsWith('.webp')).length,
    folder === 'a1' ? 308 : 99)
  assert.ok(!existsSync(`public/lib/images/comprehension/po-${folder}`), 'old image folder removed')
}
const grammar = readFileSync('src/grammaire/exercises/qui-suis-je.ts', 'utf8')
for (let i = 1; i <= 4; i++) assert.ok(grammar.includes(`/lib/images/tcf/po/a1/classe-presentation-${i}.webp`))

// An existing saved worksheet must resolve the moved files too.
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { tcfImageSrc } = await vite.ssrLoadModule('/src/tcf/media.ts')
  for (const image of manifest.images) {
    assert.equal(tcfImageSrc(image.original), image.path)
    assert.equal(tcfImageSrc(image.original.slice('/lib/images/'.length)), image.path)
    assert.equal(tcfImageSrc(image.path), image.path)
  }
  for (const value of ['', null, undefined]) assert.equal(tcfImageSrc(value), '')
  for (const value of ['data:image/webp;base64,AAAA', 'https://example.org/picture.webp', '/lib/images/vocabulaire/cuisine/bol.webp']) {
    assert.equal(tcfImageSrc(value), value)
  }
} finally {
  await vite.close()
}
console.log(`PO verified: ${exercises} exercises, ${manifest.images.length} moved images, ${counts.generated} redrawn images published, ${counts.prepared} prepared, ${counts.pending} awaiting generation; legacy paths resolved`)
