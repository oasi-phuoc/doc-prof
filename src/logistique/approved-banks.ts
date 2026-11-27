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
import { module203 } from './banks/module-203-v001.generated.ts'
import { module204 } from './banks/module-204-v001.generated.ts'
import { module205 } from './banks/module-205-v001.generated.ts'
import { module206 } from './banks/module-206-v001.generated.ts'
import { module207 } from './banks/module-207-v001.generated.ts'
import { module208 } from './banks/module-208-v001.generated.ts'
import { module209 } from './banks/module-209-v001.generated.ts'
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
const illustratedPublication: LogistiquePublication = {
  revision: 'logistique-references-v002',
  units: [...serviceClientPublication.units.filter(({ id }) => !revisedReferenceIds.has(id)), ...illustratedReferences],
}
const serviceOrganisationPublication: LogistiquePublication = {
  revision: 'logistique-203-204-v001',
  units: [...illustratedPublication.units, ...module203, ...module204],
}
const serviceCommunicationPublication: LogistiquePublication = {
  revision: 'logistique-205-206-v001',
  units: [...serviceOrganisationPublication.units, ...module205, ...module206],
}

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
  illustratedPublication,
  serviceOrganisationPublication,
  serviceCommunicationPublication,
  {
    revision: 'logistique-207-208-209-v001',
    units: [...serviceCommunicationPublication.units, ...module207, ...module208, ...module209],
  },
]

export const currentLogistiquePublication = logistiquePublications[logistiquePublications.length - 1]!

export function logistiquePublication(revision?: string): LogistiquePublication | undefined {
  return revision ? logistiquePublications.find((entry) => entry.revision === revision) : currentLogistiquePublication
}
