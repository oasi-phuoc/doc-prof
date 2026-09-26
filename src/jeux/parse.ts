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
    case 'jeux-intrus': {
      const groups = new Map<string, GameEntry[]>()
      for (const e of entries) {
        const key = e.category || 'groupe'
        const list = groups.get(key) ?? []
        list.push(e)
        groups.set(key, list)
      }
      return [...groups.values()]
        .map((group) => {
          const normals = group.filter((g) => !g.isIntrus).map((g) => g.text)
          const intrus = group.find((g) => g.isIntrus)?.text ?? ''
          return `${normals.join(', ')} | ${intrus}`
        })
        .join('\n')
    }
    case 'jeux-tri': {
      const byCat = new Map<string, string[]>()
      for (const e of entries) {
        const key = e.category || 'Divers'
        const list = byCat.get(key) ?? []
        list.push(e.text)
        byCat.set(key, list)
      }
      return [...byCat.entries()].map(([cat, words]) => `${cat} : ${words.join(', ')}`).join('\n')
    }
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
    case 'jeux-intrus':
      parsed = lines.slice(0, 4).flatMap((line, groupIndex) => {
        const [left = '', right = ''] = line.split('|').map((p) => p.trim())
        const normals = left
          .split(/[,;]/)
          .map((w) => w.trim())
          .filter(Boolean)
          .slice(0, 3)
        while (normals.length < 3) normals.push(`mot${normals.length + 1}`)
        const intrus = right || 'intrus'
        const category = `groupe-${groupIndex + 1}`
        return [
          ...normals.map((word) => ({ text: clip(word, maxLen), category })),
          { text: clip(intrus, maxLen), category, isIntrus: true },
        ]
      })
      break
    case 'jeux-tri':
    case 'jeux-sept-familles': {
      const maxGroups = typeId === 'jeux-sept-familles' ? 7 : 3
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
      parsed = lines.slice(0, 8).map((line) => ({ text: clip(line, maxLen) }))
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
