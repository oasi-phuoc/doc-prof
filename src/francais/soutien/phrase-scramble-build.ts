/**
 * Phrases illustratives pour le type 9 (mot dans la phrase).
 * Chaque phrase contient le mot cible une fois et maximise le son de la leçon.
 */
import { displayVocabLabel } from '@/francais/display-vocab-label'
import type { SoutienScramble } from './banks'

const NAMES = ['Léa', 'Noah', 'Sara', 'Adam', 'Inès', 'Liam', 'Maya', 'Yanis'] as const

/** Mots « bonus » pour densifier le son de la fiche dans la phrase. */
/** Adjectifs / modifieurs courts pour densifier le son (pas de noms). */
const SOUND_BONUS: Record<string, readonly string[]> = {
  '/a/': ['grand', 'malade', 'agréable', 'brave'],
  '/o/': ['joli', 'gros', 'rose', 'beau'],
  '/i/': ['petit', 'joli', 'vite', 'gris'],
  '/y/': ['dur', 'pur', 'sûr'],
  '/ə/': ['petit', 'ferme', 'jeune'],
  '/b/': ['beau', 'bon', 'blanc'],
  '/k/': ['court', 'calme', 'clair'],
  '/s/': ['simple', 'sage', 'souple'],
  '/d/': ['doux', 'dur', 'droit'],
  '/g/': ['grand', 'gai', 'gris'],
  '/ʒ/': ['jaune', 'joli', 'jeune', 'gentil'],
  '/p/': ['petit', 'propre', 'plein'],
  '/t/': ['tout', 'triste', 'tendre'],
  '/f/': ['fort', 'frais', 'fin'],
  '/l/': ['joli', 'léger', 'long', 'libre'],
  '/m/': ['même', 'mou', 'mature'],
  '/n/': ['nouveau', 'net', 'noble'],
  '/r/': ['rouge', 'rare', 'rond'],
  '/v/': ['vert', 'vive', 'vrai'],
  '/z/': ['rose', 'aise', 'bruisante'],
  '/w/': ['ouaté', 'ouaté'],
  '/ʃ/': ['riche', 'chaude', 'chère'],
  '/u/': ['lourd', 'doux', 'rouge'],
  '/wa/': ['froid', 'droit', 'étroite'],
  '/ɑ̃/': ['blanc', 'grand', 'content'],
  '/ɛ̃/': ['plein', 'fin', 'malin'],
  '/ɔ̃/': ['bon', 'rond', 'long'],
  '/ɲ/': ['mignon', 'gagnant'],
  '/j/': ['brillant', 'paresseux', 'joyeux'],
}

function isFeminine(word: string): boolean {
  const w = word.trim().toLowerCase()
  return (
    /e$|ion$|ette$|elle$|ance$|ence$|ure$|ade$|ise$|ine$|ille$|asse$|otte$|ière$/.test(w) &&
    !/age$|isme$|eau$|ou$/.test(w)
  )
}

function startsWithVowelSound(word: string): boolean {
  return /^[aeiouyàâäéèêëïîôöùûüh]/i.test(word.trim())
}

function artIndef(word: string): string {
  return isFeminine(word) ? 'une' : 'un'
}

function artDef(word: string): string {
  if (startsWithVowelSound(word)) return 'l’'
  return isFeminine(word) ? 'la' : 'le'
}

function pickBonus(phoneme: string, word: string, index: number): string {
  const list = SOUND_BONUS[phoneme] ?? ['joli', 'petit', 'grand']
  const lower = word.toLowerCase()
  const filtered = list.filter((b) => b.toLowerCase() !== lower && !lower.includes(b.toLowerCase()))
  const pool = filtered.length ? filtered : [...list]
  return pool[index % pool.length]!
}

function scrambleLetters(word: string): string {
  const letters = [...word.toLocaleUpperCase('fr-FR')].filter((ch) => /\p{L}/u.test(ch))
  if (letters.length < 2) return letters.join('')
  return [...letters.slice(1), letters[0]!].join('')
}

