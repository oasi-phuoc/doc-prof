import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Register individually reviewed generations without changing the shared TCF bank.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'docs/gallery/complements-20261116.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex')
const dimensions = file => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', file], { encoding: 'utf8' })).streams[0]
let added = 0
for (const job of manifest.jobs) {
  const reviewPath = path.join(root, 'docs/gallery/generation-20261116', job.id + '.json')
  if (!existsSync(reviewPath)) continue
  const review = JSON.parse(readFileSync(reviewPath, 'utf8'))
  if (review.status !== 'visually_reviewed') continue
  if (!review.review_note || !review.reviewer || !existsSync(review.source_png)) throw new Error(`Missing review or original: ${job.id}`)
  for (const key of ['id', 'label', 'type', 'path']) if (review[key] !== job[key]) throw new Error(`Inconsistent ${key}: ${job.id}`)
  const target = path.join(root, 'public', job.path)
  const previous = manifest.images.find(image => image.id === job.id)
  if (previous) {
    if (hash(target) !== previous.sha256 || hash(review.source_png) !== previous.source_sha256) throw new Error(`Modified approved image: ${job.id}`)
    continue
  }
  const { width, height } = dimensions(review.source_png)
  if (width < 1200 || height < 900 || Math.abs(width / height - 4 / 3) > .002) throw new Error(`Expected large 4:3 illustration: ${job.id}`)
  if (existsSync(target)) throw new Error(`Refusing to replace existing file: ${job.path}`)
  mkdirSync(path.dirname(target), { recursive: true })
  // Format conversion only: preserve the full original canvas and dimensions.
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', review.source_png, '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-frames:v', '1', target])
  const output = dimensions(target)
  if (output.width !== width || output.height !== height) throw new Error(`Unexpected dimension change: ${job.id}`)
  const subject = manifest.subjects.find(subject => subject.job === job.id)
  if (!subject) throw new Error(`Missing subject: ${job.id}`)
  const record = { ...review, aliases: subject.aliases, subtype: ({ Fruit: 'Fruits', Légume: 'Légumes', Plat: 'Plats', Véhicule: 'Véhicules' })[job.type], width, height, bytes: statSync(target).size, sha256: hash(target), source_sha256: hash(review.source_png), reference_sha256: hash(review.reference), conversion: 'PNG to WebP, quality 90; no crop or resize' }
  manifest.images.push(record)
  Object.assign(job, { status: 'visually_reviewed', source_png: review.source_png, sha256: record.sha256 })
  Object.assign(subject, { status: 'visually_reviewed', path: job.path, sha256: record.sha256 })
  added++
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`${added} illustrations added; ${manifest.images.length}/${manifest.jobs.length} individually reviewed generations registered.`)
