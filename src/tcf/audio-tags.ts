/**
 * Tags des audios CO découpés / typés.
 * `scenario` = petit dialogue d’association (scénario + scène), une piste = une situation.
 * `court` = mini-extrait pour « 6 audios courts » (1 question tirée du pool de la piste).
 * `moyen` = extrait moyen pour « 3 audios moyens » (2 questions tirées du pool de la piste).
 * `long` = document long pour « audio complet » (N questions, défaut 5).
 */
export const TCF_AUDIO_TAG_SCENARIO = 'scenario' as const
export const TCF_AUDIO_TAG_COURT = 'court' as const
export const TCF_AUDIO_TAG_MOYEN = 'moyen' as const
export const TCF_AUDIO_TAG_LONG = 'long' as const

export type TcfAudioTag =
  | typeof TCF_AUDIO_TAG_SCENARIO
  | typeof TCF_AUDIO_TAG_COURT
  | typeof TCF_AUDIO_TAG_MOYEN
  | typeof TCF_AUDIO_TAG_LONG
  | (string & {})

/** Tag court / moyen / long selon la taille du pool de questions. */
export function tcfTagForQuestionPoolSize(n: number): typeof TCF_AUDIO_TAG_COURT | typeof TCF_AUDIO_TAG_MOYEN | typeof TCF_AUDIO_TAG_LONG | null {
  if (n <= 0) return null
  if (n === 1) return TCF_AUDIO_TAG_COURT
  if (n <= 4) return TCF_AUDIO_TAG_MOYEN
  return TCF_AUDIO_TAG_LONG
}

export function tcfAudioHasTag(tags: readonly string[] | undefined, tag: string): boolean {
  return (tags ?? []).includes(tag)
}
