import { defaultEntriesFor, DEFAULT_SEPT_FAMILLES } from './defaults'
import { templateFor } from './templates'
import type { GameEntry } from './types'

/** Convertit les entrées en texte éditable (une ligne = une entrée). */
export function entriesToText(typeId: string, entries: GameEntry[]): string {
  switch (typeId) {
    case 'jeux-vrai-faux':
      return entries
        .map((e) => `${e.isTrue === false ? 'F' : 'V'} · ${e.text}`)
        .join('\n')
    case 'jeux-devinettes':
      return entries
        .map((e) => [e.text, ...(e.clues ?? [])].join(' | '))
        .join('\n')
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

/** Parse le texte du panneau enseignant·e. */
export function textToEntries(typeId: string, text: string): GameEntry[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return defaultEntriesFor(typeId)

  const tpl = templateFor(typeId)
  const maxLen = tpl?.maxTextLen ?? 40

  switch (typeId) {
    case 'jeux-vrai-faux':
      return lines.slice(0, 8).map((line) => {
        const m = /^(V|F)\s*[·.:\-–]?\s*(.+)$/i.exec(line)
        if (m) {
          return {
            text: clip(m[2]!, maxLen),
            isTrue: m[1]!.toUpperCase() === 'V',
          }
        }
        return { text: clip(line, maxLen), isTrue: true }
      })
    case 'jeux-devinettes':
      return lines.slice(0, 6).map((line) => {
        const parts = line.split('|').map((p) => p.trim()).filter(Boolean)
        const [word = 'mot', ...clues] = parts
        while (clues.length < 3) clues.push('…')
        return { text: clip(word, maxLen), clues: clues.slice(0, 3).map((c) => clip(c, 40)) }
      })
    case 'jeux-intrus':
      return lines.slice(0, 4).flatMap((line, groupIndex) => {
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
          ...normals.map((text) => ({ text: clip(text, maxLen), category })),
          { text: clip(intrus, maxLen), category, isIntrus: true },
        ]
      })
    case 'jeux-tri':
    case 'jeux-sept-familles': {
      const maxGroups = typeId === 'jeux-sept-familles' ? 7 : 3
      const maxWords = typeId === 'jeux-sept-familles' ? 4 : 4
      return lines.slice(0, maxGroups).flatMap((line) => {
        const m = /^([^:]+)\s*:\s*(.+)$/.exec(line)
        const category = clip((m?.[1] ?? 'Catégorie').trim(), 20)
        const words = (m?.[2] ?? line)
          .split(/[,;]/)
          .map((w) => w.trim())
          .filter(Boolean)
          .slice(0, maxWords)
        while (words.length < maxWords) words.push(`mot${words.length + 1}`)
        return words.map((text) => ({ text: clip(text, maxLen), category }))
      })
    }
    case 'jeux-bandes-mots':
      return [{ text: clip(lines.join(' '), 120) }]
    case 'jeux-phrases-texte':
      return lines.slice(0, 8).map((text) => ({ text: clip(text, maxLen) }))
    case 'jeux-memory':
      return lines.slice(0, 6).map((text) => ({ text: clip(text, maxLen) }))
    case 'jeux-loto':
      return lines.slice(0, 24).map((text) => ({ text: clip(text, maxLen) }))
    case 'jeux-dominos':
      return lines.slice(0, 8).map((text) => ({ text: clip(text, maxLen) }))
    case 'jeux-plateau':
      return lines.slice(0, 12).map((text) => ({ text: clip(text, maxLen) }))
    case 'jeux-de-roue':
      return lines.slice(0, 6).map((text) => ({ text: clip(text, maxLen) }))
    case 'jeux-vocabulaire':
    default:
      return lines.slice(0, tpl?.entryCount ?? 12).map((text) => ({ text: clip(text, maxLen) }))
  }
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
