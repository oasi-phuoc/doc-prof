/** Lexique illustré pour le type « Mots à apprendre » (Voc). */
export type VocabLearnWord = {
  id: string
  label: string
  /** Chemin public de l’image (webp), optionnel. */
  imageSrc?: string
}

const PRESENTER_IMG = '/lib/images/vocabulaire/presenter'
const ADMIN_IMG = '/lib/images/vocabulaire/administration'

/** Mots de « Se présenter » — identité et nationalités. */
export const PRESENTER_LEARN_WORDS: VocabLearnWord[] = [
  { id: 'identite', label: 'identité', imageSrc: `${ADMIN_IMG}/carte-didentite.webp` },
  { id: 'nom', label: 'nom' },
  { id: 'prenom', label: 'prénom' },
  { id: 'age', label: 'âge', imageSrc: `${PRESENTER_IMG}/age.webp` },
  { id: 'nationalite', label: 'nationalité' },
  { id: 'francais', label: 'français', imageSrc: `${PRESENTER_IMG}/france.webp` },
  { id: 'anglais', label: 'anglais', imageSrc: `${PRESENTER_IMG}/angleterre.webp` },
  { id: 'chinois', label: 'chinois', imageSrc: `${PRESENTER_IMG}/chine.webp` },
  { id: 'americain', label: 'américain', imageSrc: `${PRESENTER_IMG}/etats-unis.webp` },
  { id: 'italien', label: 'italien', imageSrc: `${PRESENTER_IMG}/italie.webp` },
  { id: 'bresilien', label: 'brésilien' },
  { id: 'coreen', label: 'coréen' },
  { id: 'espagnole', label: 'espagnole', imageSrc: `${PRESENTER_IMG}/espagne.webp` },
  { id: 'allemand', label: 'allemand', imageSrc: `${PRESENTER_IMG}/allemagne.webp` },
  { id: 'suisse', label: 'suisse', imageSrc: `${PRESENTER_IMG}/suisse.webp` },
  { id: 'belge', label: 'belge', imageSrc: `${PRESENTER_IMG}/belgique.webp` },
  { id: 'russe', label: 'russe', imageSrc: `${PRESENTER_IMG}/russie.webp` },
  { id: 'ukrainien', label: 'ukrainien', imageSrc: `${PRESENTER_IMG}/ukraine.webp` },
  { id: 'afghan', label: 'afghan', imageSrc: `${PRESENTER_IMG}/afghanistan.webp` },
  { id: 'turque', label: 'turque', imageSrc: `${PRESENTER_IMG}/turquie.webp` },
  { id: 'somalien', label: 'somalien', imageSrc: `${PRESENTER_IMG}/somalie.webp` },
  { id: 'erythreen', label: 'érythréen', imageSrc: `${PRESENTER_IMG}/erythree.webp` },
  { id: 'portugais', label: 'portugais', imageSrc: `${PRESENTER_IMG}/portugal.webp` },
]

const VOCAB_LEARN_BY_TOPIC: Record<string, VocabLearnWord[]> = {
  'fr-presenter': PRESENTER_LEARN_WORDS,
}

export function vocabLearnWordsFor(topic: string): VocabLearnWord[] {
  return VOCAB_LEARN_BY_TOPIC[topic] ?? []
}

export function isVocabLearnType(typeId: string): boolean {
  return typeId.endsWith('-voc-mots')
}

export function defaultVocabSelected(topic: string, rows = 3, cols = 3): string[] {
  const words = vocabLearnWordsFor(topic)
  const n = Math.max(1, rows) * Math.max(1, cols)
  return words.slice(0, n).map((word) => word.id)
}

export function resolveVocabEntries(
  topic: string,
  selectedIds: string[] | undefined,
  rows: number,
  cols: number,
): VocabLearnWord[] {
  const bank = vocabLearnWordsFor(topic)
  const byId = new Map(bank.map((word) => [word.id, word]))
  const ids =
    selectedIds && selectedIds.length > 0
      ? selectedIds.filter((id) => byId.has(id))
      : defaultVocabSelected(topic, rows, cols)
  const capacity = Math.max(1, rows) * Math.max(1, cols)
  return ids.slice(0, capacity).map((id) => byId.get(id)!)
}
