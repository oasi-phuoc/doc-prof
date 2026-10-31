import type { GrammarTheoryBlock, TheoryExampleItem } from '@/francais/grammar-theory'

/** Interligne utilisé entre les blocs d’une fiche FALC. */
export const ligne: GrammarTheoryBlock = { kind: 'paragraph', text: '{ligne/2}' }

export function p(text: string): GrammarTheoryBlock {
  return { kind: 'paragraph', text }
}

export function ex(
  items: TheoryExampleItem[],
  marker: 'puces' | 'numeros' = 'puces',
): GrammarTheoryBlock {
  return { kind: 'examples', marker, items }
}

export function table(
  headers: string[],
  rows: string[][],
  rowHeader = false,
): GrammarTheoryBlock {
  return { kind: 'table', colHeader: true, rowHeader, headers, rows }
}

/**
 * Gabarit des fiches finalisées (être, avoir, se présenter) :
 * intro, Je regarde, J’explique, page, Je retiens.
 */
export function sheet(opts: {
  title: string
  intro: string
  regarder: string[]
  expliquer: GrammarTheoryBlock[]
  retenir: GrammarTheoryBlock[]
}): GrammarTheoryBlock[] {
  return [
    { kind: 'heading', text: opts.title },
    p(opts.intro),
    ligne,
    { kind: 'section', role: 'regarder', blocks: [ex(opts.regarder)] },
    { kind: 'section', role: 'expliquer', blocks: opts.expliquer },
    { kind: 'page' },
    { kind: 'section', role: 'retenir', blocks: opts.retenir },
  ]
}
