/** Métadonnées du menu ; les données sont uniquement dans curriculum/data. */
import type {GramExerciseKindId} from './kinds'
export const FAMILLE_KIND_IDS = ["fam-det","fam-faire-part","fam-photo","fam-email","fam-co","fam-pe"] as const satisfies readonly GramExerciseKindId[]
export type FamilleKindId=(typeof FAMILLE_KIND_IDS)[number]
export function isFamilleKind(id:string):id is FamilleKindId {return (FAMILLE_KIND_IDS as readonly string[]).includes(id)}
export const FAMILLE_DEFAULT_COUNT:Record<FamilleKindId,number>={"fam-det":8,"fam-faire-part":6,"fam-photo":5,"fam-email":5,"fam-co":6,"fam-pe":1}
export function familleFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (
    kindId === 'fam-det' ||
    kindId === 'fam-pronoms-1' ||
    kindId === 'fam-pronoms-2' ||
    kindId === 'fam-faire-part'
  ) {
    return 'header2'
  }
  if (
    kindId === 'fam-photo' ||
    kindId === 'fam-recit' ||
    kindId === 'fam-email' ||
    kindId === 'fam-co'
  ) {
    return 'margin3'
  }
  return 'none'
}
