import type { ReactNode } from 'react'
import { lessonPhonemeSegmentsFromGraphemes } from '@/francais/soutien/phoneme'

/** Type 14 : colorie seulement la voyelle simple (Alpha), pas an / au / eau… */
export function highlightLessonPhonemes(text: string, graphemes: readonly string[]): ReactNode[] {
  if (!graphemes.length) return [text]
  return lessonPhonemeSegmentsFromGraphemes(text, graphemes).map((seg, index) => (
    <span key={`lp-${index}`} className={seg.hit ? 'syllable-vowel' : 'syllable-cons'}>
      {seg.text}
    </span>
  ))
}

/** Met en évidence les graphèmes cibles (voyelle du thème) dans une syllabe. */
export function highlightThemeLetters(text: string, graphemes: readonly string[]): ReactNode[] {
  const needles = [...graphemes]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  if (needles.length === 0) return [text]

  const lowerNeedles = needles.map((g) => g.toLowerCase())
  const out: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < text.length) {
    const rest = text.slice(i)
    const restLower = rest.toLowerCase()
    let matched: string | null = null
    for (let n = 0; n < lowerNeedles.length; n++) {
      const needle = lowerNeedles[n]!
      if (restLower.startsWith(needle)) {
        matched = rest.slice(0, needle.length)
        break
      }
    }
    if (matched) {
      out.push(
        <span key={`v-${key++}`} className="syllable-vowel">
          {matched}
        </span>,
      )
      i += matched.length
    } else {
      out.push(
        <span key={`c-${key++}`} className="syllable-cons">
          {text[i]}
        </span>,
      )
      i += 1
    }
  }
  return out
}
