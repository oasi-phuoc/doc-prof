/** Banques mots/images pour les fiches-jeux (thème FR + lecture). */
import { VOCAB_TOPIC_META } from '@/francais/vocab-registry'
import { vocabLearnWordsFor, vocabSubgroupsFor } from '@/francais/vocab-learn'
import { createRng, shuffle } from '@/math/rng'
import { cluesForWord } from './clues'
import { resolveGameImageSrc } from './image-resolve'
import { LECTURE_WORDS_BY_TOPIC, lectureWordsForTopic, type LectureWord } from './lecture-bank'
import { entriesToText } from './parse'
import { templateFor } from './templates'
import type { GameEntry } from './types'

export type GameSource = 'theme' | 'lecture' | 'libre'

export type BankItem = { id: string; label: string; imageSrc?: string }

export function isGameBankType(typeId: string): boolean {
  return (
    typeId === 'jeux-vocabulaire' ||
    typeId === 'jeux-memory' ||
    typeId === 'jeux-loto' ||
    typeId === 'jeux-dominos' ||
    typeId === 'jeux-devinettes' ||
    typeId === 'jeux-intrus'
  )
}

/** Thème FR par défaut (beaucoup d’images vocab + lecture). */
export const DEFAULT_GAME_TOPIC = 'fr-nourriture'

