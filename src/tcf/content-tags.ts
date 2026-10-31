/**
 * Tags de contenu CE / PE (comme les tags audio CO).
 * Une entrée peut cumuler plusieurs tags ; le filtre d’emplacement n’en exige qu’un.
 */
import { tcfPosition } from './catalog'
import { tcfGroupId } from './sources'
import type { TcfExercise } from './types'

export const TCF_CE_TAG_INSTRUCTIONS = 'instructions' as const
export const TCF_CE_TAG_TEMPS = 'temps' as const
export const TCF_CE_TAG_ESPACE = 'espace' as const
export const TCF_CE_TAG_INFORMATIONS = 'informations' as const

export type TcfCeTag =
  | typeof TCF_CE_TAG_INSTRUCTIONS
  | typeof TCF_CE_TAG_TEMPS
  | typeof TCF_CE_TAG_ESPACE
  | typeof TCF_CE_TAG_INFORMATIONS

export const TCF_PE_TAG_FORMULAIRE = 'formulaire' as const
export const TCF_PE_TAG_DIALOGUE = 'dialogue' as const
export const TCF_PE_TAG_MESSAGE = 'message' as const
export const TCF_PE_TAG_EMAIL = 'email' as const

export type TcfPeTag =
  | typeof TCF_PE_TAG_FORMULAIRE
  | typeof TCF_PE_TAG_DIALOGUE
  | typeof TCF_PE_TAG_MESSAGE
  | typeof TCF_PE_TAG_EMAIL

const CE_TAGS: readonly TcfCeTag[] = [
  TCF_CE_TAG_INSTRUCTIONS,
  TCF_CE_TAG_TEMPS,
  TCF_CE_TAG_ESPACE,
  TCF_CE_TAG_INFORMATIONS,
]

const PE_TAGS: readonly TcfPeTag[] = [
  TCF_PE_TAG_FORMULAIRE,
  TCF_PE_TAG_DIALOGUE,
  TCF_PE_TAG_MESSAGE,
  TCF_PE_TAG_EMAIL,
]

/**
 * Ancien numéro d’épreuve CE dans l’id → tag.
 * Pos. 2 était « espace », pos. 3 « temps » : on conserve le sens du contenu.
 */
function ceTagFromLegacyPosition(pos: number | undefined): TcfCeTag | null {
  if (pos === 1) return TCF_CE_TAG_INSTRUCTIONS
  if (pos === 2) return TCF_CE_TAG_ESPACE
  if (pos === 3) return TCF_CE_TAG_TEMPS
  if (pos === 4) return TCF_CE_TAG_INFORMATIONS
  return null
}

/** Tag CE de l’emplacement (ex. 6→1 instructions, 7→2 temps, 8→3 espace, 9→4 informations). */
export function tcfCeTagForSlot(numero: number | undefined): TcfCeTag | null {
  if (numero === 1) return TCF_CE_TAG_INSTRUCTIONS
  if (numero === 2) return TCF_CE_TAG_TEMPS
  if (numero === 3) return TCF_CE_TAG_ESPACE
  if (numero === 4) return TCF_CE_TAG_INFORMATIONS
  return null
}

/** Tag PE de l’emplacement (ex. 10→1 formulaire … 13→4 email). */
export function tcfPeTagForSlot(numero: number | undefined): TcfPeTag | null {
  if (numero === 1) return TCF_PE_TAG_FORMULAIRE
  if (numero === 2) return TCF_PE_TAG_DIALOGUE
  if (numero === 3) return TCF_PE_TAG_MESSAGE
  if (numero === 4) return TCF_PE_TAG_EMAIL
  return null
}

export function tcfContentHasTag(tags: readonly string[] | undefined, tag: string): boolean {
  return (tags ?? []).includes(tag)
}

/** Tags CE explicites, sinon dérivés de la position dans l’id. */
export function tcfCeTagsOf(ex: TcfExercise): TcfCeTag[] {
  const explicit = (ex.tags ?? []).filter((t): t is TcfCeTag =>
    (CE_TAGS as readonly string[]).includes(t),
  )
  if (explicit.length > 0) return explicit
  const fromPos = ceTagFromLegacyPosition(tcfPosition(ex.id))
  return fromPos ? [fromPos] : []
}

/** Tags PE explicites, sinon dérivés du type / groupe. */
export function tcfPeTagsOf(ex: TcfExercise): TcfPeTag[] {
  const explicit = (ex.tags ?? []).filter((t): t is TcfPeTag =>
    (PE_TAGS as readonly string[]).includes(t),
  )
  if (explicit.length > 0) return explicit
  const group = tcfGroupId(ex)
  if ((PE_TAGS as readonly string[]).includes(group)) return [group as TcfPeTag]
  return []
}

export function tcfCeEntriesWithTag(
  exercises: readonly TcfExercise[],
  tag: TcfCeTag,
): TcfExercise[] {
  return exercises.filter((ex) => ex.competence === 'CE' && tcfCeTagsOf(ex).includes(tag))
}

export function tcfPeEntriesWithTag(
  exercises: readonly TcfExercise[],
  tag: TcfPeTag,
): TcfExercise[] {
  return exercises.filter((ex) => ex.competence === 'PE' && tcfPeTagsOf(ex).includes(tag))
}
