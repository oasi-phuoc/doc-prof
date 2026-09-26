/**
 * Indices de Devinettes : 3 phrases par mot, sans révéler le thème / la liste
 * (ex. pas « C’est un fruit » si la liste est Fruits).
 */
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import type { VocabWordEntry } from '@/francais/vocab-learn'
import { vocabLearnWordsFor, vocabSubgroupsFor } from '@/francais/vocab-learn'

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
 * Produit 3 indices pour un libellé.
 * Priorité : définition nettoyée, synonyme, phrase d’exemple, propriétés.
 */
export function cluesForWord(
  label: string,
  topicId?: string,
  subgroupId?: string,
  existing?: string[],
): [string, string, string] {
  const filled = (existing ?? []).map((c) => c.trim()).filter(Boolean)
  if (filled.length >= 3) return [filled[0]!, filled[1]!, filled[2]!]

  const avoid = avoidLabelsFor(topicId, subgroupId)
  const word = findVocabWord(label)
  const candidates: string[] = [...filled]

  const push = (raw: string | undefined) => {
    if (!raw?.trim()) return
    const cleaned = cleanSentence(raw, avoid)
    if (!cleaned || cleaned.length < 8) return
    if (looksLeaky(cleaned, avoid)) return
    if (candidates.some((c) => c.toLowerCase() === cleaned.toLowerCase())) return
    candidates.push(cleaned)
  }

  if (word) {
    push(word.definition)
    if (word.synonym) push(`On dit aussi « ${word.synonym} ».`)
    if (word.antonym) push(`Ce n’est pas le contraire de « ${word.antonym} ».`)
    const phrasePool = [
      ...(word.sentences?.phrase?.a1 ?? []),
      ...(word.sentences?.phrase?.a2 ?? []),
      ...(word.sentences?.dictee?.a1 ?? []),
    ]
    for (const p of phrasePool) {
      // Remplacer le trou éventuel par une allusion, pas par le mot.
      const hinted = p.replace(/___+/g, 'cela').replace(new RegExp(label, 'gi'), 'cela')
      push(hinted)
      if (candidates.length >= 3) break
    }
    if (word.syllables?.length > 1) {
      push(`Le mot a ${word.syllables.length} syllabes.`)
    }
    if (word.masculine && word.feminine) {
      push('Ce mot a une forme au masculin et au féminin.')
    } else if (word.feminine && !word.masculine) {
      push('On dit « la » ou « une » devant ce mot.')
    } else if (word.masculine && !word.feminine) {
      push('On dit « le » ou « un » devant ce mot.')
    }
  }

  // Secours génériques (sans nommer le thème).
  const fallbacks = [
    'On peut le voir ou le toucher dans la vie quotidienne.',
    'Les enfants apprennent souvent ce mot en classe.',
    'Essayez de le décrire sans dire son nom.',
    'À quoi ça sert ? Réfléchissez à son usage.',
    'Imaginez une phrase simple avec ce mot.',
  ]
  for (const f of fallbacks) {
    push(f)
    if (candidates.length >= 3) break
  }

  while (candidates.length < 3) candidates.push('…')
  return [candidates[0]!, candidates[1]!, candidates[2]!]
}

/** Enrichit les entrées avec 3 indices (Devinettes). */
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
  const groups = vocabSubgroupsFor(topicId)
  const others = groups.filter((g) => g.id !== subgroupId)
  const words = (others.length ? others : groups).flatMap((g) => g.words.map((w) => w.label))
  // Si un seul sous-groupe : prendre d’autres thèmes.
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
