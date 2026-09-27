import { defaultEntriesFor } from './defaults'
import { templateFor } from './templates'
import type { GameEntry } from './types'

/** Convertit les entrées en texte éditable (une ligne = une entrée). */
export function entriesToText(typeId: string, entries: GameEntry[]): string {
  switch (typeId) {
    case 'jeux-devinettes':
      return entries
        .map((e) => {
          const clue = (e.clues ?? []).join('\n').trim()
          return clue ? `${e.text}\n${clue}` : e.text
        })
        .join('\n\n')
    case 'jeux-intrus':
      // Lot de mots du thème (intrus tirés à la génération) ou blocs structurés (libre).
      if (entries.some((e) => e.words && e.words.length > 0)) {
        return entries
          .map((e) => {
            const words = [...(e.words ?? [])]
            while (words.length < 4) words.push('')
            return [
              `Intrus : ${e.text}`,
              ...words.slice(0, 4).map((w, i) => `Mot ${i + 1} : ${w}`),
            ].join('\n')
          })
          .join('\n\n')
      }
      return entries.map((e) => e.text).join('\n')
    default:
      return entries.map((e) => e.text).join('\n')
  }
}

/** Parse le texte du panneau enseignant·e. Conserve les images par index si fournies. */
export function textToEntries(
  typeId: string,
  text: string,
  previous?: GameEntry[],
): GameEntry[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return defaultEntriesFor(typeId)

  const tpl = templateFor(typeId)
  const maxLen = tpl?.maxTextLen ?? 40

  let parsed: GameEntry[]
  switch (typeId) {
    case 'jeux-devinettes': {
      // Blocs séparés par une ligne vide : 1ʳᵉ ligne = mot, suite = phrase (retours à la ligne OK).
      // Rétrocompat : « mot | phrase » ou anciennes 3 phrases jointes.
      const blocks = text
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter(Boolean)
      if (blocks.length > 1 || (blocks[0] && !blocks[0].includes('|'))) {
        parsed = blocks.slice(0, 9).map((block) => {
          const parts = block.split(/\r?\n/)
          const word = (parts[0] ?? '').trim()
          const clueLines = parts.slice(1).map((p) => p.trimEnd())
          // Ancien format 3 phrases séparées → une seule phrase.
          const clue = clueLines.join('\n').trim()
          return {
            text: clip(word, maxLen),
            clues: clue ? [clue.slice(0, 280)] : [''],
          }
        })
      } else {
        parsed = lines.slice(0, 9).map((line) => {
          const parts = line.split('|').map((p) => p.trim())
          const [word = 'mot', ...rest] = parts
          const clue = rest.filter(Boolean).join('\n')
          return { text: clip(word, maxLen), clues: [clue.slice(0, 280)] }
        })
      }
      break
    }
    case 'jeux-intrus': {
      const blocks = text
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter(Boolean)
      const structured =
        blocks.some((b) => /^intrus\s*:/i.test(b)) ||
        lines.some((l) => l.includes('|') && /[,;]/.test(l.split('|')[0] ?? ''))
      if (structured && (blocks.length > 1 || (blocks[0] && !blocks[0].includes('|')))) {
        parsed = blocks.slice(0, 12).map((block, index) => {
          const parts = block
            .split(/\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean)
          let intrus = ''
          const words: string[] = []
          for (const part of parts) {
            const mIntrus = /^intrus\s*:\s*(.+)$/i.exec(part)
            const mMot = /^mot\s*\d+\s*:\s*(.+)$/i.exec(part)
            if (mIntrus) intrus = mIntrus[1]!.trim()
            else if (mMot) words.push(mMot[1]!.trim())
            else if (!intrus) intrus = part
            else words.push(part)
          }
          while (words.length < 4) words.push('')
          return {
            text: clip(intrus || `intrus${index + 1}`, maxLen),
            words: words.slice(0, 4).map((w) => clip(w, maxLen)),
            isIntrus: true,
          }
        })
      } else if (structured) {
        parsed = lines.slice(0, 12).map((line, groupIndex) => {
          const [left = '', right = ''] = line.split('|').map((p) => p.trim())
          const normals = left
            .split(/[,;]/)
            .map((w) => w.trim())
            .filter(Boolean)
            .slice(0, 4)
          while (normals.length < 4) normals.push(`mot${normals.length + 1}`)
          return {
            text: clip(right || `intrus${groupIndex + 1}`, maxLen),
            words: normals.map((w) => clip(w, maxLen)),
            isIntrus: true,
          }
        })
      } else {
        // Liste plate de mots du thème (intrus générés à l’impression).
        parsed = lines.slice(0, 20).map((line) => ({ text: clip(line, maxLen) }))
      }
      break
    }
    case 'jeux-memory':
      parsed = lines.slice(0, 6).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-loto':
      parsed = lines.slice(0, 27).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-dominos':
      parsed = lines.slice(0, 16).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-vocabulaire':
    default:
      parsed = lines.slice(0, tpl?.entryCount ?? 12).map((line) => ({ text: clip(line, maxLen) }))
  }

  if (!previous?.length) return parsed
  return parsed.map((entry, index) => {
    const key = entry.text.trim().toLowerCase()
    const prevByText = key
      ? previous.find((p) => p.text.trim().toLowerCase() === key)
      : undefined
    const prev = prevByText ?? previous[index]
    if (!prev) return entry
    return {
      ...entry,
      imageSrc: prev.imageSrc ?? entry.imageSrc,
      clues: entry.clues?.some((c) => c.trim()) ? entry.clues : prev.clues,
    }
  })
}

function clip(value: string, max: number): string {
  const t = value.trim()
  if (t.length <= max) return t
  return `${t.slice(0, Math.max(1, max - 1))}…`
}

/** Entrées effectives : saisie ou démo. */
export function resolveEntries(typeId: string, entries: GameEntry[] | undefined): GameEntry[] {
  if (entries && entries.length > 0) return entries
  return defaultEntriesFor(typeId)
}
