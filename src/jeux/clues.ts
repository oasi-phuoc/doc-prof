/**
 * Indices de Devinettes : une phrase par mot (retours à la ligne possibles),
 * sans révéler le thème / la liste.
 */
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import type { VocabWordEntry } from '@/francais/vocab-learn'
import { vocabLearnWordsFor, vocabSubgroupsFor } from '@/francais/vocab-learn'
import { VOCAB_IMAGE_THEMES } from './vocab-images'

const CATEGORY_LEAK =
  /\b(fruit|fruits|légume|légumes|animal|animaux|couleur|couleurs|vêtement|vêtements|métier|métiers|boisson|boissons|meuble|meubles|sport|sports|moyen de transport|transports?)\b/gi

function cleanSentence(text: string, avoid: string[]): string {
  let t = text.trim().replace(/\s+/g, ' ')
  for (const a of avoid) {
    if (!a.trim()) continue
    const re = new RegExp(`\\b${a.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    t = t.replace(re, '…')
  }
  t = t.replace(CATEGORY_LEAK, '…')
  t = t.replace(/\s*…\s*/g, ' ').replace(/\s{2,}/g, ' ').trim()
  if (t && !/[.!?…]$/.test(t)) t = `${t}.`
  return t
}

function looksLeaky(text: string, avoid: string[]): boolean {
  const lower = text.toLowerCase()
  if (CATEGORY_LEAK.test(text)) {
    CATEGORY_LEAK.lastIndex = 0
    return true
  }
  return avoid.some((a) => a && lower.includes(a.toLowerCase()))
}

/** Cherche le mot dans toutes les banques Voc. */
export function findVocabWord(label: string): VocabWordEntry | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return undefined
  for (const topic of VOCAB_TOPIC_BANKS) {
    for (const g of topic.subgroups) {
      const hit = g.words.find((w) => w.label.toLowerCase() === key)
      if (hit) return hit
    }
  }
  return undefined
}

function avoidLabelsFor(topicId?: string, subgroupId?: string): string[] {
  const out: string[] = []
  const topic = VOCAB_TOPIC_BANKS.find((t) => t.id === topicId)
  if (topic) {
    out.push(topic.label, ...topic.vocab.split(/[,/]/).map((s) => s.trim()))
  }
  for (const g of vocabSubgroupsFor(topicId ?? '')) {
    out.push(g.label)
    if (subgroupId && g.id === subgroupId) out.push(g.label)
  }
  return [...new Set(out.map((s) => s.trim()).filter(Boolean))]
}

/**
 * Une phrase-indice pour un libellé.
 * Priorité : texte déjà saisi, définition, phrase d’exemple, secours.
 */
export function cluesForWord(
  label: string,
  topicId?: string,
  subgroupId?: string,
  existing?: string[],
): string[] {
  const filled = (existing ?? []).map((c) => c.trim()).filter(Boolean)
  // Une seule phrase : conserver la 1ʳᵉ (ignore les anciennes 2ᵉ/3ᵉ).
  if (filled[0]) return [filled[0]!]

  const avoid = avoidLabelsFor(topicId, subgroupId)
  const word = findVocabWord(label)

  const pick = (raw: string | undefined): string | undefined => {
    if (!raw?.trim()) return undefined
    const cleaned = cleanSentence(raw, avoid)
    if (!cleaned || cleaned.length < 8) return undefined
    if (looksLeaky(cleaned, avoid)) return undefined
    return cleaned
  }

  if (word) {
    const fromDef = pick(word.definition)
    if (fromDef) return [fromDef]
    if (word.synonym) {
      const fromSyn = pick(`On dit aussi « ${word.synonym} ».`)
      if (fromSyn) return [fromSyn]
    }
    const phrasePool = [
      ...(word.sentences?.phrase?.a1 ?? []),
      ...(word.sentences?.phrase?.a2 ?? []),
      ...(word.sentences?.dictee?.a1 ?? []),
    ]
    for (const p of phrasePool) {
      const hinted = p.replace(/___+/g, 'cela').replace(new RegExp(label, 'gi'), 'cela')
      const fromPhrase = pick(hinted)
      if (fromPhrase) return [fromPhrase]
    }
  }

  return ['Décrivez ce mot sans dire son nom.']
}

/** Enrichit les entrées avec une phrase-indice (Devinettes). */
export function withAutoClues(
  entries: Array<{ text: string; clues?: string[]; imageSrc?: string }>,
  topicId?: string,
  subgroupId?: string,
): Array<{ text: string; clues: string[]; imageSrc?: string }> {
  return entries.map((e) => ({
    ...e,
    clues: cluesForWord(e.text, topicId, subgroupId, e.clues),
  }))
}

/** Mots d’un autre sous-groupe (intrus potentiels). */
export function outsiderWordsFor(
  topicId: string,
  subgroupId: string | undefined,
  limit = 40,
): string[] {
  const folder = topicId.replace(/^(jeux|fr)-/, '')
  if (VOCAB_IMAGE_THEMES.some((t) => t.id === folder)) {
    const pool = VOCAB_IMAGE_THEMES.filter((t) => t.id !== folder && t.id !== 'autre').flatMap((t) =>
      t.words.map((w) => w.label),
    )
    return [...new Set(pool)].slice(0, limit)
  }
  const groups = vocabSubgroupsFor(topicId)
  const others = groups.filter((g) => g.id !== subgroupId)
  const words = (others.length ? others : groups).flatMap((g) => g.words.map((w) => w.label))
  if (others.length === 0) {
    for (const topic of VOCAB_TOPIC_BANKS) {
      if (topic.id === topicId) continue
      for (const g of topic.subgroups) {
        for (const w of g.words) words.push(w.label)
        if (words.length >= limit) break
      }
      if (words.length >= limit) break
    }
  }
  return [...new Set(words)].slice(0, limit)
}

/** Tous les mots du thème (hors sous-groupe courant) via vocabLearn. */
export function themeWordsOutsideSubgroup(topicId: string, subgroupId?: string): string[] {
  const inGroup = new Set(
    vocabLearnWordsFor(topicId, subgroupId).map((w) => w.label.toLowerCase()),
  )
  const labels: string[] = []
  for (const g of vocabSubgroupsFor(topicId)) {
    if (subgroupId && g.id === subgroupId) continue
    for (const w of g.words) {
      if (!inGroup.has(w.label.toLowerCase())) labels.push(w.label)
    }
  }
  if (labels.length === 0) return outsiderWordsFor(topicId, subgroupId)
  return labels
}
