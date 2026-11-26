import { module100 } from './banks/module-100-v001.generated.ts'
import { module101 } from './banks/module-101-v001.generated.ts'
import { module102 } from './banks/module-102-v001.generated.ts'
import { module103 } from './banks/module-103-v001.generated.ts'
import { module104 } from './banks/module-104-v001.generated.ts'
import { module105 } from './banks/module-105-v001.generated.ts'
import { module106 } from './banks/module-106-v001.generated.ts'
import { module107 } from './banks/module-107-v001.generated.ts'
import { module108 } from './banks/module-108-v001.generated.ts'
import { module109 } from './banks/module-109-v001.generated.ts'
import { module110 } from './banks/module-110-v001.generated.ts'
import { module201 } from './banks/module-201-v001.generated.ts'
import { module202 } from './banks/module-202-v001.generated.ts'
import { module308 } from './banks/module-308-v001.generated.ts'
import { module613 } from './banks/module-613-v001.generated.ts'
import { module805 } from './banks/module-805-v001.generated.ts'
import { module902 } from './banks/module-902-v001.generated.ts'
import { illustratedReferences } from './banks/references-v002.generated.ts'
import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { LogistiqueDiploma } from './catalog'

type ReferenceBlock = Exclude<GrammarTheoryBlock, { kind: 'page' }>

type UnitContent =
  | { kind: 'objectifs-apercu' | 'theorie' | 'glossaire'; blocks: ReferenceBlock[] }
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

const serviceClientPublication: LogistiquePublication = {
  revision: 'logistique-201-202-v001',
  units: [
    ...module100, ...module101, ...module102, ...module103, ...module104,
    ...module105, ...module106, ...module107, ...module108, ...module109,
    ...module110, ...module201, ...module202, ...module308, ...module613,
    ...module805, ...module902,
  ],
}
const revisedReferenceIds = new Set<string>(illustratedReferences.map(({ id }) => id))

/** Ajouter une publication après validation. Garder les versions utilisées par les recettes. */
export const logistiquePublications: readonly LogistiquePublication[] = [
  { revision: 'logistique-initiale', units: [] },
  { revision: 'logistique-105-v001', units: module105 },
  { revision: 'logistique-101-v001', units: [...module101, ...module105] },
  { revision: 'logistique-102-v001', units: [...module101, ...module102, ...module105] },
  { revision: 'logistique-308-v001', units: [...module101, ...module102, ...module105, ...module308] },
  { revision: 'logistique-613-v001', units: [...module101, ...module102, ...module105, ...module308, ...module613] },
  { revision: 'logistique-805-v001', units: [...module101, ...module102, ...module105, ...module308, ...module613, ...module805] },
  { revision: 'logistique-902-v001', units: [...module101, ...module102, ...module105, ...module308, ...module613, ...module805, ...module902] },
  {
    revision: 'logistique-103-104-v001',
    units: [...module101, ...module102, ...module103, ...module104, ...module105, ...module308, ...module613, ...module805, ...module902],
  },
  {
    revision: 'logistique-100-v001',
    units: [
      ...module100, ...module101, ...module102, ...module103, ...module104,
      ...module105, ...module308, ...module613, ...module805, ...module902,
    ],
  },
  {
    revision: 'logistique-106-107-108-v001',
    units: [
      ...module100, ...module101, ...module102, ...module103, ...module104,
      ...module105, ...module106, ...module107, ...module108, ...module308,
      ...module613, ...module805, ...module902,
    ],
  },
  {
    revision: 'logistique-109-110-v001',
    units: [
      ...module100, ...module101, ...module102, ...module103, ...module104,
      ...module105, ...module106, ...module107, ...module108, ...module109,
      ...module110, ...module308, ...module613, ...module805, ...module902,
    ],
  },
  serviceClientPublication,
  {
    revision: 'logistique-references-v002',
    units: [...serviceClientPublication.units.filter(({ id }) => !revisedReferenceIds.has(id)), ...illustratedReferences],
  },
]

export const currentLogistiquePublication = logistiquePublications[logistiquePublications.length - 1]!

export function logistiquePublication(revision?: string): LogistiquePublication | undefined {
  return revision ? logistiquePublications.find((entry) => entry.revision === revision) : currentLogistiquePublication
}
