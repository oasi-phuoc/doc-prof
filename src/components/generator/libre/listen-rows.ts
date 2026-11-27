import type { MathItem } from '@/math/types'

export type ListenRow = { word: string; audioSrc: string; imageSrc: string; hit: boolean }

export function listenWordKey(word: string): string {
  return word.trim().normalize('NFC').toLocaleLowerCase('fr')
}

export function listenRows(item: MathItem): ListenRow[] {
  const hits = new Set(item.labels?.map(listenWordKey))
  return (item.options ?? []).map((word, index) => ({
    word,
    audioSrc: item.optionAudioSrcs?.[index] ?? '',
    imageSrc: item.optionImages?.[index] ?? '',
    hit: hits.has(listenWordKey(word)),
  }))
}

export function replaceListenRows(item: MathItem, rows: ListenRow[]): MathItem {
  const labels = rows.filter(({ hit }) => hit).map(({ word }) => word)
  return {
    ...item,
    options: rows.map(({ word }) => word),
    optionAudioSrcs: rows.map(({ audioSrc }) => audioSrc),
    optionImages: item.optionImages?.length ? rows.map(({ imageSrc }) => imageSrc) : undefined,
    labels,
    answer: labels.join(' · '),
  }
}

export function resizeListenRows(previous: ListenRow[], candidates: ListenRow[], target: number): ListenRow[] {
  const kept = previous.slice(0, target)
  const words = new Set(kept.map(({ word }) => listenWordKey(word)))
  const audios = new Set(kept.flatMap(({ audioSrc }) => audioSrc ? [audioSrc] : []))
  for (const row of candidates) {
    if (kept.length >= target) break
    const key = listenWordKey(row.word)
    if (words.has(key) || (row.audioSrc && audios.has(row.audioSrc))) continue
    kept.push(row)
    words.add(key)
    if (row.audioSrc) audios.add(row.audioSrc)
  }
  return kept
}