/** Assure que le mot apparaît exactement une fois. */
function embedWord(template: string, word: string): string | null {
  const marker = '«MOT»'
  if (!template.includes(marker)) return null
  const sentence = template.replace(marker, word)
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const matches = sentence.match(new RegExp(escaped, 'gi'))
  if (!matches || matches.length !== 1) return null
  return sentence
}

function withArt(art: string, wordMarker = '«MOT»'): string {
  return art === 'l’' ? `${art}${wordMarker}` : `${art} ${wordMarker}`
}

/**
 * Construit jusqu’à 3 phrases illustratives pour un mot (son densifié).
 */
export function buildPhrasesForWord(
  rawWord: string,
  phoneme: string,
  nameIndex = 0,
): string[] {
  const word = displayVocabLabel(rawWord)
  if (!word) return []
  const name = NAMES[nameIndex % NAMES.length]!
  const adj = pickBonus(phoneme, word, nameIndex)
  const adj2 = pickBonus(phoneme, word, nameIndex + 2)
  const indef = artIndef(word)
  const def = artDef(word)

  const templates = [
    `Sur l’image, on voit ${withArt(indef)}.`,
    `${name} regarde ${withArt(def)} ${adj}.`,
    `${def === 'l’' ? 'L’' : def === 'la' ? 'La ' : 'Le '}«MOT» ${adj} est sur la photo.`,
    `Voici ${withArt(indef)} ${adj2} sur l’image.`,
    `${name} montre ${withArt(def)} à la classe.`,
    `Dans l’image, ${withArt(def)} est bien ${adj}.`,
  ]

  if (phoneme === '/ʒ/') {
    templates.push(`Je vois déjà ${withArt(indef)} ${adj} sur l’image.`)
    templates.push(`${name} a toujours ${withArt(indef)} ${adj2}.`)
  }
  if (phoneme === '/a/') {
    templates.push(`À la maison, ${name} a ${withArt(indef)}.`)
  }
  if (phoneme === '/o/' || phoneme === '/ɔ̃/') {
    templates.push(`${name} trouve ${withArt(indef)} trop beau.`)
  }

  const out: string[] = []
  const seen = new Set<string>()
  for (const t of templates) {
    const sentence = embedWord(t, word)
    if (!sentence) continue
    const key = sentence.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(sentence)
    if (out.length >= 3) break
  }
  return out
}

/** Banque type 9 : plusieurs phrases par mot (variantes). */
export function buildScrambleBank(
  words: readonly string[],
  phoneme: string,
  maxWords = 28,
): SoutienScramble[] {
  const out: SoutienScramble[] = []
  const seenWord = new Set<string>()
  let wi = 0
  /** Priorité aux mots dont l’initiale rappelle le son (ex. j… pour /ʒ/). */
  const sorted = [...words].sort((a, b) => {
    const da = displayVocabLabel(a).toLowerCase()
    const db = displayVocabLabel(b).toLowerCase()
    const tip =
      phoneme === '/ʒ/'
        ? (w: string) => (w.startsWith('j') || w.startsWith('g') ? 0 : 1)
        : () => 0
    return tip(da) - tip(db) || da.localeCompare(db, 'fr')
  })
  for (const raw of sorted) {
    const word = displayVocabLabel(raw)
    const key = word.toLowerCase()
    if (!key || seenWord.has(key)) continue
    seenWord.add(key)
    const phrases = buildPhrasesForWord(raw, phoneme, wi)
    for (const sentence of phrases) {
      out.push({
        sentence,
        word,
        letters: scrambleLetters(word),
      })
    }
    wi += 1
    if (seenWord.size >= maxWords) break
  }
  return out
}

/** Slug fichier audio pour une phrase. */
export function phraseAudioSlug(sentence: string): string {
  return sentence
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export function soutienPhraseAudioPath(sentence: string): string {
  return `/lib/audio/soutien/phrases/${phraseAudioSlug(sentence)}.mp3`
}
