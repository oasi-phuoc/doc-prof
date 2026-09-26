/** Types et helpers pour les fiches de théorie grammaticale. */

export type GrammarTheoryBlock =
  | { kind: 'heading'; text: string; sub?: boolean }
  | { kind: 'paragraph'; text: string }
  | { kind: 'note'; text: string }
  | { kind: 'rule'; text: string; examples?: Array<{ correct: string; wrong?: string }> }
  | { kind: 'list'; title?: string; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }

export type GrammarTheoryDoc = {
  id: string
  /** 1-based — libellé « Théorie N ». */
  index: number
  title: string
  sourceSlug: string
  blocks: GrammarTheoryBlock[]
}

export function isGrammarTheoryType(typeId: string): boolean {
  return /^(fr-[a-z]+)-gram-theorie-\d+$/.test(typeId)
}
