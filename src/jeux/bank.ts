/** Banques mots/images pour les fiches-jeux (thème FR + lecture). */
import { VOCAB_TOPIC_META } from '@/francais/vocab-registry'
import { vocabLearnWordsFor, vocabSubgroupsFor } from '@/francais/vocab-learn'
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
    typeId === 'jeux-devinettes'
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
  // Lecture rattachée au thème (sans doublon de libellé ; image lecture en secours).
  for (const w of lectureWordsForTopic(topicId)) {
    const key = w.label.toLowerCase()
    if (byLabel.has(key)) {
      const prev = byLabel.get(key)!
      if (!prev.imageSrc && w.imageSrc) {
        byLabel.set(key, { ...prev, imageSrc: resolveGameImageSrc(w.label, w.imageSrc) })
      }
      continue
    }
    byLabel.set(key, {
      id: w.id,
      label: w.label,
      imageSrc: resolveGameImageSrc(w.label, w.imageSrc),
    })
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
): GameEntry[] {
  return padGameEntries(
    items.slice(0, count).map((item) => {
      const prev = previous?.find((p) => p.text.trim().toLowerCase() === item.label.toLowerCase())
      return {
        text: item.label,
        imageSrc: resolveGameImageSrc(item.label, item.imageSrc || prev?.imageSrc),
        clues: prev?.clues,
      }
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
  const picked = items.slice(0, count)
  const gameEntries = entriesFromBankItems(picked, count)
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
