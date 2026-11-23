/** Métadonnées du menu ; les données sont uniquement dans curriculum/data. */
import type {GramExerciseKindId} from './kinds'
export const NATIONALITE_KIND_IDS = ["nat-image","nat-feminin","nat-masculin","nat-pluriel","nat-accorder"] as const satisfies readonly GramExerciseKindId[]
export type NationaliteKindId=(typeof NATIONALITE_KIND_IDS)[number]
export function isNationaliteKind(id:string):id is NationaliteKindId {return (NATIONALITE_KIND_IDS as readonly string[]).includes(id)}
export const NATIONALITE_DEFAULT_COUNT:Record<NationaliteKindId,number>={"nat-image":6,"nat-feminin":6,"nat-masculin":6,"nat-pluriel":6,"nat-accorder":6}
export function nationaliteFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (kindId === 'nat-image' || kindId === 'nat-accorder') return 'header2'
  return 'none'
}
