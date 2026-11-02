#!/usr/bin/env node
/**
 * Read-only audit of stored TCF audio references. No network, DB access or writes.
 * Repository: node scripts/inventory-tcf-audio-storage.mjs
 * Export:     node scripts/inventory-tcf-audio-storage.mjs --input export.json
 * Accepts API {fiches:[]}, D1 JSON results, saved rows, recipes and exercises.
 * Only paths, identifiers, locations and counts are emitted; no recipe text.
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--input')) {
  process.stderr.write('Usage: node scripts/inventory-tcf-audio-storage.mjs [--input export.json]\n')
  process.exit(2)
}
const refs = []
const warnings = []
const audioKeys = new Set(['audio', 'audios', 'audioSrc', 'audioParts', 'tcfAudioSlots', 'optionAudioSrcs'])
const audioExtension = /\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#].*)?$/i
const isCo = (s) => /^(?:https?:\/\/[^/?#]+)?\/lib\/audio\/tcf\/co\//i.test(s)

function normalize(value) {
  const raw = value.trim()
  if (/^(?:data:|https?:\/\/|\/)/i.test(raw)) return raw
  return `/lib/audio/${raw}`
}

function add(raw, file, location, category, context, method) {
  if (typeof raw !== 'string' || !raw.trim()) return
  const audio = normalize(raw)
  const local = audio.startsWith('/lib/audio/') ? audio.split(/[?#]/)[0] : null
  refs.push({ file, location, category, method, audio, coProduction: isCo(audio), urlKind: /^https?:\/\//i.test(audio) ? 'external' : 'local',
    ...(context.ficheId ? { ficheId: context.ficheId } : {}),
    ...(context.exerciseId ? { exerciseId: context.exerciseId } : {}),
    ...(local ? { localExists: existsSync(resolve(root, `public${local}`)) } : {}),
  })
}

function walk(value, file, location, category, context = {}, inheritedKey = '') {
  if (typeof value === 'string') {
    if (inheritedKey === 'recipe') {
      try { walk(JSON.parse(value), file, `${location}::<json>`, category, context) }
      catch { warnings.push({ file, location, reason: 'recipe is not valid JSON' }) }
    } else if ((audioKeys.has(inheritedKey) && (audioExtension.test(value.trim()) || /^\/lib\/audio\//.test(value.trim()))) || isCo(value.trim()) || /^tcf\/co\/.+\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#].*)?$/i.test(value.trim())) {
      add(value, file, location, category, context, 'json-value')
    }
    return
  }
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, file, `${location}[${i}]`, category, context, inheritedKey))
    return
  }
  const next = { ...context }
  if (typeof value.id === 'string' && Object.hasOwn(value, 'recipe')) next.ficheId = value.id
  if (typeof value.id === 'string' && typeof value.competence === 'string' && value.support) next.exerciseId = value.id
  for (const [key, item] of Object.entries(value)) {
    const path = `${location}[${JSON.stringify(key)}]`
    if (isCo(key)) add(key, file, `${path}::<key>`, category, next, 'json-key')
    if (key === 'recipe' && typeof item !== 'string' && (item === null || typeof item !== 'object')) {
      warnings.push({ file, location: path, reason: 'recipe is not an object or JSON string' })
    }
    walk(item, file, path, category, next, key)
  }
}

function category(file) {
  if (/^src\/tcf\/content\/(?:a0-a1|a1-a2|a2-b1)\/(?:ce|co|pe|po)\.json$/.test(file)) return 'production-bank'
  if (/^src\/tcf\/content\//.test(file)) return 'runtime-audio-metadata'
  if (file.startsWith('src/')) return 'runtime-source'
  if (file.startsWith('tmp/')) return 'historical-worktree-snapshot'
  if (file.startsWith('scripts/')) return 'tooling-or-audit'
  if (file.startsWith('docs/')) return 'documentation-or-audit'
  if (file.startsWith('public/')) return 'media-metadata'
  return 'other-reference'
}

let filesInspected = 0
if (args.length) {
  const input = resolve(args[1])
  if (!/\.json$/i.test(input)) throw new Error('Only an explicit JSON export is supported')
  const value = JSON.parse(readFileSync(input, 'utf8'))
  walk(value, relative(process.cwd(), input), '$', 'provided-export')
  filesInspected = 1
} else {
  const git = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  if (git.status !== 0) throw new Error('git ls-files failed')
  const files = git.stdout.split('\0').filter((file) => file && /\.(?:json|ts|tsx|mjs|py|md)$/i.test(file)
    && /^(?:src|scripts|docs|public\/lib\/images|tmp)\//.test(file)
    && !file.split('/').includes('node_modules')
    && !file.includes('/.'))
  for (const file of files) {
    const text = readFileSync(resolve(root, file), 'utf8')
    filesInspected++
    if (file.endsWith('.json')) {
      try { walk(JSON.parse(text), file, '$', category(file)) }
      catch { warnings.push({ file, reason: 'file is not valid JSON' }) }
    } else {
      const pattern = /(?:\/lib\/audio\/)?tcf\/co\/[^\s'"`<>)\[\]{},;]+\.(?:mp3|wav|ogg|m4a|aac|flac)/g
      for (const match of text.matchAll(pattern)) {
        const line = text.slice(0, match.index).split('\n').length
        add(match[0], file, `line:${line}`, category(file), {}, 'literal-scan')
      }
    }
  }
}

const groups = {}
for (const row of refs) {
  const group = groups[row.category] ??= { references: 0, coReferences: 0, files: new Set(), audios: new Set(), coAudios: new Set() }
  group.references++
  group.files.add(row.file)
  group.audios.add(row.audio)
  if (row.coProduction) { group.coReferences++; group.coAudios.add(row.audio) }
}
const byAudio = new Map()
for (const row of refs.filter((ref) => ref.coProduction)) {
  const group = byAudio.get(row.audio) ?? { audio: row.audio, categories: new Set(), exerciseIds: new Set(), ficheIds: new Set(), references: 0 }
  group.references++
  group.categories.add(row.category)
  if (row.exerciseId) group.exerciseIds.add(row.exerciseId)
  if (row.ficheId) group.ficheIds.add(row.ficheId)
  byAudio.set(row.audio, group)
}
const arraySets = (obj) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value instanceof Set ? [...value].sort() : value]))
const result = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: args.length ? 'explicit-local-json-export' : 'tracked-repository-sources',
  liveDatabaseInspected: false,
  filesInspected,
  notes: [
    'No network requests or database reads/writes are performed.',
    'A repository reference is not proof of a live stored reference.',
    'Tooling, reports and historical snapshots must not be treated as production consumers.',
    'Non-JSON sources use a literal scan; dynamically constructed paths are not enumerated.',
    'coProduction matches the CO URL pathname, including absolute HTTP URLs; an external host is not verified or fetched.',
    'localExists checks checkout presence only; it does not decode audio or resolve Git LFS pointers.',
  ],
  summary: Object.fromEntries(Object.entries(groups).map(([key, group]) => [key, { references: group.references, coReferences: group.coReferences, files: group.files.size, uniqueAudios: group.audios.size, uniqueCoAudios: group.coAudios.size }])),
  sharedCoReferences: [...byAudio.values()].filter((row) => row.exerciseIds.size > 1 || row.categories.size > 1 || row.ficheIds.size > 1).map(arraySets).sort((a, b) => a.audio.localeCompare(b.audio)),
  references: refs,
  warnings,
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