export function themeBankItems(topicId: string, subgroupId?: string): BankItem[] {
  const byLabel = new Map<string, BankItem>()
  for (const w of vocabLearnWordsFor(topicId, subgroupId)) {
    byLabel.set(w.label.toLowerCase(), {
      id: w.id,
      label: w.label,
      imageSrc: resolveGameImageSrc(w.label, w.imageSrc),
    })
  }
  // Images lecture en secours pour les libellés déjà dans la liste uniquement.
  // Ne pas ajouter d’autres mots lecture (sinon Fruits affiche aussi Légumes, etc.).
  for (const w of lectureWordsForTopic(topicId)) {
    const key = w.label.toLowerCase()
    const prev = byLabel.get(key)
    if (!prev) continue
    if (!prev.imageSrc && w.imageSrc) {
      byLabel.set(key, { ...prev, imageSrc: resolveGameImageSrc(w.label, w.imageSrc) })
    }
  }
  return [...byLabel.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr'))
}

export function lectureBankItems(topicId?: string): BankItem[] {
  const list: LectureWord[] =
    !topicId || topicId === 'tous' ? lectureWordsForTopic('tous') : lectureWordsForTopic(topicId)
  return [...list]
    .map((w) => ({ id: w.id, label: w.label, imageSrc: w.imageSrc }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
}

export function lectureTopicOptions(): Array<{ id: string; label: string }> {
  const labelFor = (id: string) =>
    id === 'autres'
      ? 'Autres'
      : (VOCAB_TOPIC_META.find((t) => t.id === id)?.label ?? id.replace(/^fr-/, ''))
  const topicIds = Object.keys(LECTURE_WORDS_BY_TOPIC).filter((id) => id !== 'autres')
  topicIds.sort((a, b) => labelFor(a).localeCompare(labelFor(b), 'fr'))
  return [
    { id: 'tous', label: 'Tous les mots' },
    ...topicIds.map((id) => ({ id, label: labelFor(id) })),
    ...(LECTURE_WORDS_BY_TOPIC.autres?.length ? [{ id: 'autres', label: 'Autres' }] : []),
  ]
}

export function themeTopicOptions(): Array<{ id: string; label: string }> {
  return VOCAB_TOPIC_META.filter((t) => t.subgroups.length > 0).map((t) => ({
    id: t.id,
    label: t.label,
  }))
}

export function padGameEntries(entries: GameEntry[], count: number): GameEntry[] {
  const out = entries.slice(0, count)
  while (out.length < count) out.push({ text: '' })
  return out
}

export function entriesFromBankItems(
  items: BankItem[],
  count: number,
  previous?: GameEntry[],
  options?: { topicId?: string; subgroupId?: string; withClues?: boolean },
): GameEntry[] {
  return padGameEntries(
    items.slice(0, count).map((item) => {
      const prev = previous?.find((p) => p.text.trim().toLowerCase() === item.label.toLowerCase())
      const entry: GameEntry = {
        text: item.label,
        imageSrc: resolveGameImageSrc(item.label, item.imageSrc || prev?.imageSrc),
        clues: prev?.clues,
      }
      if (options?.withClues) {
        entry.clues = cluesForWord(item.label, options.topicId, options.subgroupId, prev?.clues)
      }
      return entry
    }),
    count,
  )
}

/** Contenu initial mode Thème pour un template banque. */
export function defaultThemeGameContent(typeId: string): {
  gameSource: GameSource
  gameTopic: string
  gameSelectedIds: string[]
  gameEntries: GameEntry[]
  gameText: string
} {
  const tpl = templateFor(typeId)
  const count = tpl?.entryCount ?? 12
  const topic = DEFAULT_GAME_TOPIC
  const subgroup = vocabSubgroupsFor(topic)[0]?.id
  const items = themeBankItems(topic, subgroup)
  const picked = items.slice(0, Math.min(count, items.length))
  const gameEntries = entriesFromBankItems(picked, picked.length, undefined, {
    topicId: topic,
    subgroupId: subgroup,
    withClues: typeId === 'jeux-devinettes',
  })
  return {
    gameSource: 'theme',
    gameTopic: topic,
    gameSelectedIds: picked.map((p) => p.id),
    gameEntries,
    gameText: entriesToText(
      typeId,
      gameEntries.filter((e) => e.text),
    ),
  }
}

/**
 * Re-tire une série de mots (bouton Générer) :
 * mode banque → nouvel échantillon du thème ; mode libre → mélange l’ordre.
 */
export function reshuffleGameContent(
  typeId: string,
  seed: number,
  current: {
    gameSource?: GameSource
    gameTopic?: string
    gameSelectedIds?: string[]
    gameEntries?: GameEntry[]
  },
): {
  gameEntries: GameEntry[]
  gameText: string
  gameSelectedIds: string[]
} {
  const tpl = templateFor(typeId)
  const maxCards = tpl?.entryCount ?? 12
  const rng = createRng(seed)
  const source = current.gameSource ?? 'theme'
  const topic = current.gameTopic ?? DEFAULT_GAME_TOPIC
  const withClues = typeId === 'jeux-devinettes'

  if (source === 'libre' || !isGameBankType(typeId)) {
    const prev = (current.gameEntries ?? []).filter((e) => e.text.trim())
    const shuffled = shuffle(rng, [...prev])
    const gameEntries = withClues
      ? shuffled.map((e) => ({
          ...e,
          clues: cluesForWord(e.text, topic, undefined, e.clues),
        }))
      : shuffled
    return {
      gameEntries,
      gameText: entriesToText(typeId, gameEntries),
      gameSelectedIds: current.gameSelectedIds ?? [],
    }
  }

  const customIds = (current.gameSelectedIds ?? []).filter((id) => id.startsWith('custom:'))
  const customEntries = (current.gameEntries ?? []).filter((e) => {
    const key = `custom:${e.text.trim().toLowerCase()}`
    return customIds.includes(key) && e.text.trim()
  })

  let subgroup: string | undefined
  let items: BankItem[]
  if (source === 'lecture') {
    items = lectureBankItems(topic)
  } else {
    const groups = vocabSubgroupsFor(topic)
    let bestId = groups[0]?.id
    let bestHit = -1
    for (const g of groups) {
      const bank = themeBankItems(topic, g.id)
      const ids = new Set(bank.map((b) => b.id))
      const hit = (current.gameSelectedIds ?? []).filter((id) => ids.has(id)).length
      if (hit > bestHit) {
        bestHit = hit
        bestId = g.id
      }
    }
    subgroup = bestId
    items = themeBankItems(topic, subgroup)
  }

  const room = Math.max(0, maxCards - customEntries.length)
  const want = Math.min(room, items.length)
  // Garder le même effectif que la sélection précédente si possible.
  const prevBankCount = (current.gameSelectedIds ?? []).filter((id) => !id.startsWith('custom:')).length
  const take = Math.min(want, prevBankCount > 0 ? prevBankCount : want)
  const picked = shuffle(rng, [...items]).slice(0, take)
  const bankEntries = entriesFromBankItems(picked, picked.length, current.gameEntries, {
    topicId: topic,
    subgroupId: subgroup,
    withClues,
  })
  const gameEntries = [...bankEntries, ...customEntries]
  const gameSelectedIds = [
    ...picked.map((p) => p.id),
    ...customEntries.map((e) => `custom:${e.text.trim().toLowerCase()}`),
  ]
  return {
    gameEntries,
    gameText: entriesToText(
      typeId,
      gameEntries.filter((e) => e.text),
    ),
    gameSelectedIds,
  }
}
