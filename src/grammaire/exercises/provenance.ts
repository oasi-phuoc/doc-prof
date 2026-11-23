/** Métadonnées du menu ; les données sont uniquement dans curriculum/data. */
import type {GramExerciseKindId} from './kinds'
export const PROVENANCE_KIND_IDS = ["prov-pays","prov-prep","prov-verbe","prov-phrases"] as const satisfies readonly GramExerciseKindId[]
export type ProvenanceKindId=(typeof PROVENANCE_KIND_IDS)[number]
export function isProvenanceKind(id:string):id is ProvenanceKindId {return (PROVENANCE_KIND_IDS as readonly string[]).includes(id)}
export const PROVENANCE_DEFAULT_COUNT:Record<ProvenanceKindId,number>={"prov-pays":6,"prov-prep":6,"prov-verbe":6,"prov-phrases":4}
export function provenanceFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (kindId === 'prov-pays' || kindId === 'prov-prep' || kindId === 'prov-verbe') return 'header2'
  return 'none'
}
