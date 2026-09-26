/**
 * Génère src/jeux/lecture-bank.ts depuis public/assets/words/lecture
 * et répartit les mots dans les thèmes français (par correspondance de label).
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.')
const LECTURE_DIR = path.join(ROOT, 'public/assets/words/lecture')
const BANKS_DIR = path.join(ROOT, 'src/francais/vocab-banks')
const OUT = path.join(ROOT, 'src/jeux/lecture-bank.ts')

function slugLabel(filename) {
  return filename.replace(/\.webp$/i, '')
}

function loadThemeLabels() {
  /** @type {Map<string, string>} label → topicId */
  const map = new Map()
  if (!fs.existsSync(BANKS_DIR)) return map
  for (const file of fs.readdirSync(BANKS_DIR)) {
    if (!file.startsWith('fr-') || !file.endsWith('.ts')) continue
    const topicId = file.replace(/\.ts$/, '')
    const src = fs.readFileSync(path.join(BANKS_DIR, file), 'utf8')
    for (const m of src.matchAll(/"label":"((?:\\.|[^"\\])*)"/g)) {
      const label = m[1].replace(/\\"/g, '"').toLowerCase()
      if (!map.has(label)) map.set(label, topicId)
    }
  }
  return map
}

const themeByLabel = loadThemeLabels()
const files = fs
  .readdirSync(LECTURE_DIR)
  .filter((f) => f.toLowerCase().endsWith('.webp'))
  .sort((a, b) => a.localeCompare(b, 'fr'))

const words = files.map((file) => {
  const label = slugLabel(file)
  const topicId = themeByLabel.get(label.toLowerCase()) ?? null
  return {
    id: `lecture-${label
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}`,
    label,
    imageSrc: `/assets/words/lecture/${file}`,
    topicId,
  }
})

const byTopic = {}
for (const w of words) {
  const key = w.topicId ?? 'autres'
  if (!byTopic[key]) byTopic[key] = []
  byTopic[key].push(w)
}

const lines = []
lines.push(`/** Banque images/mots lecture (soutien-scolaire) — générée. */`)
lines.push(`export type LectureWord = {`)
lines.push(`  id: string`)
lines.push(`  label: string`)
lines.push(`  imageSrc: string`)
lines.push(`  topicId: string | null`)
lines.push(`}`)
lines.push('')
lines.push(`export const LECTURE_WORDS: LectureWord[] = ${JSON.stringify(words)}`)
lines.push('')
lines.push(`export const LECTURE_WORDS_BY_TOPIC: Record<string, LectureWord[]> = ${JSON.stringify(byTopic)}`)
lines.push('')
lines.push(`export function lectureWordsForTopic(topicId?: string): LectureWord[] {`)
lines.push(`  if (!topicId || topicId === 'tous') return LECTURE_WORDS`)
lines.push(`  return LECTURE_WORDS_BY_TOPIC[topicId] ?? []`)
lines.push(`}`)
lines.push('')

fs.writeFileSync(OUT, lines.join('\n'))
const assigned = words.filter((w) => w.topicId).length
console.log(`lecture-bank: ${words.length} mots, ${assigned} rattachés à un thème FR`)
