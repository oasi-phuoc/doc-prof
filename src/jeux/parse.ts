import { defaultEntriesFor, DEFAULT_SEPT_FAMILLES } from './defaults'
import { templateFor } from './templates'
import type { GameEntry } from './types'

/** Convertit les entrées en texte éditable (une ligne = une entrée). */
export function entriesToText(typeId: string, entries: GameEntry[]): string {
  switch (typeId) {
    case 'jeux-devinettes':
      return entries
        .map((e) => {
          const clues = [...(e.clues ?? [])]
          while (clues.length < 3) clues.push('')
          return [e.text, ...clues.slice(0, 3)].join('\n')
        })
        .join('\n\n')
    case 'jeux-intrus':
      return entries
        .map((e) => {
          const words = [...(e.words ?? [])]
          while (words.length < 4) words.push('')
          return [`Intrus : ${e.text}`, ...words.slice(0, 4).map((w, i) => `Mot ${i + 1} : ${w}`)].join(
            '\n',
          )
        })
        .join('\n\n')
    case 'jeux-tri':
      return entries
        .slice(0, 3)
        .map((e, index) => {
          const cat = (e.category || e.text || `Catégorie ${index + 1}`).trim()
          const words = [...(e.words ?? [])]
          while (words.length < 7) words.push('')
          return [
            `Catégorie : ${cat}`,
            ...words.slice(0, 7).map((w, i) => `Mot ${i + 1} : ${w}`),
          ].join('\n')
        })
        .join('\n\n')
    case 'jeux-sept-familles': {
      // Prefer structured defaults when entries are flat placeholders.
      if (entries.length >= 28 && entries.every((e) => !e.category)) {
        return DEFAULT_SEPT_FAMILLES.map(
          (f) => `${f.family} : ${f.members.join(', ')}`,
        ).join('\n')
      }
      const byCat = new Map<string, string[]>()
      for (const e of entries) {
        const key = e.category || e.text
        if (!e.category) continue
        const list = byCat.get(key) ?? []
        list.push(e.text)
        byCat.set(key, list)
      }
      if (byCat.size === 0) {
        return DEFAULT_SEPT_FAMILLES.map(
          (f) => `${f.family} : ${f.members.join(', ')}`,
        ).join('\n')
      }
      return [...byCat.entries()].map(([cat, words]) => `${cat} : ${words.join(', ')}`).join('\n')
    }
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
      // Blocs séparés par une ligne vide, ou lignes « mot | i1 | i2 | i3 » (rétrocompat).
      const blocks = text
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter(Boolean)
      if (blocks.length > 1 || (blocks[0] && !blocks[0].includes('|'))) {
        parsed = blocks.slice(0, 9).map((block) => {
          const parts = block
            .split(/\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean)
          const [word = '', c1 = '', c2 = '', c3 = ''] = parts
          return {
            text: clip(word, maxLen),
            clues: [c1, c2, c3].map((c) => clip(c, 80)),
          }
        })
      } else {
        parsed = lines.slice(0, 9).map((line) => {
          const parts = line.split('|').map((p) => p.trim())
          const [word = 'mot', ...clues] = parts
          while (clues.length < 3) clues.push('')
          return { text: clip(word, maxLen), clues: clues.slice(0, 3).map((c) => clip(c, 80)) }
        })
      }
      break
    }
    case 'jeux-intrus': {
      const blocks = text
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter(Boolean)
      if (blocks.length > 1 || (blocks[0] && !blocks[0].includes('|'))) {
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
      } else {
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
      }
      break
    }
    case 'jeux-tri': {
      const blocks = text
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter(Boolean)
      if (blocks.length > 1 || (blocks[0] && /^catégorie\s*:/i.test(blocks[0]))) {
        parsed = blocks.slice(0, 3).map((block, index) => {
          const parts = block
            .split(/\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean)
          let category = ''
          const words: string[] = []
          for (const part of parts) {
            const mCat = /^catégorie\s*:\s*(.+)$/i.exec(part)
            const mMot = /^mot\s*\d+\s*:\s*(.+)$/i.exec(part)
            if (mCat) category = mCat[1]!.trim()
            else if (mMot) words.push(mMot[1]!.trim())
            else if (!category) category = part
            else words.push(part)
          }
          while (words.length < 7) words.push('')
          const cat = clip(category || `Catégorie ${index + 1}`, 20)
          return {
            text: cat,
            category: cat,
            words: words.slice(0, 7).map((w) => clip(w, maxLen)),
          }
        })
      } else {
        // Rétrocompat : « Animaux : chat, chien, … »
        parsed = lines.slice(0, 3).map((line, index) => {
          const m = /^([^:]+)\s*:\s*(.+)$/.exec(line)
          const category = clip((m?.[1] ?? `Catégorie ${index + 1}`).trim(), 20)
          const words = (m?.[2] ?? '')
            .split(/[,;]/)
            .map((w) => w.trim())
            .filter(Boolean)
            .slice(0, 7)
          while (words.length < 7) words.push('')
          return {
            text: category,
            category,
            words: words.map((w) => clip(w, maxLen)),
          }
        })
      }
      break
    }
    case 'jeux-sept-familles': {
      const maxGroups = 7
      const maxWords = 4
      parsed = lines.slice(0, maxGroups).flatMap((line) => {
        const m = /^([^:]+)\s*:\s*(.+)$/.exec(line)
        const category = clip((m?.[1] ?? 'Catégorie').trim(), 20)
        const words = (m?.[2] ?? line)
          .split(/[,;]/)
          .map((w) => w.trim())
          .filter(Boolean)
          .slice(0, maxWords)
        while (words.length < maxWords) words.push(`mot${words.length + 1}`)
        return words.map((word) => ({ text: clip(word, maxLen), category }))
      })
      break
    }
    case 'jeux-bandes-mots':
      parsed = [{ text: clip(lines.join(' '), 120) }]
      break
    case 'jeux-phrases-texte':
      parsed = lines.slice(0, 8).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-memory':
      parsed = lines.slice(0, 6).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-loto':
      parsed = lines.slice(0, 27).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-dominos':
      parsed = lines.slice(0, 16).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-plateau':
      parsed = lines.slice(0, 12).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-de-roue':
      parsed = lines.slice(0, 6).map((line) => ({ text: clip(line, maxLen) }))
      break
    case 'jeux-vocabulaire':
    default:
      parsed = lines.slice(0, tpl?.entryCount ?? 12).map((line) => ({ text: clip(line, maxLen) }))
  }

  if (!previous?.length) return parsed
  return parsed.map((entry, index) => {
    const prev = previous[index]
    if (!prev?.imageSrc) return entry
    return { ...entry, imageSrc: prev.imageSrc }
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
