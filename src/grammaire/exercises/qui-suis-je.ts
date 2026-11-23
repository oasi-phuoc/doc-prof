/** Métadonnées du menu ; les données sont uniquement dans curriculum/data. */
import type {GramExerciseKindId} from './kinds'
export const QUI_SUIS_JE_KIND_IDS = ["infos-perso","verbe-pastilles","ordre","repondre-phrase","ecrire-question","formulaire","co-audio","ce-texte","portrait","po-images"] as const satisfies readonly GramExerciseKindId[]
export type QuiSuisJeKindId=(typeof QUI_SUIS_JE_KIND_IDS)[number]
export function isQuiSuisJeKind(id:string):id is QuiSuisJeKindId {return (QUI_SUIS_JE_KIND_IDS as readonly string[]).includes(id)}
export const QUI_SUIS_JE_DEFAULT_COUNT:Record<QuiSuisJeKindId,number>={"infos-perso":7,"verbe-pastilles":7,"ordre":6,"repondre-phrase":7,"ecrire-question":7,"formulaire":1,"co-audio":5,"ce-texte":5,"portrait":1,"po-images":1}
export function quiSuisJeFormUi(kindId: string): QuiSuisJeFormUi {
  if (kindId === 'co-audio' || kindId === 'ce-texte') return 'margin3'
  if (kindId === 'verbe-pastilles') return 'header2'
  return 'none'
}
export type QuiSuisJeFormUi='none'|'header2'|'margin3'
