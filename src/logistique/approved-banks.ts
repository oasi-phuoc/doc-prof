import { module101 } from './banks/module-101-v001.generated.ts'
import { module102 } from './banks/module-102-v001.generated.ts'
import { module105 } from './banks/module-105-v001.generated.ts'
import { module308 } from './banks/module-308-v001.generated.ts'
import { module613 } from './banks/module-613-v001.generated.ts'
import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { LogistiqueDiploma } from './catalog'

type ReferenceBlock = Exclude<GrammarTheoryBlock, { kind: 'page' }>

type UnitContent =
  | { kind: 'theorie' | 'glossaire'; blocks: ReferenceBlock[] }
  | { kind: 'maths'; prompt: string; calculation: string; answer: string }
  | { kind: 'verification'; prompt: string; answer: string; options?: readonly string[] }
  | { kind: 'situation'; prompt: string; answer: string }

export type LogistiqueUnit = UnitContent & {
  id: string
  module: string
  revision: string
  approvedFor: readonly LogistiqueDiploma[]
}

export type LogistiquePublication = {
  revision: string
  units: readonly LogistiqueUnit[]
}

/** Ajouter une publication après validation. Garder les versions utilisées par les recettes. */
export const logistiquePublications: readonly LogistiquePublication[] = [
  { revision: 'logistique-initiale', units: [] },
  { revision: 'logistique-105-v001', units: module105 },
  { revision: 'logistique-101-v001', units: [...module101, ...module105] },
  { revision: 'logistique-102-v001', units: [...module101, ...module102, ...module105] },
  { revision: 'logistique-308-v001', units: [...module101, ...module102, ...module105, ...module308] },
  { revision: 'logistique-613-v001', units: [...module101, ...module102, ...module105, ...module308, ...module613] },
]

export const currentLogistiquePublication = logistiquePublications[logistiquePublications.length - 1]!

export function logistiquePublication(revision?: string): LogistiquePublication | undefined {
  return revision ? logistiquePublications.find((entry) => entry.revision === revision) : currentLogistiquePublication
}
