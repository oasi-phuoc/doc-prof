/**
 * Coloriage Alpha — 1 couleur = 1 son (graphies, pas lettre à lettre).
 * Priorité : nasaux → sons complexes → groupes consonantiques → voyelles → consonnes.
 */

export type AlphaTone =
  | 'vowel'
  | 'ou'
  | 'oi'
  | 'ai'
  | 'au'
  | 'eu'
  | 'an'
  | 'on'
  | 'in'
  | 'un'
  | 'cons'

export type AlphaSegment = {
  text: string
  tone: AlphaTone
}

/** Nasaux (longs d’abord). */
const NASALS: ReadonlyArray<{ g: string; tone: AlphaTone }> = [
  { g: 'ain', tone: 'in' },
  { g: 'ein', tone: 'in' },
  { g: 'an', tone: 'an' },
  { g: 'en', tone: 'an' },
  { g: 'am', tone: 'an' },
  { g: 'em', tone: 'an' },
  { g: 'on', tone: 'on' },
  { g: 'om', tone: 'on' },
  { g: 'in', tone: 'in' },
  { g: 'im', tone: 'in' },
  { g: 'yn', tone: 'in' },
  { g: 'ym', tone: 'in' },
  { g: 'un', tone: 'un' },
  { g: 'um', tone: 'un' },
]

/** Sons complexes (longs d’abord). */
const COMPLEX: ReadonlyArray<{ g: string; tone: AlphaTone }> = [
  { g: 'eau', tone: 'au' },
  { g: 'œu', tone: 'eu' },
  { g: 'oeu', tone: 'eu' },
  { g: 'ou', tone: 'ou' },
  { g: 'oi', tone: 'oi' },
  { g: 'ai', tone: 'ai' },
  { g: 'ei', tone: 'ai' },
  { g: 'au', tone: 'au' },
  { g: 'eu', tone: 'eu' },
]

/** Groupes consonantiques (un seul son, couleur noire). */
const CONS_GROUPS = ['ch', 'gn', 'ph', 'qu'] as const

const VOWEL_RE = /^[aeiouyàâäéèêëïîôöùûüÿœæ]$/i

function isVowelChar(ch: string): boolean {
  return VOWEL_RE.test(ch)
}

/** Nasale seulement en fin de mot ou devant une consonne (pas devant voyelle / double m|n). */
function nasalAllowed(word: string, start: number, len: number): boolean {
  const after = word.slice(start + len)
  if (!after) return true
  const next = after[0]!
  if (isVowelChar(next)) return false
  const last = word[start + len - 1]!
  if (/[mn]/i.test(last) && last.toLowerCase() === next.toLowerCase()) return false
  return true
}

function startsWithInsensitive(word: string, start: number, grapheme: string): boolean {
  const slice = word.slice(start, start + grapheme.length)
  if (slice.length !== grapheme.length) return false
  return slice.normalize('NFC').toLocaleLowerCase('fr-FR') === grapheme.normalize('NFC')
}

/**
 * Découpe un mot en segments Alpha (casse d’origine conservée).
 */
export function tokenizeAlpha(word: string): AlphaSegment[] {
  const raw = word.normalize('NFC')
  const out: AlphaSegment[] = []
  let i = 0
  while (i < raw.length) {
    const ch = raw[i]!
    // Espaces / ponctuation : noir, tel quel
    if (/\s/.test(ch) || /[-'’.,;:!?«»]/.test(ch)) {
      out.push({ text: ch, tone: 'cons' })
      i += 1
      continue
    }

    let matched: AlphaSegment | null = null

    for (const { g, tone } of NASALS) {
      if (startsWithInsensitive(raw, i, g) && nasalAllowed(raw, i, g.length)) {
        matched = { text: raw.slice(i, i + g.length), tone }
        break
      }
    }

    if (!matched) {
      for (const { g, tone } of COMPLEX) {
        if (startsWithInsensitive(raw, i, g)) {
          matched = { text: raw.slice(i, i + g.length), tone }
          break
        }
      }
    }

    if (!matched) {
      for (const g of CONS_GROUPS) {
        if (startsWithInsensitive(raw, i, g)) {
          matched = { text: raw.slice(i, i + g.length), tone: 'cons' }
          break
        }
      }
    }

    if (!matched) {
      if (isVowelChar(ch)) {
        matched = { text: ch, tone: 'vowel' }
      } else {
        matched = { text: ch, tone: 'cons' }
      }
    }

    out.push(matched)
    i += matched.text.length
  }
  return out
}

/** Classe CSS pour un ton Alpha. */
export function alphaToneClass(tone: AlphaTone): string {
  return `alpha-tone-${tone}`
}
