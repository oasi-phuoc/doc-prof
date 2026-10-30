/**
 * Tags des audios CO découpés / typés.
 * `scenario` = petit dialogue d’association (scénario + scène), une piste = une situation.
 * `court` = mini-extrait pour « 6 audios courts » (1 question tirée du pool de la piste).
 * `moyen` = extrait moyen pour « 3 audios moyens » (2 questions tirées du pool de la piste).
 */
export const TCF_AUDIO_TAG_SCENARIO = 'scenario' as const
export const TCF_AUDIO_TAG_COURT = 'court' as const
export const TCF_AUDIO_TAG_MOYEN = 'moyen' as const

export type TcfAudioTag =
  | typeof TCF_AUDIO_TAG_SCENARIO
  | typeof TCF_AUDIO_TAG_COURT
  | typeof TCF_AUDIO_TAG_MOYEN
  | (string & {})

export function tcfAudioHasTag(tags: readonly string[] | undefined, tag: string): boolean {
  return (tags ?? []).includes(tag)
}
